import { useState } from 'react'
import { fetchWithAuth } from './api/client'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'


function App() {
  const [result, setResult] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState(() => localStorage.getItem('token') ?? '')
  const [resources, setResources] = useState<unknown[]>([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null)
  const [resourceDetail, setResourceDetail] = useState<unknown | null>(null)
  const [learningSessionId, setLearningSessionId] = useState<number | null>(null)
  const [sessionStartResult, setSessionStartResult] = useState<unknown | null>(null)
  const [responseText, setResponseText] = useState('')
  const [responseResult, setResponseResult] = useState<unknown | null>(null)
  const [completeResult, setCompleteResult] = useState<unknown | null>(null)
  const [recordResult, setRecordResult] = useState<unknown | null>(null)

  async function handleRegister() {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    setToken(data.accessToken)
    localStorage.setItem('token', data.accessToken)

    try {
      const meRes = await fetchWithAuth('/auth/me', data.accessToken)
      const me = await meRes.json()
      setResult(JSON.stringify(me, null, 2))
      await handleFetchResources(data.accessToken) 
    } catch {
      localStorage.removeItem('token')
      setToken('')
      setResult('ログインし直してください')
    }
  }

  async function handleLogin() {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    setToken(data.accessToken)
    localStorage.setItem('token', data.accessToken)

    try {
      const meRes = await fetchWithAuth('/auth/me', data.accessToken)
      const me = await meRes.json()
      setResult(JSON.stringify(me, null, 2))
      await handleFetchResources(data.accessToken) 
    } catch {
      localStorage.removeItem('token')
      setToken('')
      setResult('ログインし直してください')
    }
  }

  async function handleFetchResources(authToken = token) {
    try {
      const res = await fetchWithAuth('/resources', authToken)
      const data = await res.json()
      setResources(data)
    } catch {
      localStorage.removeItem('token')
      setToken('')
      setResult('ログインし直してください')
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
      await handleFetchResources(authToken)  // 一覧を再取得
    } catch {
      localStorage.removeItem('token')
      setToken('')
      setResult('ログインし直してください')
    }
  }

  async function handleFetchResourceDetail(authToken = token) {
    if (selectedResourceId === null) return
  
    try {
      const res = await fetchWithAuth(
        `/resources/${selectedResourceId}/details`,
        authToken,
      )
      const data = await res.json()
      setResourceDetail(data)
    } catch {
      localStorage.removeItem('token')
      setToken('')
      setResult('ログインし直してください')
    }
  }

  async function handleSaveRecord(authToken = token) {
    if (selectedResourceId === null || learningSessionId === null) return
    if (!completeResult) return
  
    const draft = (completeResult as { resultDraft?: Record<string, unknown> }).resultDraft
    if (!draft) return
  
    try {
      const res = await fetchWithAuth(
        `/resources/${selectedResourceId}/learning-sessions/${learningSessionId}/record`,
        authToken,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            summary: draft.summary,
            conceptTags: draft.conceptTags,
            weakPointSummary: draft.weakPointSummary,
            nextAction: draft.nextAction,
            aiAssessment: draft.aiAssessment,
          }),
        },
      )
      const data = await res.json()
      setRecordResult(data)
    } catch {
      localStorage.removeItem('token')
      setToken('')
      setResult('ログインし直してください')
    }
  }
  
  async function handleStartLearningSession(authToken = token) {
    if (selectedResourceId === null) return
  
    try {
      const res = await fetchWithAuth(
        `/resources/${selectedResourceId}/learning-sessions`,
        authToken,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionType: 'IMMEDIATE_REFLECTION' }),
        },
      )
      const data = await res.json()
      setLearningSessionId(data.learningSessionId)
      setSessionStartResult(data)
    } catch {
      localStorage.removeItem('token')
      setToken('')
      setResult('ログインし直してください')
    }
  }

  async function handleSubmitResponse(authToken = token) {
    if (selectedResourceId === null || learningSessionId === null) return
    if (!responseText.trim()) return
  
    try {
      const res = await fetchWithAuth(
        `/resources/${selectedResourceId}/learning-sessions/${learningSessionId}/responses`,
        authToken,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ responseText }),
        },
      )
      const data = await res.json()
      setResponseResult(data)
    } catch {
      localStorage.removeItem('token')
      setToken('')
      setResult('ログインし直してください')
    }
  }

  async function handleCompleteSession(authToken = token) {
    if (selectedResourceId === null || learningSessionId === null) return
  
    try {
      const res = await fetchWithAuth(
        `/resources/${selectedResourceId}/learning-sessions/${learningSessionId}/complete`,
        authToken,
        { method: 'POST' },
      )
      const data = await res.json()
      setCompleteResult(data)
    } catch {
      localStorage.removeItem('token')
      setToken('')
      setResult('ログインし直してください')
    }
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>SteerLog</h1>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <pre>{result}</pre>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button type="button" onClick={handleRegister}>
          Register
        </button>
        <button type="button" onClick={handleLogin}>
          Login
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
              <button type="button" onClick={() => setSelectedResourceId(item.resourceId ?? null)}>
                {item.title ?? '(No title)'}
              </button>
            </li>
          )
        })}
        </ul>
        <p>Selected: {selectedResourceId ?? 'none'}</p>
        <button type="button" onClick={() => handleFetchResourceDetail()}>
          詳細を取得
        </button>
        <pre>{resourceDetail ? JSON.stringify(resourceDetail, null, 2) : '詳細なし'}</pre>

        <button type="button" onClick={() => handleStartLearningSession()}  disabled={selectedResourceId === null}>
          振り返りを開始
        </button>
        <p>LearningSessionId: {learningSessionId ?? 'none'}</p>
        <pre>{sessionStartResult ? JSON.stringify(sessionStartResult, null, 2) : 'セッション未開始'}</pre>

        <textarea value={responseText}  onChange={(e) => setResponseText(e.target.value)} placeholder="回答を入力"/>
        <button type="button" onClick={() => handleSubmitResponse()}disabled={learningSessionId === null || responseText.trim() === ''}>
          回答を送信
        </button>
        <pre>{responseResult ? JSON.stringify(responseResult, null, 2) : '回答未送信'}</pre>

        <button type="button" onClick={() => handleCompleteSession()} disabled={learningSessionId === null}>
          セッションを完了
        </button>
        <pre>{completeResult ? JSON.stringify(completeResult, null, 2) : 'セッション未完了'}</pre>

        <button type="button" onClick={() => handleSaveRecord()} disabled={selectedResourceId === null || learningSessionId === null || !completeResult}>
          記録を保存
        </button>
        <pre>{recordResult ? JSON.stringify(recordResult, null, 2) : '記録未保存'}</pre>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
