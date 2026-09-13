import type { ReactNode } from 'react'

type PanelHeadingProps = {
  number?: string
  title: string
  action?: ReactNode
}

export const PanelHeading = ({ number, title, action }: PanelHeadingProps) => {
  return (
    <div className="mb-7 flex items-center justify-between gap-[11px]">
      <div className="flex items-center gap-[11px]">
        {number && <span className="font-mono text-xs font-medium text-(--blue)">{number}</span>}
        <h3 className="m-0 text-lg font-semibold text-(--navy)">{title}</h3>
      </div>
      {action}
    </div>
  )
}
