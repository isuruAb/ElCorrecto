import { Column, Entity, PrimaryColumn } from 'typeorm'
import type { EmploymentType } from '../types/job'
import { jsonArrayTransformer } from '../utils/transformers'

@Entity({ name: 'Jobs' })
export class JobEntity {
  @PrimaryColumn({ name: 'Id', type: 'nvarchar', length: 50 })
  id!: string

  @Column({ name: 'SortOrder', type: 'int' })
  sortOrder!: number

  @Column({ name: 'Title', type: 'nvarchar', length: 200 })
  title!: string

  @Column({ name: 'Company', type: 'nvarchar', length: 200 })
  company!: string

  @Column({ name: 'Country', type: 'nvarchar', length: 100 })
  country!: string

  @Column({ name: 'EmploymentType', type: 'nvarchar', length: 20 })
  employmentType!: EmploymentType

  @Column({ name: 'Description', type: 'nvarchar', length: 'MAX' })
  description!: string

  @Column({ name: 'TechStack', type: 'nvarchar', length: 'MAX', transformer: jsonArrayTransformer })
  techStack!: string[]
}
