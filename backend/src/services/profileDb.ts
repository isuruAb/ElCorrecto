import sql from 'mssql'
import type { Profile, SeniorityLevel } from '../types/profile'

const config: sql.config = {
  server: process.env.SQL_SERVER!,
  database: process.env.SQL_DATABASE!,
  user: process.env.SQL_USER!,
  password: process.env.SQL_PASSWORD!,
  options: {
    encrypt: true,
  },
}

let connectionPromise: Promise<sql.ConnectionPool> | null = null

const getPool = (): Promise<sql.ConnectionPool> => {
  if (!connectionPromise) {
    connectionPromise = new sql.ConnectionPool(config).connect()
  }
  return connectionPromise
}

export const getProfile = async (email: string): Promise<Profile | null> => {
  const pool = await getPool()
  const result = await pool
    .request()
    .input('email', sql.NVarChar(320), email)
    .query(
      'SELECT Email, Countries, Positions, Seniority, ResumeFileName, ResumeBlobUrl, UpdatedAt FROM dbo.Profiles WHERE Email = @email',
    )

  const row = result.recordset[0]
  if (!row) return null

  return {
    email: row.Email,
    countries: JSON.parse(row.Countries),
    positions: row.Positions,
    seniority: JSON.parse(row.Seniority) as SeniorityLevel[],
    resumeFileName: row.ResumeFileName ?? '',
    resumeBlobUrl: row.ResumeBlobUrl ?? '',
    updatedAt: new Date(row.UpdatedAt).toISOString(),
  }
}

export const saveProfile = async (profile: Profile): Promise<void> => {
  const pool = await getPool()

  const existing = await pool
    .request()
    .input('email', sql.NVarChar(320), profile.email)
    .query('SELECT Email FROM dbo.Profiles WHERE Email = @email')

  const request = pool
    .request()
    .input('email', sql.NVarChar(320), profile.email)
    .input('countries', sql.NVarChar(sql.MAX), JSON.stringify(profile.countries))
    .input('positions', sql.NVarChar(sql.MAX), profile.positions)
    .input('seniority', sql.NVarChar(sql.MAX), JSON.stringify(profile.seniority))
    .input('resumeFileName', sql.NVarChar(500), profile.resumeFileName)
    .input('resumeBlobUrl', sql.NVarChar(1000), profile.resumeBlobUrl)
    .input('updatedAt', sql.DateTime2, new Date(profile.updatedAt))

  if (existing.recordset.length > 0) {
    await request.query(`
      UPDATE dbo.Profiles
      SET
        Countries = @countries,
        Positions = @positions,
        Seniority = @seniority,
        ResumeFileName = @resumeFileName,
        ResumeBlobUrl = @resumeBlobUrl,
        UpdatedAt = @updatedAt
      WHERE Email = @email
    `)
  } else {
    await request.query(`
      INSERT INTO dbo.Profiles (Email, Countries, Positions, Seniority, ResumeFileName, ResumeBlobUrl, UpdatedAt)
      VALUES (@email, @countries, @positions, @seniority, @resumeFileName, @resumeBlobUrl, @updatedAt)
    `)
  }
}
