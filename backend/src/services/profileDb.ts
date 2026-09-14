import { getDataSource } from '../data-source'
import { ProfileEntity } from '../entities/Profile'
import type { Profile } from '../types/profile'

// TODO: Here we check the user but we do not check the email in the request body belongs to that user.
export const getProfile = async (email: string): Promise<Profile | null> => {
  const dataSource = await getDataSource()
  const entity = await dataSource.getRepository(ProfileEntity).findOneBy({ email })
  if (!entity) return null

  return {
    email: entity.email,
    countries: entity.countries,
    positions: entity.positions,
    seniority: entity.seniority,
    resumeFileName: entity.resumeFileName ?? '',
    resumeBlobUrl: entity.resumeBlobUrl ?? '',
    updatedAt: entity.updatedAt.toISOString(),
  }
}

export const saveProfile = async (profile: Profile): Promise<void> => {
  const dataSource = await getDataSource()
  const repository = dataSource.getRepository(ProfileEntity)

  const entity = (await repository.findOneBy({ email: profile.email })) ?? new ProfileEntity()
  entity.email = profile.email
  entity.countries = profile.countries
  entity.positions = profile.positions
  entity.seniority = profile.seniority
  entity.resumeFileName = profile.resumeFileName
  entity.resumeBlobUrl = profile.resumeBlobUrl
  entity.updatedAt = new Date(profile.updatedAt)

  await repository.save(entity)
}
