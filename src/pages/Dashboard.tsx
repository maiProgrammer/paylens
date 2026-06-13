import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import type { AnalysisResult, Gateway } from '../types'

const GATEWAYS: { id: Gateway; label: string }[] = [
  { id: 'razorpay', label: 'Razorpay' },
  { id: 'cashfree', label: 'Cashfree' },
  { id: 'payu',     label: 'PayU' },
  { id: 'stripe',   label: 'Stripe India' },
]

function fmt(n: number) {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)}Cr`
  if (n >= 1_00_000)    return `₹${(n / 1_00_000).toFixed(1)}L`
  if (n >= 1_000)       return `₹${(n / 1_000).toFixed(0)}K`
  return `₹${n}`
}

function pct(n: number) { return `${n.toFixed(1)}%` }

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [gateway, setGateway]     = useState<Gateway>('razorpay')
  const [dragging, setDragging]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [result, setResult]       = useState<AnalysisResult | null>(null)

  // ── Upload handler ─────────────────────────────────────────
  async function handleFile(file: File) {
    if (!file.name.endsWith('.csv')) { setError('Please upload a .csv file'); return }
    setError(null); setUploading(true); setResult(null)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('gateway', gateway)
      const { data } = await api.post<AnalysisResult>('/analysis/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(data)
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Upload failed. Please check your CSV format.')
    } finally {
      setUploading(false)
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) handleFile(f)
  }
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files?.[0]; if (f) handleFile(f)
  }, [gateway])

  // ── Insight colours ────────────────────────────────────────
  function insightStyle(type: string) {
    const map: Record<string, { wrap: string; badge: string; icon: React.ReactNode; impact: string }> = {
      failure_leak: { wrap: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900', badge: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-400', icon: <TrendingDown size={12} />, impact: 'text-red-600 dark:text-red-400' },
      quick_win:    { wrap: 'bg-green-light dark:bg-green-950/20 border-green-border dark:border-green-900', badge: 'bg-green-border dark:bg-green-900/60 text-green-dark dark:text-green-400', icon: <TrendingUp size={12} />, impact: 'text-green dark:text-green-400' },
      fee_leak:     { wrap: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900', badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400', icon: <AlertTriangle size={12} />, impact: 'text-amber-700 dark:text-amber-400' },
      insight:      { wrap: 'bg-green-light dark:bg-green-950/20 border-green-border dark:border-green-900', badge: 'bg-green-border dark:bg-green-900/60 text-green-dark dark:text-green-400', icon: <CheckCircle size={12} />, impact: 'text-amber-700 dark:text-amber-400' },
    }
    return map[type] ?? map.insight
  }

  function rateStyle(status: string) {
    if (status === 'healthy')  return { bar: 'bg-green',       pct: 'text-green dark:text-green-400' }
    if (status === 'warn')     return { bar: 'bg-amber-400',   pct: 'text-amber-600 dark:text-amber-400' }
    return                            { bar: 'bg-red-500',     pct: 'text-red-600 dark:text-red-400' }
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-zinc-950">

      {/* ── Dashboard header ─────────────────────────────────── */}
      <div className="bg-white dark:bg-zinc-900 border-b border-bdr dark:border-zinc-800 px-5 md:px-10 py-4 flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-ink dark:text-zinc-100">Payment analysis</p>
          <p className="text-[11px] text-ink3 dark:text-zinc-500 font-mono mt-0.5">{user?.email}</p>
        </div>
        <button onClick={logout} className="flex items-center gap-1.5 text-[12px] text-ink3 dark:text-zinc-500 hover:text-ink dark:hover:text-zinc-200 transition-colors">
          <LogOut size={13} /> Sign out
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-5 md:px-10 py-10">

        {/* ── Gateway selector ──────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[12px] font-medium text-ink2 dark:text-zinc-400 mb-2.5">Select your payment gateway</p>
          <div className="flex flex-wrap gap-2">
            {GATEWAYS.map((g) => (
              <button
                key={g.id}
                onClick={() => setGateway(g.id)}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                  gateway === g.id
                    ? 'bg-green text-white border-green'
                    : 'border-bdr dark:border-zinc-700 text-ink2 dark:text-zinc-400 bg-white dark:bg-zinc-900 hover:border-bdr-2 dark:hover:border-zinc-600'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Upload zone ───────────────────────────────────── */}
        {!result && (
          <label
            className={`relative flex flex-col items-center justify-center gap-3 bg-white dark:bg-zinc-900 border-2 border-dashed rounded-2xl p-14 cursor-pointer transition-colors ${
              dragging
                ? 'border-green bg-green-light dark:bg-green-950/20'
                : 'border-bdr-2 dark:border-zinc-700 hover:border-green dark:hover:border-green'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <div className="w-14 h-14 bg-green-light dark:bg-green-950/40 border border-green-border dark:border-green-900 rounded-xl flex items-center justify-center text-green">
              {uploading ? (
                <div className="w-5 h-5 border-2 border-green border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload size={24} />
              )}
            </div>
            <div className="text-center">
              <p className="text-[15px] font-medium text-ink dark:text-zinc-200">
                {uploading ? 'Analysing your transactions…' : `Drop your ${GATEWAYS.find(g => g.id === gateway)?.label} CSV here`}
              </p>
              <p className="font-mono text-[11px] text-ink3 dark:text-zinc-500 mt-1">
                {uploading ? 'This usually takes under 10 seconds' : 'or click to browse · .csv files only'}
              </p>
            </div>
            <input type="file" accept=".csv" className="sr-only" onChange={onInputChange} disabled={uploading} />
          </label>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3 text-[13px] text-red-700 dark:text-red-400 flex items-center gap-2">
            <AlertTriangle size={14} /> {error}
          </div>
        )}

        {/* ── Results ───────────────────────────────────────── */}
        {result && (
          <div className="space-y-6">
            {/* Summary bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total transactions', value: result.total_transactions.toLocaleString() },
                { label: 'Total volume', value: fmt(result.total_volume) },
                { label: 'True success rate', value: pct(result.true_success_rate) },
                { label: 'Monthly recoverable', value: fmt(result.monthly_recoverable) },
              ].map((s) => (
                <div key={s.label} className="bg-white dark:bg-zinc-900 border border-bdr dark:border-zinc-800 rounded-xl p-4">
                  <p className="text-[10px] font-mono text-ink3 dark:text-zinc-500 mb-1.5">{s.label.toUpperCase()}</p>
                  <p className="text-[22px] font-semibold tracking-tight text-ink dark:text-zinc-100">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Insights */}
            <div>
              <p className="font-mono text-[11px] text-ink3 dark:text-zinc-500 tracking-widest mb-3">INSIGHTS</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.insights.map((ins) => {
                  const s = insightStyle(ins.type)
                  return (
                    <div key={ins.id} className={`rounded-xl p-4 border ${s.wrap}`}>
                      <span className={`inline-flex items-center gap-1 font-mono text-[9px] font-medium px-2 py-0.5 rounded mb-2 ${s.badge}`}>
                        {s.icon} {ins.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <p className="text-[13px] font-medium text-ink dark:text-zinc-200 mb-1.5">{ins.title}</p>
                      <p className="text-[12px] text-ink2 dark:text-zinc-400 leading-relaxed">{ins.body}</p>
                      <p className={`font-mono text-[12px] font-medium mt-2 ${s.impact}`}>{ins.impact_label}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Method rates */}
            <div>
              <p className="font-mono text-[11px] text-ink3 dark:text-zinc-500 tracking-widest mb-3">SUCCESS RATE BY METHOD</p>
              <div className="bg-white dark:bg-zinc-900 border border-bdr dark:border-zinc-800 rounded-xl p-5 space-y-3">
                {result.method_rates.map((r) => {
                  const s = rateStyle(r.status)
                  return (
                    <div key={r.method} className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-ink2 dark:text-zinc-400 w-28 shrink-0">{r.method}</span>
                      <div className="flex-1 bg-bdr dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden min-w-0">
                        <div className={`h-full rounded-full ${s.bar} transition-all`} style={{ width: `${r.success_rate}%` }} />
                      </div>
                      <span className={`font-mono text-[11px] w-10 text-right shrink-0 ${s.pct}`}>{pct(r.success_rate)}</span>
                      {r.recommendation && (
                        <span className="text-[10px] text-ink3 dark:text-zinc-500 hidden md:block shrink-0 max-w-[180px] truncate">{r.recommendation}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* New analysis button */}
            <button
              onClick={() => setResult(null)}
              className="flex items-center gap-2 text-[13px] text-ink3 dark:text-zinc-500 hover:text-ink dark:hover:text-zinc-200 transition-colors border border-bdr dark:border-zinc-700 rounded-lg px-4 py-2"
            >
              <FileText size={14} /> Analyse another file
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
