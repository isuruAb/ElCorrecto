import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ConfigProvider, theme as antdTheme } from 'antd'
import RequireAuthentication from './components/RequireAuthentication'
import { ANALYSE_ROUTE, HOME_ROUTE } from './constants/route'
import { THEMES } from './constants/theme'
import AnalysePage from './pages/AnalysePage'
import LandingPage from './pages/LandingPage'
import NotFoundPage from './pages/NotFoundPage'
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
          <Route
            path={ANALYSE_ROUTE}
            element={
              <RequireAuthentication>
                <AnalysePage />
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
