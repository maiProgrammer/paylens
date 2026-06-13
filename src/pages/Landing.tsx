import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, ChartBar, Rocket, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const INSIGHTS = [
  {
    type: 'failure_leak' as const,
    badge: 'FAILURE LEAK',
    title: 'SBI debit cards failing at 34%',
    body: "3× your average. Razorpay routes SBI debit through an acquirer with a known 3DS timeout. Cashfree's SBI routing shows 91% on the same cohort.",
    impact: '↓ Costing ₹2.1L / month',
  },
  {
    type: 'quick_win' as const,
    badge: 'QUICK WIN',
    title: 'High-value UPI → switch to Cashfree',
    body: "UPI >₹50K on Razorpay: 78% success. Same cohort on Cashfree: 91%. That's a 13-point gap — a routing config change, not a migration.",
    impact: '↑ Recovers ₹1.4L / month',
  },
  {
    type: 'fee_leak' as const,
    badge: 'FEE LEAK',
    title: 'International cards on wrong pricing tier',
    body: "Your international volume qualifies for Razorpay's 2% tier. You're billed at 3%. One email to your account manager fixes this retroactively.",
    impact: '↓ Overpaying ₹38K / month',
  },
  {
    type: 'insight' as const,
    badge: 'INSIGHT',
    title: 'Your real success rate is 79%, not 94%',
    body: 'Razorpay counts initiated transactions. PayLens counts completed vs attempted — including timeouts and silent drops your dashboard never shows.',
    impact: 'Affects ₹4.8Cr in monthly GMV',
  },
]

const RATES = [
  { label: 'UPI < ₹50K',   pct: 91, status: 'healthy',  note: '✓ Healthy' },
  { label: 'HDFC Credit',  pct: 88, status: 'healthy',  note: '✓ Healthy' },
  { label: 'UPI > ₹50K',   pct: 78, status: 'warn',     note: '→ Switch gateway' },
  { label: 'Netbanking',   pct: 72, status: 'warn',     note: '→ Review routing' },
  { label: 'SBI Debit',    pct: 34, status: 'critical', note: '⚠ Critical' },
]

const STEPS = [
  { n: '01', icon: <Upload size={20} />, title: 'Drop your CSV export', body: 'Export the last 30–90 days from your Razorpay or Cashfree dashboard. No account, no sign-up. Data is processed and discarded immediately.' },
  { n: '02', icon: <ChartBar size={20} />, title: "See where you're bleeding", body: 'Success rates by payment method, bank, and amount bucket. Every failure reason in plain English — not gateway error codes.' },
  { n: '03', icon: <Rocket size={20} />, title: 'Specific fixes, rupee impact', body: 'Exact routing changes tied to your data, each with an estimated monthly recovery. Share the report with your team in one link.' },
]

const PLANS = [
  {
    name: 'FREE', price: '₹0', per: 'forever', featured: false,
    feats: ['1 CSV upload per month', 'Top 3 insights', 'Success rate breakdown', 'No account required'],
    cta: 'Try free →', ctaStyle: 'secondary',
  },
  {
    name: 'STARTER', price: '₹999', per: 'per month · cancel anytime', featured: true,
    feats: ['Unlimited CSV uploads', 'Full report with ₹ impact per insight', 'Failure reason deep-dive', 'Shareable team dashboard', 'Weekly email digest'],
    cta: 'Start 14-day trial →', ctaStyle: 'primary',
  },
  {
    name: 'PRO', price: '₹2,999', per: 'per month', featured: false,
    feats: ['Everything in Starter', 'Live Razorpay / Cashfree sync', 'Real-time anomaly alerts', 'Slack integration', '90-day historical trends'],
    cta: 'Get Pro →', ctaStyle: 'secondary',
  },
]

function insightColor(type: string) {
  if (type === 'failure_leak') return { wrap: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900', badge: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-400', impact: 'text-red-600 dark:text-red-400' }
  if (type === 'quick_win')    return { wrap: 'bg-green-light dark:bg-green-950/30 border-green-border dark:border-green-900', badge: 'bg-green-border dark:bg-green-900/60 text-green-dark dark:text-green-400', impact: 'text-green dark:text-green-400' }
  if (type === 'fee_leak')     return { wrap: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900', badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400', impact: 'text-amber-700 dark:text-amber-400' }
  return                              { wrap: 'bg-green-light dark:bg-green-950/30 border-green-border dark:border-green-900', badge: 'bg-green-border dark:bg-green-900/60 text-green-dark dark:text-green-400', impact: 'text-amber-700 dark:text-amber-400' }
}

