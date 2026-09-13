import type { ReactNode } from 'react'

type RequiredLabelProps = {
  children: ReactNode
}

export const RequiredLabel = ({ children }: RequiredLabelProps) => (
  <label className="mt-6 block text-xs font-medium text-(--muted)">
    {children} <span className="text-red-500">*</span>
  </label>
)
