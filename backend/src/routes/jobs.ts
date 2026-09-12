import { Router } from 'express'
import { jobs } from '../data/jobs'
import type { JobsPageResponse } from '../types/job'

export const jobsRouter = Router()

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

jobsRouter.get('/', (req, res) => {
  const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10) || 1)
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.parseInt(String(req.query.limit ?? DEFAULT_LIMIT), 10) || DEFAULT_LIMIT),
  )
  const start = (page - 1) * limit

  //dummy data from the memory
  const items = jobs.slice(start, start + limit)

  const body: JobsPageResponse = {
    items,
    page,
    limit,
    total: jobs.length,
    hasMore: start + limit < jobs.length,
  }
  res.json(body)
})
