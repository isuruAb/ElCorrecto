import type { SeniorityLevel } from '../constants/seniority'

export type Profile = {
  email: string
  countries: string[]
  positions: string
  seniority: SeniorityLevel[]
  resumeFileName: string
  resumeBlobUrl: string
  updatedAt: string
}
