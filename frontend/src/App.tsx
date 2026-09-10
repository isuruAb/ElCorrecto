import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AnalysePage from './pages/AnalysePage'
import LandingPage from './pages/LandingPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyse" element={<AnalysePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
