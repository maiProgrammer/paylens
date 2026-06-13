import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { api } from '../lib/api'
import type { User } from '../types'

interface AuthCtx {
  user: User | null
  loading: boolean
  login: () => void
  logout: () => void
}

const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for token in URL after OAuth redirect
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem('access_token', token)
      window.history.replaceState({}, '', window.location.pathname)
    }

    // Fetch current user if token exists
    const stored = token ?? localStorage.getItem('access_token')
    if (!stored) { setLoading(false); return }

    api.get<User>('/auth/me')
      .then((r) => setUser(r.data))
      .catch(() => localStorage.removeItem('access_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = () => {
    window.location.href = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/auth/google`
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
    window.location.href = '/'
  }

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)
