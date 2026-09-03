import { useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight, Check, FileText, X } from 'lucide-react'
import { Alert, Button, Card, ConfigProvider, Input, Progress, Upload } from 'antd'
import axios from 'axios'

type Analysis = {
  matchScore: number
  summary: string
  matchedSkills: string[]
  missingSkills: string[]
  improvements: string[]
}

const functionUrl = import.meta.env.VITE_AZURE_FUNCTION_URL
const blue = '#1f5b83'
const line = 'rgba(23, 43, 58, .16)'

function App() {
  const [resume, setResume] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const chooseResume = (file?: File) => {
    setError('')
    setAnalysis(null)
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a PDF resume.')
      return
    }
    setResume(file)
  }

  const analyze = async () => {
    if (!resume || !jobDescription.trim()) {
      setError('Add a PDF resume and a job description to continue.')
      return
    }
    if (!functionUrl) {
      setError('The Azure Function URL is not configured.')
      return
    }
    setError('')
    setAnalysis(null)
    setIsLoading(true)
    const formData = new FormData()
    formData.append('resume', resume)
    formData.append('jobDescription', jobDescription)
    try {
      const response = await axios.post<Analysis>(functionUrl, formData)
      setAnalysis(response.data)
    } catch (requestError) {
      const message = axios.isAxiosError(requestError)
        ? requestError.response?.data?.error
        : undefined
      setError(
        message ??
          (requestError instanceof Error
            ? requestError.message
            : 'Analysis failed. Please try again.'),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: blue, borderRadius: 0, fontFamily: "'DM Sans', sans-serif" },
      }}
    >
      <main className="min-h-screen bg-[radial-gradient(circle_at_90%_4%,#c9dce7_0,transparent_24%),linear-gradient(135deg,#f7f3ec_0%,#f4efe7_58%,#ebe5dc_100%)] px-[clamp(22px,6vw,92px)] text-[#253541]">
        <header className="flex items-center gap-3.5 border-b py-7" style={{ borderColor: line }}>
          <div className="grid size-10 place-items-center bg-[#172b3a] font-mono text-[13px] font-semibold text-[#f7f3ec]">
            EC
          </div>
          <div>
            <p className="font-mono text-[11px] font-medium tracking-[1.2px] text-[#756e68]">
              EL CORRECTO / TALENT INTELLIGENCE
            </p>
            <h1 className="m-0 mt-0.5 text-[17px] font-semibold tracking-normal text-[#172b3a]">
              Resume match lab
            </h1>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs text-[#172b3a]">
            <span className="size-1.5 rounded-full bg-[#4c9270] shadow-[0_0_0_4px_#dbe8dc]" /> Azure
            connected
          </div>
        </header>
        <section className="max-w-[620px] pb-[62px] pt-[clamp(58px,9vw,112px)]">
          <p className="m-0 font-mono text-[11px] font-medium tracking-[1.2px] text-[#756e68]">
            CV ANALYSIS / 01
          </p>
          <h2 className="m-[13px_0_18px] font-serif text-[clamp(42px,6vw,74px)] font-semibold leading-[.98] tracking-[-1px] text-[#172b3a]">
            Find the signal
            <br />
            <em className="text-[#1f5b83]">inside the story.</em>
          </h2>
          <p className="max-w-[420px] text-base leading-[1.65] text-[#756e68]">
            Pair a resume with the role it is reaching for. Our analysis highlights fit, gaps, and
            the next strongest move.
          </p>
        </section>
        <section
          className="grid grid-cols-1 gap-[18px] pb-[30px] min-[851px]:grid-cols-2 min-[851px]:gap-x-7"
          aria-label="Resume analysis workspace"
        >
          <div
            className="row-span-2 flex h-full min-h-0 flex-col border bg-white/60 p-[27px]"
            style={{ borderColor: line }}
          >
            <PanelHeading number="01" title="Resume PDF" />
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
              className="min-h-[215px] flex-1 overflow-hidden [&_.ant-upload.ant-upload-drag]:box-border [&_.ant-upload.ant-upload-drag]:h-full [&_.ant-upload.ant-upload-drag]:min-h-0 [&_.ant-upload.ant-upload-drag]:rounded-none [&_.ant-upload.ant-upload-drag]:border-[#9db6c5] [&_.ant-upload.ant-upload-drag]:bg-white/50 [&_.ant-upload-drag-container]:flex [&_.ant-upload-drag-container]:h-full [&_.ant-upload-drag-container]:flex-col [&_.ant-upload-drag-container]:items-center [&_.ant-upload-drag-container]:justify-center [&_.ant-upload-drag-container]:gap-2.5 [&_.ant-upload-drag-container]:text-[#1f5b83]"
            >
              <FileText size={34} strokeWidth={1.5} />
              <p className="!m-0 !text-[15px] !text-[#172b3a]">
                {resume ? resume.name : 'Drop your resume here'}
              </p>
              <p className="!m-0 !text-xs !text-[#756e68]">
                {resume
                  ? `${(resume.size / 1024 / 1024).toFixed(2)} MB · PDF ready`
                  : 'or click to browse your files'}
              </p>
            </Upload.Dragger>
            {resume && (
              <Button
                className="mt-3 h-auto p-0 text-[#1f5b83]"
                type="link"
                icon={<X size={14} />}
                onClick={() => setResume(null)}
              >
                Remove file
              </Button>
            )}
            <p className="mt-[18px] text-xs text-[#756e68]">
              Your resume is uploaded securely for this analysis only.
            </p>
          </div>
          <div className="border bg-white/60 p-[27px]" style={{ borderColor: line }}>
            <PanelHeading number="02" title="Job description" />
            <Input.TextArea
              className="!min-h-[244px] !rounded-none !border-[#9db6c5] !p-4 !text-[15px] !leading-[1.6] !text-[#172b3a]"
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value)
                setError('')
              }}
              placeholder="Paste the role, requirements, and what success looks like..."
              autoSize={{ minRows: 8, maxRows: 14 }}
            />
            <div className="mt-2 text-right text-xs text-[#756e68]">
              {jobDescription.length} characters
            </div>
          </div>
          <div className="flex min-h-[62px] items-center justify-end gap-5">
            <div className="h-px flex-1" style={{ backgroundColor: line }} />
            <Button
              className="!h-auto !rounded-none !bg-[#1f5b83] !px-[18px] !py-[15px] !font-mono !text-[13px] !font-semibold !text-white !shadow-none"
              type="primary"
              onClick={analyze}
              loading={isLoading}
              icon={!isLoading && <ArrowRight size={18} />}
            >
              {isLoading ? 'Analysing' : 'Analyse'}
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
                <p className="font-mono text-[11px] font-medium tracking-[1.2px] text-[#756e68]">
                  ANALYSIS COMPLETE
                </p>
                <h2 className="m-[13px_0_0] font-serif text-[clamp(34px,5vw,54px)] font-semibold leading-none text-[#172b3a]">
                  What stands out
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[#756e68]">
                <Progress
                  type="circle"
                  percent={analysis.matchScore}
                  size={76}
                  strokeColor={blue}
                  format={() => analysis.matchScore}
                />
                <span className="font-mono text-[11px]">/ 100 match</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Card
                className="!rounded-none !border !border-[#172b3a]/15 !bg-white/60 !shadow-none xl:col-span-1"
                bordered={false}
              >
                <p className="font-mono text-[11px] font-medium uppercase tracking-[1.2px] text-[#756e68]">
                  Recruiter read
                </p>
                <p className="mt-[18px] leading-[1.55] text-[#172b3a]">{analysis.summary}</p>
              </Card>
              <ResultList
                title="Matched skills"
                items={analysis.matchedSkills}
                icon={<Check size={15} />}
                tone="positive"
              />
              <ResultList
                title="Missing skills"
                items={analysis.missingSkills}
                icon={<X size={15} />}
                tone="negative"
              />
              <ResultList
                title="Improvements"
                items={analysis.improvements}
                icon={<ArrowRight size={15} />}
                tone="neutral"
              />
            </div>
          </section>
        )}
        <footer
          className="flex justify-between border-t py-5 pb-7 font-mono text-[10px] tracking-[1px] text-[#756e68]"
          style={{ borderColor: line }}
        >
          <span>EL CORRECTO</span>
          <span>MAKE THE NEXT MOVE CLEAR</span>
        </footer>
      </main>
    </ConfigProvider>
  )
}

function PanelHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-7 flex items-center gap-[11px]">
      <span className="font-mono text-xs font-medium text-[#1f5b83]">{number}</span>
      <h3 className="m-0 text-lg font-semibold text-[#172b3a]">{title}</h3>
    </div>
  )
}

function ResultList({
  title,
  items,
  icon,
  tone,
}: {
  title: string
  items: string[]
  icon: ReactNode
  tone: string
}) {
  const toneClass =
    tone === 'positive'
      ? 'border-t-[#6eaa7c]'
      : tone === 'negative'
        ? 'border-t-[#1f5b83]'
        : 'border-t-[#527a95]'
  return (
    <article
      className={`min-h-[155px] border border-[#172b3a]/15 border-t-[3px] bg-white/60 p-[22px] ${toneClass}`}
    >
      <p className="font-mono text-[11px] font-medium uppercase tracking-[1.2px] text-[#756e68]">
        {title}
      </p>
      <ul className="mt-[18px] grid gap-2.5 p-0 text-[13px] leading-[1.35] text-[#172b3a]">
        <>
          {items.map((item, index) => (
            <li className="flex items-start gap-2" key={`${item}-${index}`}>
              {icon}
              <span>{item}</span>
            </li>
          ))}
        </>
      </ul>
    </article>
  )
}

export default App
