import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import RequireAuthentication from './components/RequireAuthentication'
import { ANALYSE_ROUTE, HOME_ROUTE } from './constants/route'
import AnalysePage from './pages/AnalysePage'
import LandingPage from './pages/LandingPage'

const App = () => {
  return (
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
        <Route path="*" element={<Navigate to={HOME_ROUTE} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
