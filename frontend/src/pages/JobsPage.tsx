import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Layout } from '../components/Layout'
import { PanelHeading } from '../components/PanelHeading'
import { JobListItem } from '../components/JobListItem'
import type { Job, JobsPageResponse } from '../types/job'

const jobsApiUrl = import.meta.env.VITE_JOBS_API_URL
const PAGE_SIZE = 10

const JobsPage = () => {
  const { t } = useTranslation()
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLLIElement>(null)

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['jobs'],
    queryFn: async ({ pageParam }) => {
      const response = await axios.get<JobsPageResponse>(jobsApiUrl, {
        params: { page: pageParam, limit: PAGE_SIZE },
      })
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  })

  const jobs = data?.pages.flatMap((jobsPage) => jobsPage.items) ?? []

  useEffect(() => {
    const loadMoreTrigger = loadMoreRef.current
    const root = listRef.current
    if (!loadMoreTrigger || !root) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
    )
    observer.observe(loadMoreTrigger)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const error = isError ? t('jobs.errors.generic') : ''

  return (
    <Layout footerRight={t('jobs.footerRight')}>
      <section className="max-w-[760px] pb-[62px] pt-[clamp(58px,9vw,112px)]">
        <p className="m-0 font-mono text-[11px] font-medium tracking-[1.2px] text-(--muted)">
          {t('jobs.kicker')}
        </p>
        <h2 className="m-[13px_0_18px] max-w-[700px] font-serif text-[clamp(42px,6vw,74px)] font-semibold leading-[.98] tracking-[-1px] text-(--navy)">
          {t('jobs.titleLine1')}
          <br />
          <em className="text-(--blue)">{t('jobs.titleEmphasis')}</em>
        </h2>
        <p className="max-w-[500px] text-base leading-[1.65] text-(--muted)">
          {t('jobs.description')}
        </p>
      </section>
      <section
        className="grid grid-cols-1 gap-[18px] pb-[70px] min-[851px]:grid-cols-2 min-[851px]:gap-x-7"
        aria-label={t('jobs.workspaceLabel')}
      >
        <div className="flex h-[560px] flex-col border bg-(--surface)" style={{ borderColor: 'var(--line)' }}>
          <div className="p-[27px] pb-0">
            <PanelHeading number="01" title={t('jobs.listPanelTitle')} />
          </div>
          <div ref={listRef} className="flex-1 overflow-y-auto">
            {isLoading && <p className="px-[27px] text-sm text-(--muted)">{t('jobs.loading')}</p>}
            {error && <p className="px-[27px] text-sm text-(--blue)">{error}</p>}
            {!isLoading && !error && (
              <ul className="m-0 list-none p-0">
                {jobs.map((job) => (
                  <JobListItem
                    key={job.id}
                    job={job}
                    isSelected={selectedJob?.id === job.id}
                    onSelect={setSelectedJob}
                  />
                ))}
                <li ref={loadMoreRef} aria-hidden="true" />
                {isFetchingNextPage && (
                  <p className="px-[18px] py-[14px] text-xs text-(--muted)">
                    {t('jobs.loadingMore')}
                  </p>
                )}
              </ul>
            )}
          </div>
        </div>
        <div
          className="h-[560px] overflow-y-auto border bg-(--surface) p-[27px]"
          style={{ borderColor: 'var(--line)' }}
        >
          <PanelHeading number="02" title={t('jobs.detailPanelTitle')} />
          {selectedJob ? (
            <div>
              <h3 className="m-0 text-xl font-semibold text-(--navy)">{selectedJob.title}</h3>
              <p className="m-0 mt-1 text-sm text-(--muted)">{selectedJob.company}</p>
              <div className="mt-3 flex items-center gap-2 font-mono text-[11px] tracking-[0.6px] text-(--blue)">
                <span>{selectedJob.country}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedJob.employmentType}</span>
              </div>
              <p className="mt-[18px] whitespace-pre-line leading-[1.65] text-(--navy)">
                {selectedJob.description}
              </p>
              {selectedJob.techStack.length > 0 && (
                <div className="mt-[22px]">
                  <p className="m-0 font-mono text-[11px] font-medium uppercase tracking-[1.2px] text-(--muted)">
                    {t('jobs.techStackTitle')}
                  </p>
                  <ul className="m-0 mt-2.5 flex flex-wrap gap-2 p-0">
                    {selectedJob.techStack.map((tech) => (
                      <li
                        key={tech}
                        className="list-none border px-2.5 py-1 font-mono text-[11px] text-(--navy)"
                        style={{ borderColor: 'var(--line)' }}
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-(--muted)">{t('jobs.selectPrompt')}</p>
          )}
        </div>
      </section>
    </Layout>
  )
}

export default JobsPage
