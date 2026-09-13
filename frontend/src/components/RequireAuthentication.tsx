import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { ANALYSE_ROUTE } from '../constants/route'

type RequireAuthenticationProps = {
  children: ReactNode
  returnTo?: string
}

const RequireAuthentication = ({ children, returnTo = ANALYSE_ROUTE }: RequireAuthenticationProps) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void loginWithRedirect({ appState: { returnTo } })
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, returnTo])

  if (isLoading || !isAuthenticated) {
    return null
  }

  return children
}

export default RequireAuthentication
