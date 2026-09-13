import { Column, Entity, PrimaryColumn } from 'typeorm'
import type { SeniorityLevel } from '../types/profile'

const jsonArrayTransformer = {
  to: (value: string[]): string => JSON.stringify(value ?? []),
  from: (value: string): string[] => (value ? JSON.parse(value) : []),
}

@Entity({ name: 'Profiles' })
export class ProfileEntity {
  @PrimaryColumn({ name: 'Email', type: 'nvarchar', length: 320 })
  email!: string

  @Column({ name: 'Countries', type: 'nvarchar', length: 'MAX', transformer: jsonArrayTransformer })
  countries!: string[]

  @Column({ name: 'Positions', type: 'nvarchar', length: 'MAX' })
  positions!: string

  @Column({ name: 'Seniority', type: 'nvarchar', length: 'MAX', transformer: jsonArrayTransformer })
  seniority!: SeniorityLevel[]

  @Column({ name: 'ResumeFileName', type: 'nvarchar', length: 500, nullable: true })
  resumeFileName!: string | null

  @Column({ name: 'ResumeBlobUrl', type: 'nvarchar', length: 1000, nullable: true })
  resumeBlobUrl!: string | null

  @Column({ name: 'UpdatedAt', type: 'datetime2' })
  updatedAt!: Date
}