function rateColor(status: string) {
  if (status === 'healthy')  return { bar: 'bg-green', pct: 'text-green', note: 'text-green' }
  if (status === 'warn')     return { bar: 'bg-amber-400', pct: 'text-amber-600 dark:text-amber-400', note: 'text-amber-600 dark:text-amber-400' }
  return                            { bar: 'bg-red-500', pct: 'text-red-600 dark:text-red-400', note: 'text-red-600 dark:text-red-400' }
}

export default function Landing() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const uploadRef = useRef<HTMLDivElement>(null)

  function handleUploadClick() {
    if (!user) { login(); return }
    navigate('/dashboard')
  }

  function handlePlanClick(plan: typeof PLANS[0]) {
    if (plan.name === 'FREE') { handleUploadClick(); return }
    if (!user) { login(); return }
    navigate('/dashboard/billing')
  }

  return (
    <div className="min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="px-5 md:px-10 pt-20 pb-16 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] text-green tracking-widest mb-7 bg-green-light dark:bg-green-950/40 border border-green-border dark:border-green-900 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green shrink-0" />
          PAYMENT INTELLIGENCE FOR INDIAN STARTUPS
        </div>

        <h1 className="text-[clamp(32px,6vw,58px)] font-semibold leading-[1.06] tracking-tight text-ink dark:text-zinc-100 mb-5">
          Stop guessing.<br />See what your gateway<br />
          <em className="not-italic font-light text-green">isn't telling you.</em>
        </h1>

        <p className="text-[clamp(15px,2vw,17px)] text-ink2 dark:text-zinc-400 leading-relaxed max-w-lg mx-auto mb-12">
          Upload your Razorpay or Cashfree transaction export. In 60 seconds, see exactly where payments fail, which routing changes recover revenue, and what each fix is worth in rupees.
        </p>

        {/* Upload zone */}
        <div
          ref={uploadRef}
          id="upload"
          role="button"
          tabIndex={0}
          onClick={handleUploadClick}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleUploadClick() }}
          className="relative bg-white dark:bg-zinc-900 border-2 border-dashed border-bdr-2 dark:border-zinc-700 rounded-2xl p-9 max-w-[520px] mx-auto mb-4 cursor-pointer hover:border-green dark:hover:border-green transition-colors overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-green/5 to-transparent pointer-events-none" />
          <div className="w-12 h-12 bg-green-light dark:bg-green-950/40 border border-green-border dark:border-green-900 rounded-xl flex items-center justify-center mx-auto mb-4 text-green text-[22px] group-hover:scale-105 transition-transform">
            <Upload size={22} />
          </div>
          <p className="text-[15px] font-medium text-ink dark:text-zinc-200 mb-1.5">Drop your transaction CSV here</p>
          <p className="font-mono text-[11px] text-ink3 dark:text-zinc-500 leading-relaxed">
            Razorpay · Cashfree · PayU · Stripe India<br />
            No account needed · Data never stored
          </p>
          <button
            className="mt-5 inline-flex items-center gap-2 bg-green text-white text-[13px] font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            onClick={(e) => { e.stopPropagation(); handleUploadClick() }}
          >
            <Upload size={14} /> Analyse my transactions
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {['Razorpay', 'Cashfree', 'PayU', 'Stripe India'].map((g) => (
            <span key={g} className="font-mono text-[10px] text-ink3 dark:text-zinc-500 bg-surface-muted dark:bg-zinc-800 border border-bdr dark:border-zinc-700 px-2.5 py-1 rounded-full">{g}</span>
          ))}
        </div>
      </section>

      <hr className="border-bdr dark:border-zinc-800" />

      {/* ── DEMO ─────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-zinc-900 px-5 md:px-10 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[11px] text-ink3 dark:text-zinc-500 tracking-widest mb-2.5">EXAMPLE OUTPUT</p>
          <h2 className="text-[clamp(22px,3.5vw,30px)] font-semibold tracking-tight text-ink dark:text-zinc-100 mb-2">What you see after uploading</h2>
          <p className="text-[14px] text-ink2 dark:text-zinc-400 leading-relaxed mb-8">Real insights from anonymised beta data — every number tied to your actual transaction mix.</p>

          {/* Browser chrome */}
          <div className="rounded-2xl border border-bdr dark:border-zinc-700 overflow-hidden shadow-sm">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-surface-muted dark:bg-zinc-800 border-b border-bdr dark:border-zinc-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              <span className="font-mono text-[11px] text-ink3 dark:text-zinc-500 ml-2 truncate">paylens — analysis · acme-store · last 90 days</span>
            </div>
            <div className="p-4 md:p-5 bg-white dark:bg-zinc-900">
              {/* Insight cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                {INSIGHTS.map((ins) => {
                  const c = insightColor(ins.type)
                  return (
                    <div key={ins.title} className={`rounded-xl p-4 border ${c.wrap} hover:-translate-y-0.5 transition-transform`}>
                      <span className={`inline-block font-mono text-[9px] font-medium px-2 py-0.5 rounded mb-2 ${c.badge}`}>{ins.badge}</span>
                      <p className="text-[12px] font-medium text-ink dark:text-zinc-200 mb-1.5 leading-snug">{ins.title}</p>
                      <p className="text-[11px] text-ink2 dark:text-zinc-400 leading-relaxed">{ins.body}</p>
                      <p className={`font-mono text-[12px] font-medium mt-2 ${c.impact}`}>{ins.impact}</p>
                    </div>
                  )
                })}
              </div>

              {/* Rate bars */}
              <div className="bg-surface-muted dark:bg-zinc-800 border border-bdr dark:border-zinc-700 rounded-xl p-4">
                <p className="font-mono text-[10px] text-ink3 dark:text-zinc-500 tracking-wider mb-3.5">SUCCESS RATE BY PAYMENT METHOD — YOUR ACCOUNT</p>
                <div className="space-y-2.5">
                  {RATES.map((r) => {
                    const c = rateColor(r.status)
                    return (
                      <div key={r.label} className="flex items-center gap-2.5">
                        <span className="font-mono text-[10px] text-ink2 dark:text-zinc-400 w-24 shrink-0">{r.label}</span>
                        <div className="flex-1 bg-bdr dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden min-w-0">
                          <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${r.pct}%` }} />
                        </div>
                        <span className={`font-mono text-[10px] w-8 text-right shrink-0 ${c.pct}`}>{r.pct}%</span>
                        <span className={`text-[10px] shrink-0 hidden sm:block ${c.note}`}>{r.note}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-bdr dark:border-zinc-800" />

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-zinc-900 border-y border-bdr dark:border-zinc-800">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-bdr dark:divide-zinc-800">
          {[
            { n: '₹7.2Cr', l: 'Revenue recovered across beta analyses', s: 'and counting' },
            { n: '34→91%', l: 'Biggest single success rate improvement found', s: 'SBI debit routing fix' },
            { n: '60 sec',  l: 'From CSV upload to first insight', s: 'no account needed' },
          ].map((s) => (
            <div key={s.n} className="py-10 px-8 text-center">
              <p className="font-mono text-[clamp(24px,4vw,36px)] font-medium text-ink dark:text-zinc-100 tracking-tight">{s.n}</p>
              <p className="text-[13px] text-ink3 dark:text-zinc-500 mt-1.5 leading-snug">{s.l}</p>
              <p className="font-mono text-[11px] text-green mt-1">{s.s}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-bdr dark:border-zinc-800" />

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how" className="px-5 md:px-10 py-16 max-w-4xl mx-auto">
        <p className="font-mono text-[11px] text-ink3 dark:text-zinc-500 tracking-widest mb-2.5">HOW IT WORKS</p>
        <h2 className="text-[clamp(22px,3.5vw,30px)] font-semibold tracking-tight text-ink dark:text-zinc-100 mb-2">Three steps. No integration required.</h2>
        <p className="text-[14px] text-ink2 dark:text-zinc-400 leading-relaxed mb-8">Start with a file you already have. Connect live once you trust the insights.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-bdr dark:divide-zinc-800 border border-bdr dark:border-zinc-800 rounded-xl overflow-hidden">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-white dark:bg-zinc-900 p-7">
              <p className="font-mono text-[11px] text-green mb-4">{s.n} —</p>
              <div className="text-ink3 dark:text-zinc-500 mb-3">{s.icon}</div>
              <p className="text-[14px] font-medium text-ink dark:text-zinc-200 mb-2">{s.title}</p>
              <p className="text-[13px] text-ink2 dark:text-zinc-400 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-bdr dark:border-zinc-800" />

      {/* ── PRICING ───────────────────────────────────────────── */}
      <section id="pricing" className="px-5 md:px-10 py-16 max-w-4xl mx-auto">
        <p className="font-mono text-[11px] text-ink3 dark:text-zinc-500 tracking-widest mb-2.5">PRICING</p>
        <h2 className="text-[clamp(22px,3.5vw,30px)] font-semibold tracking-tight text-ink dark:text-zinc-100 mb-2">Start free. Upgrade when it pays for itself.</h2>
        <p className="text-[14px] text-ink2 dark:text-zinc-400 leading-relaxed mb-8">Every plan pays back within the first analysis.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-zinc-900 rounded-xl p-6 flex flex-col ${
                plan.featured
                  ? 'border-2 border-green'
                  : 'border border-bdr dark:border-zinc-800'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-green text-white font-mono text-[10px] px-3 py-0.5 rounded-b-lg">MOST POPULAR</div>
              )}
              <p className="font-mono text-[10px] text-ink3 dark:text-zinc-500 tracking-widest mb-3 mt-2">{plan.name}</p>
              <p className="text-[32px] font-semibold tracking-tight text-ink dark:text-zinc-100">{plan.price}</p>
              <p className="text-[12px] text-ink3 dark:text-zinc-500 mt-0.5 mb-5">{plan.per}</p>
              <div className="flex-1 border-t border-bdr dark:border-zinc-800 pt-4 space-y-1.5">
                {plan.feats.map((f) => (
                  <div key={f} className="flex items-start gap-2 text-[12px] text-ink2 dark:text-zinc-400 leading-relaxed">
                    <CheckCircle size={13} className="text-green shrink-0 mt-0.5" />
                    {f}
                  </div>
                ))}
              </div>
              <button
                onClick={() => handlePlanClick(plan)}
                className={`mt-5 w-full py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                  plan.ctaStyle === 'primary'
                    ? 'bg-green text-white hover:opacity-90'
                    : 'border border-bdr dark:border-zinc-700 bg-surface-muted dark:bg-zinc-800 text-ink dark:text-zinc-200 hover:border-bdr-2 dark:hover:border-zinc-600'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="bg-ink dark:bg-zinc-950 px-5 py-20 text-center">
        <h2 className="text-[clamp(22px,4vw,36px)] font-semibold text-white dark:text-zinc-100 tracking-tight mb-3 leading-tight">
          Your last CSV export is already<br />sitting in Downloads.
        </h2>
        <p className="text-[15px] text-zinc-400 mb-8 leading-relaxed">
          Upload it. See what your gateway isn't telling you.<br />
          Takes 60 seconds. No account needed.
        </p>
        <button
          onClick={handleUploadClick}
          className="bg-green text-white text-[15px] font-medium px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity"
        >
          Analyse my transactions — free →
        </button>
        <p className="font-mono text-[11px] text-zinc-600 mt-4">No account · No integration · No sales call</p>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-bdr dark:border-zinc-800 px-6 md:px-10 py-6 flex flex-wrap items-center justify-between gap-4">
        <div className="font-mono text-[13px] text-ink2 dark:text-zinc-400">
          pay<span className="text-green">lens</span>
        </div>
        <nav className="flex flex-wrap gap-5">
          {['Privacy', 'Terms', 'Docs', 'Contact'].map((l) => (
            <a key={l} href={`/${l.toLowerCase()}`} className="text-[12px] text-ink3 dark:text-zinc-500 hover:text-ink dark:hover:text-zinc-200 transition-colors">{l}</a>
          ))}
        </nav>
        <p className="font-mono text-[11px] text-ink4 dark:text-zinc-600">Built for Indian startups</p>
      </footer>
    </div>
  )
}
