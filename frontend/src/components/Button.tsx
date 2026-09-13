import type { ReactNode } from 'react'
import { Button as AntButton } from 'antd'

type ButtonVariant = 'primary' | 'link'

type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
  loading?: boolean
  disabled?: boolean
  variant?: ButtonVariant
  className?: string
  htmlType?: 'button' | 'submit'
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    '!h-auto !rounded-none bg-(--blue)! !px-[18px] !py-[15px] !font-mono !text-[13px] !font-semibold !text-white !shadow-none',
  link: 'h-auto p-0 text-(--blue)',
}

export const Button = ({
  children,
  onClick,
  icon,
  loading,
  disabled,
  variant = 'primary',
  className = '',
  htmlType = 'button',
}: ButtonProps) => {
  return (
    <AntButton
      className={`${VARIANT_CLASSES[variant]} ${className}`.trim()}
      type={variant === 'primary' ? 'primary' : 'link'}
      htmlType={htmlType}
      onClick={onClick}
      icon={icon}
      loading={loading}
      disabled={disabled}
    >
      {children}
    </AntButton>
  )
}
