import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchWithAuth } from '../api/client'
import Layout from '../components/Layout'
import { getToken, logout } from '../utils/auth'
import '../App.css'

type ResourceDetails = {
  resource?: {
    title?: string
    author?: string
    description?: string
    resourceType?: string
  }
  progress?: {
    status?: string
    currentLevel?: number
    lastStudiedAt?: string
  }
  sections?: Array<{
    title?: string
    sectionOrder?: number
    studyStatus?: { studiedAt?: string | null }
  }>
  memos?: Array<{
    content?: string
    memoType?: string
    tags?: string[]
  }>
  levelHistories?: Array<{
    level?: number
    reasonCode?: string
    createdAt?: string
  }>
  learningSessionRecords?: Array<{
    sessionType?: string
    summary?: string
    createdAt?: string
  }>
}

function ResourceDetailPage() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const token = getToken()
  const [resourceDetail, setResourceDetail] = useState<ResourceDetails | null>(null)

  const id = resourceId != null ? Number(resourceId) : NaN
  const isValidId = !Number.isNaN(id)

  async function handleFetchResourceDetail(authToken = token) {
    if (!isValidId) return
    try {
      const res = await fetchWithAuth(`/resources/${id}/details`, authToken)
      const data = await res.json()
      setResourceDetail(data)
    } catch {
      logout(navigate)
    }
  }

  useEffect(() => {
    handleFetchResourceDetail()
  }, [id])

  if (!isValidId) {
    return (
      <>
        <p>Invalid resource ID</p>
        <Link to="/resources">教材一覧へ</Link>
      </>
    )
  }

  const { resource, progress, sections, memos, levelHistories, learningSessionRecords } =
    resourceDetail ?? {}

  return (
    <Layout title="教材詳細">
      <p>
        <Link to="/resources">教材一覧へ</Link>
      </p>

      {!resourceDetail ? (
        <p className="empty-message">読み込み中…</p>
      ) : (
        <>
          <section className="section">
            <h2>基本情報</h2>
            <p>
              <strong>{resource?.title ?? '(No title)'}</strong>
            </p>
            {resource?.author ? <p>著者: {resource.author}</p> : null}
            {resource?.description ? <p>{resource.description}</p> : null}
            {resource?.resourceType ? <p>種別: {resource.resourceType}</p> : null}
          </section>

          {progress ? (
            <section className="section">
              <h2>進捗</h2>
              <p>レベル: Lv.{progress.currentLevel ?? 0}</p>
              {progress.status ? <p>状態: {progress.status}</p> : null}
              {progress.lastStudiedAt ? <p>最終学習: {progress.lastStudiedAt}</p> : null}
            </section>
          ) : null}

          <section className="section">
            <button
              type="button"
              className="primary-action"
              onClick={() => navigate(`/resources/${id}/reflection`)}
            >
              振り返りへ
            </button>
          </section>

          {sections && sections.length > 0 ? (
            <section className="section">
              <h2>セクション</h2>
              <ul className="info-list">
                {sections.map((section, index) => (
                  <li key={section.sectionOrder ?? index}>
                    {section.sectionOrder != null ? `${section.sectionOrder}. ` : ''}
                    {section.title ?? '(No title)'}
                    {section.studyStatus?.studiedAt ? ' — 学習済み' : ' — 未学習'}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {memos && memos.length > 0 ? (
            <section className="section">
              <h2>メモ</h2>
              <ul className="info-list">
                {memos.map((memo, index) => (
                  <li key={index}>
                    {memo.memoType ? `[${memo.memoType}] ` : ''}
                    {memo.content ?? ''}
                    {memo.tags && memo.tags.length > 0 ? ` (${memo.tags.join(', ')})` : ''}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {levelHistories && levelHistories.length > 0 ? (
            <section className="section">
              <h2>レベル履歴</h2>
              <ul className="info-list">
                {levelHistories.map((history, index) => (
                  <li key={index}>
                    Lv.{history.level ?? '?'}
                    {history.reasonCode ? ` — ${history.reasonCode}` : ''}
                    {history.createdAt ? ` (${history.createdAt})` : ''}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {learningSessionRecords && learningSessionRecords.length > 0 ? (
            <section className="section">
              <h2>振り返り記録</h2>
              <ul className="info-list">
                {learningSessionRecords.map((record, index) => (
                  <li key={index}>
                    {record.sessionType ? `[${record.sessionType}] ` : ''}
                    {record.summary ?? ''}
                    {record.createdAt ? ` (${record.createdAt})` : ''}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </Layout>
  )
}

export default ResourceDetailPage
