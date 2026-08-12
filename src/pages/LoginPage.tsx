import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { fetchWithAuth } from '../api/client'
import '../App.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [result, setResult] = useState('')

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
      const meRes = await fetchWithAuth('/auth/me', data.accessToken)
      const me = await meRes.json()
      setResult(JSON.stringify(me, null, 2))
      navigate('/resources')
    } catch {
      localStorage.removeItem('token')
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
    localStorage.setItem('token', data.accessToken)

    try {
      const meRes = await fetchWithAuth('/auth/me', data.accessToken)
      const me = await meRes.json()
      setResult(JSON.stringify(me, null, 2))
      navigate('/resources')
    } catch {
      localStorage.removeItem('token')
      setResult('ログインし直してください')
    }
  }

  return (
    <>
      <h1>SteerLog</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <pre>{result}</pre>
      <button type="button" onClick={() => handleRegister()}>
        Register
      </button>
      <button type="button" onClick={() => handleLogin()}>
        Login
      </button>
    </>
  )
}
