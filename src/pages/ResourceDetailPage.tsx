import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchWithAuth } from '../api/client'
import Layout from '../components/Layout'
import { getToken, logout } from '../utils/auth'
import '../App.css'

function ResourceDetailPage() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const token = getToken()
  const [resourceDetail, setResourceDetail] = useState<unknown | null>(null)

  const id = resourceId != null ? Number(resourceId) : NaN

  if (Number.isNaN(id)) {
    return (
      <>
        <p>Invalid resource ID</p>
        <Link to="/resources">教材一覧へ</Link>
      </>
    )
  }

  async function handleFetchResourceDetail(authToken = token) {
    try {
      const res = await fetchWithAuth(`/resources/${id}/details`, authToken)
      const data = await res.json()
      setResourceDetail(data)
    } catch {
      logout(navigate)
    }
  }

  return (
    <Layout title="教材詳細">
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
    </Layout>
  )
}

export default ResourceDetailPage
