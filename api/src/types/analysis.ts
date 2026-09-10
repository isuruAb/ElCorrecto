export interface AnalysisResult {
  matchScore: number;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  improvements: string[];
}

export type AnalysisLanguage = "English" | "Spanish";

export interface AnalyzeResumeRequest {
  resumeFile: Buffer;
  fileName: string;
  jobDescription: string;
  language: AnalysisLanguage;
}
