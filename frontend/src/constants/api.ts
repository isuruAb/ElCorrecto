const backendBaseUrl = import.meta.env.VITE_BACKEND_BASE_URL ?? ''
const normalizedBaseUrl = backendBaseUrl.endsWith('/') ? backendBaseUrl : `${backendBaseUrl}/`

export const PROFILE_API_URL = `${normalizedBaseUrl}api/profile`
export const JOBS_API_URL = `${normalizedBaseUrl}api/jobs`
