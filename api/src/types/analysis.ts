export interface AnalysisResult {
  matchScore: number;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  improvements: string[];
}

export type AnalysisLanguage = "English" | "Spanish";

export type ResumeSource =
  | { type: "upload"; buffer: Buffer; fileName: string }
  | { type: "blobUrl"; url: string; fileName: string };

export interface AnalyzeResumeRequest {
  resumeSource: ResumeSource;
  jobDescription: string;
  language: AnalysisLanguage;
}
