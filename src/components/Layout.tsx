import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../utils/auth'

type LayoutProps = {
  title: string
  children: ReactNode
}

function Layout({ title, children }: LayoutProps) {
  const navigate = useNavigate()

  function handleLogout() {
    logout(navigate)
  }

  return (
    <>
      <header>
        <h1>SteerLog — {title}</h1>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </header>
      <main>{children}</main>
    </>
  )
}

export default Layout
