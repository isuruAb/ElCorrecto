import { Router } from 'express'
import { listJobs } from '../services/jobsDb'
import type { JobsPageResponse } from '../types/job'

export const jobsRouter = Router()

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

jobsRouter.get('/', async (req, res) => {
  const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10) || 1)
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.parseInt(String(req.query.limit ?? DEFAULT_LIMIT), 10) || DEFAULT_LIMIT),
  )

  try {
    const { items, total } = await listJobs(page, limit)

    const body: JobsPageResponse = {
      items: items.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company,
        country: job.country,
        employmentType: job.employmentType,
        description: job.description,
        techStack: job.techStack,
      })),
      page,
      limit,
      total,
      hasMore: page * limit < total,
    }
    res.json(body)
  } catch (error) {
    console.error('Loading jobs failed', error)
    res.status(500).json({ error: 'Unexpected server error' })
  }
})
