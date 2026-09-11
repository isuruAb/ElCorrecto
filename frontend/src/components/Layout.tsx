import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from './Header'

type LayoutProps = {
  children: ReactNode
  footerRight?: string
}

export const Layout = ({ children, footerRight }: LayoutProps) => {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_90%_4%,var(--sky)_0,transparent_24%),linear-gradient(135deg,var(--cream-light)_0%,var(--cream)_58%,var(--cream-dark)_100%)] px-[clamp(22px,6vw,92px)] text-(--ink)">
      <Header />
      {children}
      {footerRight && (
        <footer
          className="flex justify-between border-t py-5 pb-7 font-mono text-[10px] tracking-[1px] text-(--muted)"
          style={{ borderColor: 'var(--line)' }}
        >
          <span>{t('common.brand')}</span>
          <span>{footerRight}</span>
        </footer>
      )}
    </main>
  )
}
