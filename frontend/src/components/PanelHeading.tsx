type PanelHeadingProps = {
  number?: string
  title: string
}

export const PanelHeading = ({ number, title }: PanelHeadingProps) => {
  return (
    <div className="mb-7 flex items-center gap-[11px]">
      {number && <span className="font-mono text-xs font-medium text-(--blue)">{number}</span>}
      <h3 className="m-0 text-lg font-semibold text-(--navy)">{title}</h3>
    </div>
  )
}
