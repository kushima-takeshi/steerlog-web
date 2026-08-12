import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { fetchWithAuth } from '../api/client'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'
import '../App.css'

function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [token, setToken] = useState(() => localStorage.getItem('token') ?? '')
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(null)
  const [learningSessionId, setLearningSessionId] = useState<number | null>(null)
  const [sessionStartResult, setSessionStartResult] = useState<unknown | null>(null)
  const [responseText, setResponseText] = useState('')
  const [responseResult, setResponseResult] = useState<unknown | null>(null)
  const [completeResult, setCompleteResult] = useState<unknown | null>(null)
  const [recordResult, setRecordResult] = useState<unknown | null>(null)

  useEffect(() => {
    const id = (location.state as { selectedResourceId?: number | null })?.selectedResourceId
    if (id != null) {
      setSelectedResourceId(id)
    }
  }, [location.state])

  if (!token) {
    return <Navigate to="/login" replace />
  }

  function logout() {
    localStorage.removeItem('token')
    setToken('')
    navigate('/login')
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
      logout()
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
      logout()
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
      logout()
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
      logout()
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
          <button type="button" onClick={() => logout()}>
            Logout
          </button>
          <p>
            <Link to="/resources">教材一覧へ</Link>
          </p>
        </div>

        <p>Selected: {selectedResourceId ?? 'none'}</p>

        <button type="button" onClick={() => handleStartLearningSession()} disabled={selectedResourceId === null}>
          振り返りを開始
        </button>
        <p>LearningSessionId: {learningSessionId ?? 'none'}</p>
        <pre>{sessionStartResult ? JSON.stringify(sessionStartResult, null, 2) : 'セッション未開始'}</pre>

        <textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} placeholder="回答を入力" />
        <button type="button" onClick={() => handleSubmitResponse()} disabled={learningSessionId === null || responseText.trim() === ''}>
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

export default HomePage
