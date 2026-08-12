import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ReflectionPage from './pages/ReflectionPage'
import ResourceDetailPage from './pages/ResourceDetailPage'
import ResourcesPage from './pages/ResourcesPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/resources/:resourceId/reflection" element={<ReflectionPage />} />
      <Route path="/resources/:resourceId" element={<ResourceDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App