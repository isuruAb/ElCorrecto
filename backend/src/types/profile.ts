export type SeniorityLevel = 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead' | 'Principal'

export type Profile = {
  email: string
  countries: string[]
  positions: string
  seniority: SeniorityLevel[]
  resumeFileName: string
  resumeBlobUrl: string
  updatedAt: string
}
