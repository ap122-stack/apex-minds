import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { TutorPayout } from '../types/database'

interface MonthlyGroup {
  month: string
  sessions: number
  earnedCents: number
  pendingCents: number
  sentCents: number
}

export default function TutorEarningsPage() {
  const { profile } = useAuth()
  const [payouts, setPayouts] = useState<TutorPayout[]>([])
  const [tutorId, setTutorId] = useState<string | null>(null)
  const [stripeConnected, setStripeConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) loadTutor()
  }, [profile])

  async function loadTutor() {
    const { data } = await supabase
      .from('tutors')
      .select('id, stripe_connect_id, stripe_onboarded')
      .eq('profile_id', profile!.id)
      .single()
    if (data) {
      setTutorId(data.id)
      setStripeConnected(data.stripe_onboarded)
      loadPayouts(data.id)
    } else setLoading(false)
  }

  async function loadPayouts(tId: string) {
    const { data } = await supabase
      .from('tutor_payouts')
      .select('*')
      .eq('tutor_id', tId)
      .order('created_at', { ascending: false })
    setPayouts(data ?? [])
    setLoading(false)
  }

  // Group by month
  const monthlyMap = new Map<string, MonthlyGroup>()
  payouts.forEach(p => {
    const key = new Date(p.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const existing = monthlyMap.get(key) ?? { month: key, sessions: 0, earnedCents: 0, pendingCents: 0, sentCents: 0 }
    existing.sessions += 1
    existing.earnedCents += p.tutor_share_cents
    if (p.status === 'pending' || p.status === 'processing') existing.pendingCents += p.tutor_share_cents
    if (p.status === 'sent') existing.sentCents += p.tutor_share_cents
    monthlyMap.set(key, existing)
  })
  const monthly = Array.from(monthlyMap.values())

  const totalEarned = payouts.reduce((s, p) => s + p.tutor_share_cents, 0)
  const pendingPay = payouts.filter(p => p.status === 'pending' || p.status === 'processing').reduce((s, p) => s + p.tutor_share_cents, 0)
  const sentPay = payouts.filter(p => p.status === 'sent').reduce((s, p) => s + p.tutor_share_cents, 0)

  const fmt = (cents: number) => `$${(cents / 100).toFixed(2)}`

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'grid', placeItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--apex-plum)' }}>Loading earnings…</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'var(--font-body)' }}>
      <div className="apex-orb apex-orb-1" />
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 2 }}>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--apex-plum)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          My Earnings
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--slate)', marginBottom: '32px' }}>
          You receive 30% of each session fee. Apex Minds retains 70% as a platform fee.
        </p>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Total Earned', value: fmt(totalEarned), color: 'var(--apex-plum)', icon: 'payments' },
            { label: 'Pending Transfer', value: fmt(pendingPay), color: '#92400e', icon: 'hourglass_empty' },
            { label: 'Paid Out', value: fmt(sentPay), color: '#065f46', icon: 'check_circle' },
            { label: 'Sessions Complete', value: payouts.length.toString(), color: 'var(--apex-plum-vivid)', icon: 'star' },
          ].map(stat => (
            <div key={stat.label} className="glass-panel motion-card" style={{ borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: stat.color }}>{stat.icon}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--slate)' }}>{stat.label}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: stat.color, letterSpacing: '-0.03em' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Bank account status */}
        <div className="glass-panel" style={{ borderRadius: '16px', padding: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: stripeConnected ? '#d1fae5' : '#fef3c7', display: 'grid', placeItems: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: stripeConnected ? '#065f46' : '#92400e' }}>
                {stripeConnected ? 'account_balance' : 'warning'}
              </span>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--apex-plum)' }}>
                {stripeConnected ? 'Bank account connected' : 'No bank account linked'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--slate)' }}>
                {stripeConnected ? 'Payouts process automatically after each completed session' : 'Link your bank to receive payments'}
              </div>
            </div>
          </div>
          {!stripeConnected && (
            <button
              className="ed-filled-btn"
              onClick={() => alert('Stripe Connect onboarding — coming soon')}
            >
              Connect bank account →
            </button>
          )}
        </div>

        {/* Monthly breakdown */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Monthly Breakdown
        </h2>
        <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '32px' }}>
          {monthly.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', fontSize: '14px', color: 'var(--slate)' }}>
              No earnings yet. Complete sessions to see your payouts here.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--fog)' }}>
                  {['Month', 'Sessions', 'Earned', 'Paid Out', 'Pending'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 800, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthly.map((m, i) => (
                  <tr key={m.month} style={{ borderBottom: i < monthly.length - 1 ? '1px solid var(--fog)' : 'none' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--ink)', fontSize: '14px' }}>{m.month}</td>
                    <td style={{ padding: '14px 20px', fontSize: '14px', color: 'var(--ink)' }}>{m.sessions}</td>
                    <td style={{ padding: '14px 20px', fontSize: '14px', fontWeight: 700, color: 'var(--apex-plum)' }}>{fmt(m.earnedCents)}</td>
                    <td style={{ padding: '14px 20px', fontSize: '14px', color: '#065f46', fontWeight: 600 }}>{fmt(m.sentCents)}</td>
                    <td style={{ padding: '14px 20px', fontSize: '14px', color: '#92400e', fontWeight: 600 }}>{fmt(m.pendingCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
