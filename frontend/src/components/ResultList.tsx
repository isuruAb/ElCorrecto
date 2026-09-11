import type { ReactNode } from 'react'

type ResultListProps = {
  title: string
  items: string[]
  icon: ReactNode
  tone: string
}

export const ResultList = ({ title, items, icon, tone }: ResultListProps) => {
  const toneClass =
    tone === 'positive'
      ? 'border-t-(--positive)'
      : tone === 'negative'
        ? 'border-t-(--blue)'
        : 'border-t-(--steel)'
  return (
    <article
      className={`min-h-[155px] border border-(--navy)/15 border-t-[3px] bg-(--surface) p-[22px] ${toneClass}`}
    >
      <p className="font-mono text-[11px] font-medium uppercase tracking-[1.2px] text-(--muted)">
        {title}
      </p>
      <ul className="mt-[18px] grid gap-2.5 p-0 text-[13px] leading-[1.35] text-(--navy)">
        {items.map((item, index) => (
          <li className="flex items-start gap-2" key={`${item}-${index}`}>
            {icon}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
