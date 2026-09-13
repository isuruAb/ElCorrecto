import { useEffect } from 'react'
import axios from 'axios'
import { useAuth0 } from '@auth0/auth0-react'
import { HOME_ROUTE } from '../constants/route'

export const useAuthAxiosInterceptor = () => {
  const { logout } = useAuth0()

  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          logout({ logoutParams: { returnTo: `${window.location.origin}${HOME_ROUTE}` } })
        }
        return Promise.reject(error)
      },
    )

    return () => axios.interceptors.response.eject(interceptorId)
  }, [logout])
}
