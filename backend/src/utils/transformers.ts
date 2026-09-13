export const jsonArrayTransformer = {
  to: (value: string[]): string => JSON.stringify(value ?? []),
  from: (value: string): string[] => (value ? JSON.parse(value) : []),
}
