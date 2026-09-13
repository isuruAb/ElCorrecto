import Busboy from "busboy";
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { AnalysisLanguage, AnalyzeResumeRequest } from "../types/analysis";
import { analyzeResume as runAnalysis } from "../services/aiAnalyzer";
import { downloadResume, uploadResume } from "../services/blobStorage";
import { extractResumeText } from "../services/documentIntelligence";

const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024;

export const parseAnalyzeRequest = async (
  request: HttpRequest,
): Promise<AnalyzeResumeRequest> => {
  const contentType = request.headers.get("content-type");
  if (!contentType?.startsWith("multipart/form-data")) {
    throw new Error("Request must use multipart/form-data");
  }

  const parser = Busboy({
    headers: { "content-type": contentType },
    limits: { fileSize: MAX_RESUME_SIZE_BYTES, files: 1 },
  });

  const chunks: Buffer[] = [];
  let fileName = "";
  let mimeType = "";
  let jobDescription = "";
  let language: AnalysisLanguage = "English";
  let resumeBlobUrl = "";
  let resumeFileName = "";
  const body = Buffer.from(await request.arrayBuffer());

  await new Promise<void>((resolve, reject) => {
    parser.on("file", (_fieldName, file, info) => {
      fileName = info.filename;
      mimeType = info.mimeType;

      file.on("data", (chunk: Buffer) => chunks.push(chunk));
      file.on("limit", () => reject(new Error("Resume PDF must be 10 MB or smaller")));
    });

    parser.on("field", (fieldName, value) => {
      if (fieldName === "jobDescription") {
        jobDescription = value;
      }
      if (fieldName === "language" && value === "Spanish") {
        language = "Spanish";
      }
      if (fieldName === "resumeBlobUrl") {
        resumeBlobUrl = value;
      }
      if (fieldName === "resumeFileName") {
        resumeFileName = value;
      }
    });

    parser.once("error", reject);
    parser.once("finish", resolve);

    parser.end(body);
  });

  if (!jobDescription.trim()) {
    throw new Error("Job Description is required");
  }

  const hasUpload = Boolean(fileName);
  if (hasUpload) {
    const isPdf = mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      throw new Error("A PDF file is required in the resume field");
    }

    return {
      resumeSource: { type: "upload", buffer: Buffer.concat(chunks), fileName },
      jobDescription: jobDescription.trim(),
      language,
    };
  }

  if (!resumeBlobUrl) {
    throw new Error("A PDF file or a saved resume is required in the resume field");
  }

  return {
    resumeSource: { type: "blobUrl", url: resumeBlobUrl, fileName: resumeFileName || "resume.pdf" },
    jobDescription: jobDescription.trim(),
    language,
  };
}

export const analyzeResumeHandler = async (
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> => {
  try {
    const input = await parseAnalyzeRequest(request);

    const { resumeBuffer, resumeFileName, resumeBlobUrl } =
      input.resumeSource.type === "upload"
        ? {
            resumeBuffer: input.resumeSource.buffer,
            resumeFileName: input.resumeSource.fileName,
            resumeBlobUrl: await uploadResume(input.resumeSource.buffer, input.resumeSource.fileName),
          }
        : {
            resumeBuffer: await downloadResume(input.resumeSource.url),
            resumeFileName: input.resumeSource.fileName,
            resumeBlobUrl: input.resumeSource.url,
          };

    const resumeText = await extractResumeText(resumeBuffer);
    const analysis = await runAnalysis(resumeText, input.jobDescription, input.language);

    return {
      status: 200,
      jsonBody: {
        ...analysis,
        resumeFileName,
        resumeBlobUrl,
      },
    };
  } catch (error) {
    context.error("Resume analysis failed", error);

    const message = error instanceof Error ? error.message : "Unexpected server error";
    const isBadRequest =
      message.includes("required") ||
      message.includes("must use") ||
      message.includes("10 MB") ||
      message.includes("not recognized");

    return {
      status: isBadRequest ? 400 : 500,
      jsonBody: { error: message },
    };
  }
}

app.http("AnalyzeResume", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "analyze-resume",
  handler: analyzeResumeHandler,
});
