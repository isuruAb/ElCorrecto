export const SENIORITY_LEVELS = [
  'Entry-level',
  'Mid-level',
  'Senior',
  'Lead',
  'Principal',
] as const

export type SeniorityLevel = (typeof SENIORITY_LEVELS)[number]
