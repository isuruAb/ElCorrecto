import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type HeaderNavLinkProps = {
  to: string
  children: ReactNode
}

export const HeaderNavLink = ({ to, children }: HeaderNavLinkProps) => {
  return (
    <Link to={to} className="font-mono text-[11px] text-(--blue) no-underline">
      {children}
    </Link>
  )
}
