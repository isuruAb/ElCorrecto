import { getDataSource } from '../data-source'
import { JobEntity } from '../entities/Job'

export const listJobs = async (
  page: number,
  limit: number,
): Promise<{ items: JobEntity[]; total: number }> => {
  const dataSource = await getDataSource()
  const [items, total] = await dataSource.getRepository(JobEntity).findAndCount({
    order: { sortOrder: 'ASC' },
    skip: (page - 1) * limit,
    take: limit,
  })
  return { items, total }
}
