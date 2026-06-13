import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, Moon, Sun, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function Navbar() {
  const { user, login, logout } = useAuth()
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('pl-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('pl-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 h-14 bg-white dark:bg-zinc-900 border-b border-bdr dark:border-zinc-800">
        {/* Logo */}
        <Link to="/" className="font-mono text-[15px] text-ink dark:text-zinc-100 shrink-0">
          pay<span className="text-green">lens</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          <a href="/#how" className="text-[13px] text-ink3 hover:text-ink dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">How it works</a>
          <a href="/#pricing" className="text-[13px] text-ink3 hover:text-ink dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">Pricing</a>
          <Link to="/docs" className="text-[13px] text-ink3 hover:text-ink dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">Docs</Link>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setDark(!dark)}
            className="w-8 h-8 rounded-lg border border-bdr dark:border-zinc-700 bg-surface-muted dark:bg-zinc-800 flex items-center justify-center text-ink3 dark:text-zinc-400 hover:text-ink dark:hover:text-zinc-100 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium rounded-lg border border-bdr dark:border-zinc-700 bg-surface-muted dark:bg-zinc-800 text-ink dark:text-zinc-200 hover:border-bdr-2 transition-colors"
              >
                <LayoutDashboard size={13} /> Dashboard
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium rounded-lg border border-bdr dark:border-zinc-700 text-ink3 dark:text-zinc-400 hover:text-ink dark:hover:text-zinc-100 transition-colors"
              >
                <LogOut size={13} /> Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="hidden md:block h-8 px-4 bg-ink dark:bg-zinc-100 text-white dark:text-zinc-900 text-[12px] font-medium rounded-[7px] hover:opacity-85 transition-opacity"
            >
              Get started free →
            </button>
          )}

          {/* Hamburger */}
          <button
            className="md:hidden w-8 h-8 rounded-lg border border-bdr dark:border-zinc-700 bg-surface-muted dark:bg-zinc-800 flex items-center justify-center text-ink3 dark:text-zinc-400"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={15} /> : <Menu size={15} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-14 inset-x-0 z-40 bg-white dark:bg-zinc-900 border-b border-bdr dark:border-zinc-800 px-6 py-4 flex flex-col gap-1">
          <a href="/#how"      onClick={() => setMenuOpen(false)} className="py-3 text-[15px] text-ink2 dark:text-zinc-300 border-b border-bdr dark:border-zinc-800">How it works</a>
          <a href="/#pricing"  onClick={() => setMenuOpen(false)} className="py-3 text-[15px] text-ink2 dark:text-zinc-300 border-b border-bdr dark:border-zinc-800">Pricing</a>
          <Link to="/docs"     onClick={() => setMenuOpen(false)} className="py-3 text-[15px] text-ink2 dark:text-zinc-300 border-b border-bdr dark:border-zinc-800">Docs</Link>
          {user ? (
            <>
              <button onClick={() => { navigate('/dashboard'); setMenuOpen(false) }} className="py-3 text-left text-[15px] text-ink2 dark:text-zinc-300 border-b border-bdr dark:border-zinc-800">Dashboard</button>
              <button onClick={logout} className="py-3 text-left text-[15px] text-red-500">Sign out</button>
            </>
          ) : (
            <button onClick={login} className="mt-3 w-full py-3 bg-ink dark:bg-zinc-100 text-white dark:text-zinc-900 text-[14px] font-medium rounded-lg">Get started free →</button>
          )}
        </div>
      )}
    </>
  )
}
