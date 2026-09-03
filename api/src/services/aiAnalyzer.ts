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
                You are an expert technical recruiter.

                Analyze a candidate's resume against a job description.

                Evaluate:

                1. Technical skill alignment
                2. Required vs demonstrated skills
                3. Relevant experience
                4. Seniority alignment
                5. Keywords
                6. Missing requirements
                7. Resume improvement opportunities

                Do not invent experience or skills that are not present
                in the resume.

                Base your recommendations only on the supplied resume
                and job description.

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
