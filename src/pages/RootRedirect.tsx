import { Navigate } from 'react-router-dom'

function RootRedirect() {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to="/resources" replace />
}

export default RootRedirect
