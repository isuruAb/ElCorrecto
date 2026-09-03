import OpenAI from "openai";
import { AnalysisResult } from "../types/analysis";

const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/responses\/?$/, "").replace(/\/$/, "") + "/",
});

export async function analyzeResume(
  resumeText: string,
  jobDescription: string,
): Promise<AnalysisResult> {
  const response = await client.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT!,

    messages: [
      {
        role: "system",
        content: `
                You are an expert recruiter.

                Analyze the resume against the job description.

                Return JSON only.

                {
                "matchScore": number,
                "summary": string,
                "matchedSkills": string[],
                "missingSkills": string[],
                "improvements": string[]
                }
        `,
      },
      {
        role: "user",
        content: `
RESUME

${resumeText}

JOB DESCRIPTION

${jobDescription}
`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("Azure Foundry returned an empty response");
  return JSON.parse(content) as AnalysisResult;
}
