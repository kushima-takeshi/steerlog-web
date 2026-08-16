import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchWithAuth } from '../api/client'
import Layout from '../components/Layout'
import { getToken, logout } from '../utils/auth'
import '../App.css'

function ReflectionPage() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const token = getToken()
  const [learningSessionId, setLearningSessionId] = useState<number | null>(null)
  const [sessionStartResult, setSessionStartResult] = useState<unknown | null>(null)
  const [responseText, setResponseText] = useState('')
  const [responseResult, setResponseResult] = useState<unknown | null>(null)
  const [completeResult, setCompleteResult] = useState<unknown | null>(null)
  const [recordResult, setRecordResult] = useState<unknown | null>(null)

  const id = resourceId != null ? Number(resourceId) : NaN
  const isValidId = !Number.isNaN(id)

  const sessionStart = sessionStartResult as {
    aiPrompt?: string
    step?: { currentStep?: number; totalSteps?: number }
  } | null

  const responseSubmit = responseResult as {
    aiPrompt?: string
    step?: { currentStep?: number; totalSteps?: number }
  } | null

  const answerStep = responseSubmit?.step ?? sessionStart?.step

  const sessionComplete = completeResult as {
    status?: string
    completedAt?: string
    resultDraft?: {
      summary?: string
      conceptTags?: string[]
      weakPointSummary?: string
      nextAction?: string
      aiAssessment?: string
    }
  } | null

  const resultDraft = sessionComplete?.resultDraft

  async function handleSaveRecord(authToken = token) {
    if (learningSessionId === null) return
    if (!resultDraft) return

    try {
      const res = await fetchWithAuth(
        `/resources/${id}/learning-sessions/${learningSessionId}/record`,
        authToken,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            summary: resultDraft.summary,
            conceptTags: resultDraft.conceptTags,
            weakPointSummary: resultDraft.weakPointSummary,
            nextAction: resultDraft.nextAction,
            aiAssessment: resultDraft.aiAssessment,
          }),
        },
      )
      const data = await res.json()
      setRecordResult(data)
    } catch {
      logout(navigate)
    }
  }

  async function handleStartLearningSession(authToken = token) {
    if (!isValidId) return
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
      logout(navigate)
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
      logout(navigate)
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
      logout(navigate)
    }
  }

  if (!isValidId) {
    return (
      <>
        <p>Invalid resource ID</p>
        <Link to="/resources">教材一覧へ</Link>
      </>
    )
  }

  return (
    <Layout title="振り返り">
      <p>
        <Link to="/resources">教材一覧へ</Link>
        {' · '}
        <Link to={`/resources/${id}`}>教材詳細へ</Link>
      </p>

      <section className="section">
        <h2>振り返りを開始</h2>
        <p>学習直後の振り返りチェックを開始します。問いに自分の言葉で答えていきます。</p>
        {!sessionStartResult ? (
          <button type="button" onClick={() => handleStartLearningSession()}>
            振り返りを開始
          </button>
        ) : (
          <>
            <p>振り返りセッションを開始しました。</p>
            {sessionStart?.aiPrompt ? (
              <p>
                <strong>問い:</strong> {sessionStart.aiPrompt}
              </p>
            ) : null}
          </>
        )}
      </section>

      {sessionStartResult ? (
        <section className="section">
          <h2>回答</h2>
          {answerStep?.currentStep != null && answerStep?.totalSteps != null ? (
            <p>
              進捗: Step {answerStep.currentStep} / {answerStep.totalSteps}
            </p>
          ) : null}
          <div className="form-field">
            <label htmlFor="reflection-response">あなたの回答</label>
            <textarea
              id="reflection-response"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => handleSubmitResponse()}
            disabled={learningSessionId === null || responseText.trim() === ''}
          >
            回答を送信
          </button>
          {responseSubmit?.aiPrompt ? (
            <p>
              <strong>次の問い:</strong> {responseSubmit.aiPrompt}
            </p>
          ) : null}
        </section>
      ) : null}

      {sessionStartResult ? (
        <section className="section">
          <h2>確認</h2>
          <p>すべての問いに答えたら、セッションを完了して振り返り内容を確認します。</p>
          {!completeResult ? (
            <button
              type="button"
              onClick={() => handleCompleteSession()}
              disabled={learningSessionId === null}
            >
              セッションを完了
            </button>
          ) : (
            <>
              <p>セッションを完了しました。</p>
              {sessionComplete?.status ? <p>状態: {sessionComplete.status}</p> : null}
              {sessionComplete?.completedAt ? <p>完了日時: {sessionComplete.completedAt}</p> : null}
              {resultDraft ? (
                <>
                  {resultDraft.summary ? (
                    <p>
                      <strong>要約:</strong> {resultDraft.summary}
                    </p>
                  ) : null}
                  {resultDraft.conceptTags && resultDraft.conceptTags.length > 0 ? (
                    <p>
                      <strong>概念タグ:</strong> {resultDraft.conceptTags.join(', ')}
                    </p>
                  ) : null}
                  {resultDraft.weakPointSummary ? (
                    <p>
                      <strong>弱点:</strong> {resultDraft.weakPointSummary}
                    </p>
                  ) : null}
                  {resultDraft.nextAction ? (
                    <p>
                      <strong>次のアクション:</strong> {resultDraft.nextAction}
                    </p>
                  ) : null}
                  {resultDraft.aiAssessment ? (
                    <p>
                      <strong>AI評価:</strong> {resultDraft.aiAssessment}
                    </p>
                  ) : null}
                </>
              ) : null}
            </>
          )}
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => handleSaveRecord()}
        disabled={learningSessionId === null || !completeResult}
      >
        記録を保存
      </button>
      <pre>{recordResult ? JSON.stringify(recordResult, null, 2) : '記録未保存'}</pre>
    </Layout>
  )
}

export default ReflectionPage
