import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";

const client = new DocumentAnalysisClient(
  process.env.DOCUMENT_INTELLIGENCE_ENDPOINT!,
  new AzureKeyCredential(process.env.DOCUMENT_INTELLIGENCE_KEY!),
);

export async function extractResumeText(pdfBuffer: Buffer): Promise<string> {
  const poller = await client.beginAnalyzeDocument("prebuilt-read", pdfBuffer);

  const result = await poller.pollUntilDone();

  let text = "";

  result.pages?.forEach((page) => {
    page.lines?.forEach((line) => {
      text += line.content + "\n";
    });
  });

  return text;
}
