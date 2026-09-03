import Busboy from "busboy";
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { AnalyzeResumeRequest } from "../types/analysis";
import { analyzeResume as runAnalysis } from "../services/aiAnalyzer";
import { uploadResume } from "../services/blobStorage";
import { extractResumeText } from "../services/documentIntelligence";

export async function parseAnalyzeRequest(
  request: HttpRequest,
): Promise<AnalyzeResumeRequest> {
  const contentType = request.headers.get("content-type");
  if (!contentType?.startsWith("multipart/form-data")) {
    throw new Error("Request must use multipart/form-data");
  }

  const parser = Busboy({ headers: { "content-type": contentType } });
  const chunks: Buffer[] = [];
  let fileName = "";
  let mimeType = "";
  let jobDescription = "";
  const body = Buffer.from(await request.arrayBuffer());

  await new Promise<void>((resolve, reject) => {
    parser.on("file", (field, file, info) => {
      if (field !== "resume") {
        file.resume();
        return;
      }
      fileName = info.filename;
      mimeType = info.mimeType;
      file.on("data", (data: Buffer) => chunks.push(data));
    });
    parser.on("field", (name, value) => {
      if (name === "jobDescription") jobDescription = value;
    });
    parser.on("finish", resolve);
    parser.on("error", reject);
    parser.end(body);
  });

  if (!fileName || mimeType !== "application/pdf") {
    throw new Error("A PDF file is required in the resume field");
  }
  if (!jobDescription.trim()) {
    throw new Error("jobDescription is required");
  }

  return {
    resumeFile: Buffer.concat(chunks),
    fileName,
    jobDescription,
  };
}

export async function analyzeResumeHandler(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  try {
    const input = await parseAnalyzeRequest(request);
    const blobUrl = await uploadResume(input.resumeFile, input.fileName);
    const resumeText = await extractResumeText(input.resumeFile);
    const analysis = await runAnalysis(resumeText, input.jobDescription);

    return {
      status: 200,
      jsonBody: { ...analysis, resumeFileName: input.fileName, resumeBlobUrl: blobUrl },
    };
  } catch (error) {
    context.error("Resume analysis failed", error);
    const message = error instanceof Error ? error.message : "Unexpected server error";
    const status = message.includes("required") || message.includes("must use") ? 400 : 500;
    return { status, jsonBody: { error: message } };
  }
}

app.http("AnalyzeResume", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "analyze-resume",
  handler: analyzeResumeHandler,
});
