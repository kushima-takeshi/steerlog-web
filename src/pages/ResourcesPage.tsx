import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { fetchWithAuth } from '../api/client'
import '../App.css'

function ResourcesPage() {
  const navigate = useNavigate()
  const [token, setToken] = useState(() => localStorage.getItem('token') ?? '')
  const [resources, setResources] = useState<unknown[]>([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  function logout() {
    localStorage.removeItem('token')
    setToken('')
    navigate('/login')
  }

  async function handleFetchResources(authToken = token) {
    try {
      const res = await fetchWithAuth('/resources', authToken)
      const data = await res.json()
      setResources(data)
    } catch {
      logout()
    }
  }

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
      logout()
    }
  }

  return (
    <>
      <h1>SteerLog — 教材一覧</h1>
      <button type="button" onClick={() => logout()}>
        Logout
      </button>

      <button type="button" onClick={() => handleFetchResources()}>
        Fetch Resources
      </button>

      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" />
      <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <button type="button" onClick={() => handleCreateResource()}>
        教材を作成
      </button>

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
    </>
  )
}

export default ResourcesPage
