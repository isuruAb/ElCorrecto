import type { Job } from '../types/job'

type JobListItemProps = {
  job: Job
  isSelected: boolean
  onSelect: (job: Job) => void
}

export const JobListItem = ({ job, isSelected, onSelect }: JobListItemProps) => {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(job)}
        aria-pressed={isSelected}
        className={`block w-full border-b px-[18px] py-[14px] text-left transition-colors ${
          isSelected ? 'bg-(--surface-soft)' : ''
        }`}
        style={{ borderColor: 'var(--line)' }}
      >
        <p className="m-0 text-[15px] font-semibold text-(--navy)">{job.title}</p>
        <p className="m-0 mt-1 text-xs text-(--muted)">{job.company}</p>
        <div className="mt-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.6px] text-(--blue)">
          <span>{job.country}</span>
          <span aria-hidden="true">·</span>
          <span>{job.employmentType}</span>
        </div>
      </button>
    </li>
  )
}
