import Busboy from "busboy";
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { AnalyzeResumeRequest } from "../types/analysis";
import { analyzeResume as runAnalysis } from "../services/aiAnalyzer";
import { uploadResume } from "../services/blobStorage";
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
    });

    parser.once("error", reject);
    parser.once("finish", resolve);

    parser.end(body);
  });

  const isPdf =
    mimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");

  if (!fileName || !isPdf) {
    throw new Error("A PDF file is required in the resume field");
  }

  if (!jobDescription.trim()) {
    throw new Error("Job Description is required");
  }

  return {
    resumeFile: Buffer.concat(chunks),
    fileName,
    jobDescription: jobDescription.trim(),
  };
}

export const analyzeResumeHandler = async (
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> => {
  try {
    const input = await parseAnalyzeRequest(request);
    const blobUrl = await uploadResume(input.resumeFile, input.fileName);
    const resumeText = await extractResumeText(input.resumeFile);
    const analysis = await runAnalysis(resumeText, input.jobDescription);

    return {
      status: 200,
      jsonBody: {
        ...analysis,
        resumeFileName: input.fileName,
        resumeBlobUrl: blobUrl,
      },
    };
  } catch (error) {
    context.error("Resume analysis failed", error);

    const message = error instanceof Error ? error.message : "Unexpected server error";
    const isBadRequest =
      message.includes("required") ||
      message.includes("must use") ||
      message.includes("10 MB");

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
