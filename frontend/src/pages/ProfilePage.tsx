import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Alert, Input, Select, Upload } from 'antd'
import { FileText, X } from 'lucide-react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
import { FieldError } from '../components/form/FieldError'
import { Layout } from '../components/Layout'
import { PanelHeading } from '../components/PanelHeading'
import { RequiredLabel } from '../components/form/RequiredLabel'
import { COUNTRIES } from '../constants/country'
import { SENIORITY_LEVELS } from '../constants/seniority'
import type { Profile } from '../types/profile'

const profileFunctionUrl = import.meta.env.VITE_PROFILE_FUNCTION_URL
const line = 'var(--line)'

const profileFormShape = z.object({
  countries: z.array(z.string()),
  positions: z.string(),
  seniority: z.array(z.enum(SENIORITY_LEVELS)),
  resume: z.instanceof(File).nullable(),
})

type ProfileFormValues = z.infer<typeof profileFormShape>

const createProfileFormSchema = (hasExistingResume: boolean) =>
  profileFormShape
    .extend({
      countries: z.array(z.string()).min(1, 'Select at least one country'),
      positions: z.string().trim().min(1, 'Enter at least one position'),
      seniority: z.array(z.enum(SENIORITY_LEVELS)).min(1, 'Select at least one seniority level'),
    })
    .refine((data) => hasExistingResume || data.resume !== null, {
      message: 'Upload your resume',
      path: ['resume'],
    })

