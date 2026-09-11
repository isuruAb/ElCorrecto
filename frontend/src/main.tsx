import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import './i18n'
import App from './App.tsx'
import { ANALYSE_ROUTE } from './constants/route'
import { ThemeProvider } from './context/ThemeContextProvider.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: `${window.location.origin}${ANALYSE_ROUTE}`,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        max_age: 86400,
      }}
    >
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Auth0Provider>
  </StrictMode>,
)
