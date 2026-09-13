type FieldErrorProps = {
  message?: string
}

export const FieldError = ({ message }: FieldErrorProps) => {
  if (!message) return null
  return <p className="mt-1 text-xs text-red-500">{message}</p>
}
