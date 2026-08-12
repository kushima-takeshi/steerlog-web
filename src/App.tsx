import { Routes, Route } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import RootRedirect from './pages/RootRedirect'
import LoginPage from './pages/LoginPage'
import ReflectionPage from './pages/ReflectionPage'
import ResourceDetailPage from './pages/ResourceDetailPage'
import ResourcesPage from './pages/ResourcesPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/resources"
        element={
          <RequireAuth>
            <ResourcesPage />
          </RequireAuth>
        }
      />
      <Route
        path="/resources/:resourceId/reflection"
        element={
          <RequireAuth>
            <ReflectionPage />
          </RequireAuth>
        }
      />
      <Route
        path="/resources/:resourceId"
        element={
          <RequireAuth>
            <ResourceDetailPage />
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default App