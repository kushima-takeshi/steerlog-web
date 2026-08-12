import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { fetchWithAuth } from '../api/client'
import '../App.css'

function ReflectionPage() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const [token, setToken] = useState(() => localStorage.getItem('token') ?? '')
  const [learningSessionId, setLearningSessionId] = useState<number | null>(null)
  const [sessionStartResult, setSessionStartResult] = useState<unknown | null>(null)
  const [responseText, setResponseText] = useState('')
  const [responseResult, setResponseResult] = useState<unknown | null>(null)
  const [completeResult, setCompleteResult] = useState<unknown | null>(null)
  const [recordResult, setRecordResult] = useState<unknown | null>(null)

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

  async function handleSaveRecord(authToken = token) {
    if (learningSessionId === null) return
    if (!completeResult) return

    const draft = (completeResult as { resultDraft?: Record<string, unknown> }).resultDraft
    if (!draft) return

    try {
      const res = await fetchWithAuth(
        `/resources/${id}/learning-sessions/${learningSessionId}/record`,
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
    try {
      const res = await fetchWithAuth(`/resources/${id}/learning-sessions`, authToken, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionType: 'IMMEDIATE_REFLECTION' }),
      })
      const data = await res.json()
      setLearningSessionId(data.learningSessionId)
      setSessionStartResult(data)
    } catch {
      logout()
    }
  }

  async function handleSubmitResponse(authToken = token) {
    if (learningSessionId === null) return
    if (!responseText.trim()) return

    try {
      const res = await fetchWithAuth(
        `/resources/${id}/learning-sessions/${learningSessionId}/responses`,
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
    if (learningSessionId === null) return

    try {
      const res = await fetchWithAuth(
        `/resources/${id}/learning-sessions/${learningSessionId}/complete`,
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
      <h1>SteerLog — 振り返り</h1>
      <button type="button" onClick={() => logout()}>
        Logout
      </button>
      <p>
        <Link to="/resources">教材一覧へ</Link>
        {' · '}
        <Link to={`/resources/${id}`}>教材詳細へ</Link>
      </p>

      <p>Resource ID: {id}</p>

      <button type="button" onClick={() => handleStartLearningSession()}>
        振り返りを開始
      </button>
      <p>LearningSessionId: {learningSessionId ?? 'none'}</p>
      <pre>{sessionStartResult ? JSON.stringify(sessionStartResult, null, 2) : 'セッション未開始'}</pre>

      <textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} placeholder="回答を入力" />
      <button
        type="button"
        onClick={() => handleSubmitResponse()}
        disabled={learningSessionId === null || responseText.trim() === ''}
      >
        回答を送信
      </button>
      <pre>{responseResult ? JSON.stringify(responseResult, null, 2) : '回答未送信'}</pre>

      <button type="button" onClick={() => handleCompleteSession()} disabled={learningSessionId === null}>
        セッションを完了
      </button>
      <pre>{completeResult ? JSON.stringify(completeResult, null, 2) : 'セッション未完了'}</pre>

      <button
        type="button"
        onClick={() => handleSaveRecord()}
        disabled={learningSessionId === null || !completeResult}
      >
        記録を保存
      </button>
      <pre>{recordResult ? JSON.stringify(recordResult, null, 2) : '記録未保存'}</pre>
    </>
  )
}

export default ReflectionPage
