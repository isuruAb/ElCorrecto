import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { ProfileEntity } from './entities/Profile'

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  username: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  options: {
    encrypt: true,
  },
  synchronize: false,
  entities: [ProfileEntity],
})

let initPromise: Promise<DataSource> | null = null

export const getDataSource = (): Promise<DataSource> => {
  if (!initPromise) {
    initPromise = AppDataSource.initialize()
  }
  return initPromise
}
