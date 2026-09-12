export type EmploymentType = 'Full-time' | 'Part-time'

export type Job = {
  id: string
  title: string
  company: string
  country: string
  employmentType: EmploymentType
  description: string
  techStack: string[]
}

export type JobsPageResponse = {
  items: Job[]
  page: number
  limit: number
  total: number
  hasMore: boolean
}
