import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      cacheLocation="localstorage"
      authorizationParams={{
        redirect_uri: `${window.location.origin}/analyse`,
        max_age: 86400,
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
