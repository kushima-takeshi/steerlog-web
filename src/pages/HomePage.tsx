import { Navigate } from 'react-router-dom'

function HomePage() {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to="/resources" replace />
}

export default HomePage
