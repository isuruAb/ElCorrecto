import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { jobsRouter } from './routes/jobs'
import { profileRouter } from './routes/profile'

const app = express()
const port = process.env.PORT ?? 4000

app.use(cors())
app.use('/api/jobs', jobsRouter)
app.use('/api/profile', profileRouter)

app.listen(port, () => {
  console.log(`API listening on port ${port}`)
})
