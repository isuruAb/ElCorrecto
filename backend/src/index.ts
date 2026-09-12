import cors from 'cors'
import express from 'express'
import { jobsRouter } from './routes/jobs'

const app = express()
const port = process.env.PORT ?? 4000

app.use(cors())
app.use('/api/jobs', jobsRouter)

app.listen(port, () => {
  console.log(`Jobs API listening on port ${port}`)
})