const ProfilePage = () => {
  const { t } = useTranslation()
  const { user, getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()
  const email = user?.email ?? ''

  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [savedJustNow, setSavedJustNow] = useState(false)

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['profile', email],
    queryFn: async () => {
      try {
        const response = await axios.get<Profile>(profileFunctionUrl, { params: { email } })
        return response.data
      } catch (requestError) {
        if (axios.isAxiosError(requestError) && requestError.response?.status === 404) {
          return null
        }
        throw requestError
      }
    },
    enabled: Boolean(email),
    retry: false,
  })

  const save = async (values: ProfileFormValues) => {
    setError('')
    setSavedJustNow(false)
    setIsSaving(true)
    const formData = new FormData()
    formData.append('email', email)
    formData.append('countries', JSON.stringify(values.countries))
    formData.append('positions', values.positions)
    formData.append('seniority', JSON.stringify(values.seniority))
    if (values.resume) {
      formData.append('resume', values.resume)
    }
    try {
      const accessToken = await getAccessTokenSilently()
      const response = await axios.post<Profile>(profileFunctionUrl, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      queryClient.setQueryData(['profile', email], response.data)
      setSavedJustNow(true)
    } catch (requestError) {
      const message = axios.isAxiosError(requestError)
        ? requestError.response?.data?.error
        : undefined
      setError(
        message ??
          (requestError instanceof Error ? requestError.message : t('profile.errors.generic')),
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Layout footerRight={t('profile.footerRight')}>
      <section className="mx-auto max-w-[620px] pb-[70px] pt-[clamp(58px,9vw,112px)]">
        <div className="border bg-(--surface) p-[27px]" style={{ borderColor: line }}>
          <PanelHeading title={t('profile.panelTitle')} />

          <label className="block text-xs font-medium text-(--muted)">
            {t('profile.emailLabel')}
          </label>
          <Input
            className="!mt-2 !rounded-none border-(--border)! !p-3 !text-[15px] text-(--navy)!"
            value={email}
            disabled
          />

          {isLoading ? (
            <p className="mt-6 text-sm text-(--muted)">{t('profile.loading')}</p>
          ) : (
            <ProfileForm
              key={profile?.updatedAt ?? 'new'}
              initialProfile={profile ?? null}
              isSaving={isSaving}
              onSave={save}
            />
          )}

          {savedJustNow && (
            <p className="mt-4 font-mono text-[11px] text-(--positive)">{t('profile.saved')}</p>
          )}
          {(error || isError) && (
            <Alert
              className="!mt-5"
              type="error"
              showIcon
              message={error || t('profile.errors.loadFailed')}
            />
          )}
        </div>
      </section>
    </Layout>
  )
}

type ProfileFormProps = {
  initialProfile: Profile | null
  isSaving: boolean
  onSave: (values: ProfileFormValues) => void
}

const ProfileForm = ({ initialProfile, isSaving, onSave }: ProfileFormProps) => {
  const { t } = useTranslation()
  const schema = createProfileFormSchema(Boolean(initialProfile?.resumeFileName))

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      countries: initialProfile?.countries ?? [],
      positions: initialProfile?.positions ?? '',
      seniority: initialProfile?.seniority ?? [],
      resume: null,
    },
  })

  const resume = watch('resume')

  return (
    <form onSubmit={handleSubmit(onSave)} noValidate>
      <RequiredLabel>{t('profile.resumeLabel')}</RequiredLabel>
      <Controller
        name="resume"
        control={control}
        render={({ field }) => (
          <Upload.Dragger
            accept=".pdf,application/pdf"
            maxCount={1}
            multiple={false}
            openFileDialogOnClick
            beforeUpload={(file) => {
              field.onChange(file)
              return false
            }}
            showUploadList={false}
            className="!mt-2 min-h-[150px] overflow-hidden [&_.ant-upload.ant-upload-drag]:box-border [&_.ant-upload.ant-upload-drag]:rounded-none [&_.ant-upload.ant-upload-drag]:border-(--border) [&_.ant-upload.ant-upload-drag]:bg-(--surface-soft) [&_.ant-upload-drag-container]:flex [&_.ant-upload-drag-container]:flex-col [&_.ant-upload-drag-container]:items-center [&_.ant-upload-drag-container]:justify-center [&_.ant-upload-drag-container]:gap-2.5 [&_.ant-upload-drag-container]:py-6 [&_.ant-upload-drag-container]:text-(--blue)"
          >
            <div className="flex flex-col items-center gap-2.5 text-center">
              <FileText size={28} strokeWidth={1.5} />
              <p className="!m-0 !text-sm text-(--navy)!">
                {resume ? resume.name : initialProfile?.resumeFileName || t('profile.dropPrompt')}
              </p>
              <p className="!m-0 !text-xs text-(--muted)!">
                {resume
                  ? t('analyse.fileReady', { size: (resume.size / 1024 / 1024).toFixed(2) })
                  : t('profile.dropHint')}
              </p>
            </div>
          </Upload.Dragger>
        )}
      />
      <FieldError message={errors.resume?.message} />
      {resume && (
        <Button
          variant="link"
          className="mt-2"
          icon={<X size={14} />}
          onClick={() => setValue('resume', null, { shouldValidate: true })}
        >
          {t('analyse.removeFile')}
        </Button>
      )}

      <RequiredLabel>{t('profile.countriesLabel')}</RequiredLabel>
      <Controller
        name="countries"
        control={control}
        render={({ field }) => (
          <Select
            className="!mt-2 w-full [&_.ant-select-selector]:!rounded-none [&_.ant-select-selector]:!border-(--border)"
            mode="multiple"
            value={field.value}
            onChange={field.onChange}
            placeholder={t('profile.countriesPlaceholder')}
            options={COUNTRIES.map((country) => ({ value: country, label: country }))}
          />
        )}
      />
      <FieldError message={errors.countries?.message} />

      <RequiredLabel>{t('profile.positionsLabel')}</RequiredLabel>
      <Controller
        name="positions"
        control={control}
        render={({ field }) => (
          <Input.TextArea
            className="!mt-2 !rounded-none border-(--border)! !p-3 !text-[15px] !leading-[1.6] text-(--navy)!"
            value={field.value}
            onChange={field.onChange}
            placeholder={t('profile.positionsPlaceholder')}
            autoSize={{ minRows: 2, maxRows: 5 }}
          />
        )}
      />
      <FieldError message={errors.positions?.message} />

      <RequiredLabel>{t('profile.seniorityLabel')}</RequiredLabel>
      <Controller
        name="seniority"
        control={control}
        render={({ field }) => (
          <Select
            className="!mt-2 w-full [&_.ant-select-selector]:!rounded-none [&_.ant-select-selector]:!border-(--border)"
            mode="multiple"
            value={field.value}
            onChange={field.onChange}
            placeholder={t('profile.seniorityPlaceholder')}
            options={SENIORITY_LEVELS.map((level) => ({ value: level, label: level }))}
          />
        )}
      />
      <FieldError message={errors.seniority?.message} />

      <div className="mt-7">
        <Button htmlType="submit" loading={isSaving}>
          {isSaving ? t('profile.savingButton') : t('profile.saveButton')}
        </Button>
      </div>
    </form>
  )
}

export default ProfilePage
