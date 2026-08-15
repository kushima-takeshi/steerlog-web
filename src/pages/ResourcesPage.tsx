import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchWithAuth } from '../api/client'
import Layout from '../components/Layout'
import { getToken, logout } from '../utils/auth'
import '../App.css'

function ResourcesPage() {
  const navigate = useNavigate()
  const token = getToken()
  const [resources, setResources] = useState<unknown[]>([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')

  async function handleFetchResources(authToken = token) {
    try {
      const res = await fetchWithAuth('/resources', authToken)
      const data = await res.json()
      setResources(data)
    } catch {
      logout(navigate)
    }
  }

  useEffect(() => {
    handleFetchResources()
  }, [])

  async function handleCreateResource(authToken = token) {
    try {
      await fetchWithAuth('/resources', authToken, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceType: 'BOOK',
          title,
          author,
          description,
        }),
      })
      await handleFetchResources(authToken)
    } catch {
      logout(navigate)
    }
  }

  return (
    <Layout title="教材一覧">
      <section className="section">
        <h2>新規作成</h2>
        <div className="form-field">
          <label htmlFor="resource-title">タイトル</label>
          <input
            id="resource-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="resource-author">著者</label>
          <input
            id="resource-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="resource-description">説明</label>
          <input
            id="resource-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="button" onClick={() => handleCreateResource()}>
          教材を作成
        </button>
      </section>

      <section className="section">
        <h2>教材一覧</h2>
        <ul>
          {resources.map((resource, index) => {
            const item = resource as { resourceId?: number; title?: string }
            return (
              <li key={item.resourceId ?? index}>
                <button
                  type="button"
                  onClick={() => {
                    if (item.resourceId != null) {
                      navigate(`/resources/${item.resourceId}`)
                    }
                  }}
                >
                  {item.title ?? '(No title)'}
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </Layout>
  )
}

export default ResourcesPage
