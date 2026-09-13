import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Check, FileText, X } from 'lucide-react'
import { Alert, Card, Input, Progress, Switch, Upload } from 'antd'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
import { Layout } from '../components/Layout'
import { PanelHeading } from '../components/PanelHeading'
import { ResultList } from '../components/ResultList'
import { SUPPORTED_LANGUAGES } from '../constants/language'
import type { Profile } from '../types/profile'

type Analysis = {
  matchScore: number
  summary: string
  matchedSkills: string[]
  missingSkills: string[]
  improvements: string[]
}

const functionUrl = import.meta.env.VITE_AZURE_FUNCTION_URL
const profileFunctionUrl = import.meta.env.VITE_PROFILE_FUNCTION_URL
// antd computes hover/active tints from colorPrimary at theme-build time, so it
// needs a literal color value here rather than a CSS var (kept in sync with --blue).
const blue = '#1f5b83'
const line = 'var(--line)'

const AnalysePage = () => {
  const { user, isAuthenticated, loginWithRedirect, getAccessTokenSilently } = useAuth0()
  const { t, i18n } = useTranslation()
  const [resume, setResume] = useState<File | null>(null)
  const [useProfileResume, setUseProfileResume] = useState(false)
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const email = user?.email ?? ''

  const { data: profile } = useQuery({
    queryKey: ['profile', email],
    queryFn: async () => {
      try {
        const accessToken = await getAccessTokenSilently()
        const response = await axios.get<Profile>(profileFunctionUrl, {
          params: { email },
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        return response.data
      } catch (requestError) {
        if (axios.isAxiosError(requestError) && requestError.response?.status === 404) {
          return null
        }
        throw requestError
      }
    },
    enabled: isAuthenticated && Boolean(email),
    retry: false,
  })

  const hasProfileResume = Boolean(profile?.resumeFileName && profile?.resumeBlobUrl)

  const chooseResume = (file?: File) => {
    setError('')
    setAnalysis(null)
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError(t('analyse.errors.invalidFile'))
      return
    }
    setResume(file)
  }

  const toggleUseProfileResume = (checked: boolean) => {
    setUseProfileResume(checked)
    setError('')
    setAnalysis(null)
    if (checked) {
      setResume(null)
    }
  }

  const analyze = async () => {
    if (!isAuthenticated) {
      await loginWithRedirect({ appState: { returnTo: window.location.pathname } })
      return
    }
    if ((!useProfileResume && !resume) || !jobDescription.trim()) {
      setError(t('analyse.errors.missingFields'))
      return
    }
    if (!functionUrl) {
      setError(t('analyse.errors.functionUrlMissing'))
      return
    }
    setError('')
    setAnalysis(null)
    setIsLoading(true)
    try {
      const resumeFile =
        useProfileResume && profile
          ? new File(
              [(await axios.get(profile.resumeBlobUrl, { responseType: 'blob' })).data],
              profile.resumeFileName,
              { type: 'application/pdf' },
            )
          : resume

      if (!resumeFile) {
        setError(t('analyse.errors.missingFields'))
        return
      }

      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('jobDescription', jobDescription)
      const languageName =
        SUPPORTED_LANGUAGES.find((language) => language.key === i18n.resolvedLanguage)?.name ??
        SUPPORTED_LANGUAGES[0].name
      formData.append('language', languageName)
      const accessToken = await getAccessTokenSilently()
      const response = await axios.post<Analysis>(functionUrl, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      setAnalysis(response.data)
    } catch (requestError) {
      const message = axios.isAxiosError(requestError)
        ? requestError.response?.data?.error
        : undefined
      setError(
        message ??
          (requestError instanceof Error ? requestError.message : t('analyse.errors.generic')),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout footerRight={t('analyse.footerRight')}>
      <section className="max-w-[620px] pb-[62px] pt-[clamp(58px,9vw,112px)]">
        <h2 className="m-[0_0_18px] font-serif text-[clamp(42px,6vw,74px)] font-semibold leading-[.98] tracking-[-1px] text-(--navy)">
          {t('analyse.titleLine1')}{' '}
          <em className="text-(--blue)">{t('analyse.titleEmphasis')}</em>
        </h2>
        <p className="max-w-[420px] text-base leading-[1.65] text-(--muted)">
          {t('analyse.description')}
        </p>
      </section>
      <section
        className="grid grid-cols-1 gap-[18px] pb-[30px] min-[851px]:grid-cols-2 min-[851px]:gap-x-7"
        aria-label={t('analyse.workspaceLabel')}
      >
        <div
          className="row-span-2 flex h-full min-h-0 flex-col border bg-(--surface) p-[27px]"
          style={{ borderColor: line }}
        >
          <PanelHeading
            number="01"
            title={t('analyse.resumePanelTitle')}
            action={
              <label className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-[0.4px] text-(--muted)">
                  {t('analyse.useProfileResumeLabel')}
                </span>
                <Switch
                  size="small"
                  checked={useProfileResume}
                  disabled={!hasProfileResume}
                  onChange={toggleUseProfileResume}
                />
              </label>
            }
          />
          {useProfileResume ? (
            <div
              className="flex min-h-[215px] flex-1 flex-col items-center justify-center gap-2.5 border border-dashed text-center"
              style={{ borderColor: line }}
            >
              <FileText size={34} strokeWidth={1.5} className="text-(--blue)" />
              <p className="!m-0 !text-[15px] text-(--navy)!">{profile?.resumeFileName}</p>
              <p className="!m-0 !text-xs text-(--muted)!">{t('analyse.usingProfileResume')}</p>
            </div>
          ) : (
            <Upload.Dragger
              accept=".pdf,application/pdf"
              maxCount={1}
              multiple={false}
              openFileDialogOnClick
              beforeUpload={(file) => {
                chooseResume(file)
                return false
              }}
              showUploadList={false}
              className="min-h-[215px] flex-1 overflow-hidden [&_.ant-upload.ant-upload-drag]:box-border [&_.ant-upload.ant-upload-drag]:h-full [&_.ant-upload.ant-upload-drag]:min-h-0 [&_.ant-upload.ant-upload-drag]:rounded-none [&_.ant-upload.ant-upload-drag]:border-(--border) [&_.ant-upload.ant-upload-drag]:bg-(--surface-soft) [&_.ant-upload-drag-container]:flex [&_.ant-upload-drag-container]:h-full [&_.ant-upload-drag-container]:flex-col [&_.ant-upload-drag-container]:items-center [&_.ant-upload-drag-container]:justify-center [&_.ant-upload-drag-container]:gap-2.5 [&_.ant-upload-drag-container]:text-(--blue)"
            >
              <div className="flex flex-col items-center gap-2.5 text-center">
                <FileText size={34} strokeWidth={1.5} />
                <p className="!m-0 !text-[15px] text-(--navy)!">
                  {resume ? resume.name : t('analyse.dropPrompt')}
                </p>
                <p className="!m-0 !text-xs text-(--muted)!">
                  {resume
                    ? t('analyse.fileReady', { size: (resume.size / 1024 / 1024).toFixed(2) })
                    : t('analyse.dropHint')}
                </p>
              </div>
            </Upload.Dragger>
          )}
          {resume && !useProfileResume && (
            <Button
              variant="link"
              className="mt-3"
              icon={<X size={14} />}
              onClick={() => setResume(null)}
            >
              {t('analyse.removeFile')}
            </Button>
          )}
          <p className="mt-[18px] text-xs text-(--muted)">{t('analyse.secureNote')}</p>
        </div>
        <div className="border bg-(--surface) p-[27px]" style={{ borderColor: line }}>
          <PanelHeading number="02" title={t('analyse.jobPanelTitle')} />
          <Input.TextArea
            className="!min-h-[244px] !rounded-none border-(--border)! !p-4 !text-[15px] !leading-[1.6] text-(--navy)!"
            value={jobDescription}
            onChange={(event) => {
              setJobDescription(event.target.value)
              setError('')
            }}
            placeholder={t('analyse.jobPlaceholder')}
            autoSize={{ minRows: 8, maxRows: 14 }}
          />
          <div className="mt-2 text-right text-xs text-(--muted)">
            {t('analyse.characterCount', { count: jobDescription.length })}
          </div>
        </div>
        <div className="flex min-h-[62px] items-center justify-end gap-5">
          <div className="h-px flex-1" style={{ backgroundColor: line }} />
          <Button
            onClick={analyze}
            loading={isLoading}
            icon={!isLoading && <ArrowRight size={18} />}
          >
            {isLoading ? t('analyse.analysingButton') : t('analyse.analyseButton')}
          </Button>
        </div>
      </section>
      {error && (
        <Alert
          className="!mx-auto !mb-10 w-full max-w-[550px] !justify-center [&_.ant-alert-content]:text-center"
          type="error"
          showIcon
          message={error}
        />
      )}
      {analysis && (
        <section
          className="border-t py-[70px] pb-[82px]"
          style={{ borderColor: line }}
          aria-live="polite"
        >
          <div className="mb-[27px] flex items-end justify-between">
            <div>
              <p className="font-mono text-[11px] font-medium tracking-[1.2px] text-(--muted)">
                {t('analyse.resultsKicker')}
              </p>
              <h2 className="m-[13px_0_0] font-serif text-[clamp(34px,5vw,54px)] font-semibold leading-none text-(--navy)">
                {t('analyse.resultsTitle')}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-(--muted)">
              <Progress
                type="circle"
                percent={analysis.matchScore}
                size={76}
                strokeColor={blue}
                format={() => analysis.matchScore}
              />
              <span className="font-mono text-[11px]">{t('analyse.matchSuffix')}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Card
              className="!rounded-none !border border-(--navy)/15! bg-(--surface)! !shadow-none xl:col-span-1"
              bordered={false}
            >
              <p className="font-mono text-[11px] font-medium uppercase tracking-[1.2px] text-(--muted)">
                {t('analyse.recruiterRead')}
              </p>
              <p className="mt-[18px] leading-[1.55] text-(--navy)">{analysis.summary}</p>
            </Card>
            <ResultList
              title={t('analyse.matchedSkills')}
              items={analysis.matchedSkills}
              icon={<Check size={15} />}
              tone="positive"
            />
            <ResultList
              title={t('analyse.missingSkills')}
              items={analysis.missingSkills}
              icon={<X size={15} />}
              tone="negative"
            />
            <ResultList
              title={t('analyse.improvements')}
              items={analysis.improvements}
              icon={<ArrowRight size={15} />}
              tone="neutral"
            />
          </div>
        </section>
      )}
    </Layout>
  )
}

export default AnalysePage
