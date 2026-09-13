import { Router } from 'express'
import multer from 'multer'
import { getProfile, saveProfile } from '../services/profileDb'
import { uploadResume } from '../services/blobStorage'
import type { Profile, SeniorityLevel } from '../types/profile'

const MAX_RESUME_SIZE_BYTES = 10 * 1024 * 1024

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RESUME_SIZE_BYTES },
})

export const profileRouter = Router()

const parseStringArray = <T extends string>(raw: unknown): T[] => {
  try {
    const parsed = JSON.parse(typeof raw === 'string' ? raw : '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter((value) => typeof value === 'string') as T[]
  } catch {
    return []
  }
}

profileRouter.get('/', async (req, res) => {
  const email = String(req.query.email ?? '')
    .trim()
    .toLowerCase()
  if (!email) {
    res.status(400).json({ error: 'Email is required' })
    return
  }

  try {
    const profile = await getProfile(email)
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' })
      return
    }
    res.json(profile)
  } catch (error) {
    console.error('Loading profile failed', error)
    res.status(500).json({ error: 'Unexpected server error' })
  }
})

profileRouter.post('/', upload.single('resume'), async (req, res) => {
  const email = String(req.body.email ?? '')
    .trim()
    .toLowerCase()
  if (!email) {
    res.status(400).json({ error: 'Email is required' })
    return
  }

  const countries = parseStringArray<string>(req.body.countries)
  const seniority = parseStringArray<SeniorityLevel>(req.body.seniority)
  const positions = String(req.body.positions ?? '').trim()

  try {
    let resumeFileName = ''
    let resumeBlobUrl = ''

    if (req.file) {
      const isPdf =
        req.file.mimetype === 'application/pdf' ||
        req.file.originalname.toLowerCase().endsWith('.pdf')
      if (!isPdf) {
        res.status(400).json({ error: 'Resume must be a PDF file' })
        return
      }
      resumeBlobUrl = await uploadResume(req.file.buffer, req.file.originalname)
      resumeFileName = req.file.originalname
    } else {
      const existing = await getProfile(email)
      resumeFileName = existing?.resumeFileName ?? ''
      resumeBlobUrl = existing?.resumeBlobUrl ?? ''
    }

    const profile: Profile = {
      email,
      countries,
      positions,
      seniority,
      resumeFileName,
      resumeBlobUrl,
      updatedAt: new Date().toISOString(),
    }

    await saveProfile(profile)
    res.json(profile)
  } catch (error) {
    console.error('Saving profile failed', error)
    res.status(500).json({ error: 'Unexpected server error' })
  }
})
