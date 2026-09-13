import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ConfigProvider, theme as antdTheme } from 'antd'
import RequireAuthentication from './components/RequireAuthentication'
import { ANALYSE_ROUTE, HOME_ROUTE, JOBS_ROUTE, PROFILE_ROUTE } from './constants/route'
import { THEMES } from './constants/theme'
import AnalysePage from './pages/AnalysePage'
import JobsPage from './pages/JobsPage'
import LandingPage from './pages/LandingPage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/ProfilePage'
import { useTheme } from './hooks/useTheme'

const App = () => {
  const { theme } = useTheme()

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === THEMES.DARK ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: { borderRadius: 0, fontFamily: "'DM Sans', sans-serif" },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path={HOME_ROUTE} element={<LandingPage />} />
          <Route path={JOBS_ROUTE} element={<JobsPage />} />
          <Route
            path={ANALYSE_ROUTE}
            element={
              <RequireAuthentication>
                <AnalysePage />
              </RequireAuthentication>
            }
          />
          <Route
            path={PROFILE_ROUTE}
            element={
              <RequireAuthentication returnTo={PROFILE_ROUTE}>
                <ProfilePage />
              </RequireAuthentication>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
