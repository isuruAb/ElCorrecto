import 'dotenv/config'
import 'reflect-metadata'
import cors from 'cors'
import express, { type ErrorRequestHandler } from 'express'
import { checkJwt } from './middleware/auth'
import { jobsRouter } from './routes/jobs'
import { profileRouter } from './routes/profile'

const app = express()
const port = process.env.PORT ?? 4000

app.use(cors())
app.use('/api/jobs', jobsRouter)
app.use('/api/profile', checkJwt, profileRouter)

const jsonErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    next(err)
    return
  }
  const status = typeof err.status === 'number' ? err.status : 500
  res.status(status).json({ error: status === 401 ? 'Unauthorized' : 'Unexpected server error' })
}

app.use(jsonErrorHandler)

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})
