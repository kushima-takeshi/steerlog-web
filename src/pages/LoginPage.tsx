import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { fetchWithAuth } from '../api/client'
import '../App.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (localStorage.getItem('token')) {
    return <Navigate to="/resources" replace />
  }

  async function handleRegister() {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    localStorage.setItem('token', data.accessToken)

    try {
      await fetchWithAuth('/auth/me', data.accessToken)
      navigate('/resources')
    } catch {
      localStorage.removeItem('token')
    }
  }

  async function handleLogin() {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    localStorage.setItem('token', data.accessToken)

    try {
      await fetchWithAuth('/auth/me', data.accessToken)
      navigate('/resources')
    } catch {
      localStorage.removeItem('token')
    }
  }

  return (
    <main>
      <h1>SteerLog</h1>
      <section className="section">
        <h2>ログイン</h2>
        <p>メールアドレスとパスワードで登録またはログインしてください。</p>
        <div className="form-field">
          <label htmlFor="login-email">メールアドレス</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="login-password">パスワード</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={() => handleRegister()}>
          登録
        </button>
        <button type="button" onClick={() => handleLogin()}>
          ログイン
        </button>
      </section>
    </main>
  )
}
