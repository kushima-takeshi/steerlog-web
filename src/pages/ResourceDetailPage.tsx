import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { fetchWithAuth } from '../api/client'
import '../App.css'

function ResourceDetailPage() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const [token, setToken] = useState(() => localStorage.getItem('token') ?? '')
  const [resourceDetail, setResourceDetail] = useState<unknown | null>(null)

  const id = resourceId != null ? Number(resourceId) : NaN

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (Number.isNaN(id)) {
    return (
      <>
        <p>Invalid resource ID</p>
        <Link to="/resources">教材一覧へ</Link>
      </>
    )
  }

  function logout() {
    localStorage.removeItem('token')
    setToken('')
    navigate('/login')
  }

  async function handleFetchResourceDetail(authToken = token) {
    try {
      const res = await fetchWithAuth(`/resources/${id}/details`, authToken)
      const data = await res.json()
      setResourceDetail(data)
    } catch {
      logout()
    }
  }

  return (
    <>
      <h1>SteerLog — 教材詳細</h1>
      <button type="button" onClick={() => logout()}>
        Logout
      </button>
      <p>
        <Link to="/resources">教材一覧へ</Link>
      </p>

      <p>Resource ID: {id}</p>
      <button type="button" onClick={() => handleFetchResourceDetail()}>
        詳細を取得
      </button>
      <button type="button" onClick={() => navigate(`/resources/${id}/reflection`)}>
        振り返りへ
      </button>
      <pre>{resourceDetail ? JSON.stringify(resourceDetail, null, 2) : '詳細なし'}</pre>
    </>
  )
}

export default ResourceDetailPage
