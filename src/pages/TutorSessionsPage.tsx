import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Session, Student } from '../types/database'

interface SessionWithStudent extends Session {
  student?: Student
}

export default function TutorSessionsPage() {
  const { profile } = useAuth()
  const [sessions, setSessions] = useState<SessionWithStudent[]>([])
  const [tutorId, setTutorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState<string | null>(null)
  const [tab, setTab] = useState<'today' | 'upcoming' | 'completed'>('today')

  useEffect(() => {
    if (profile) loadTutor()
  }, [profile])

  async function loadTutor() {
    const { data: tutor } = await supabase.from('tutors').select('id').eq('profile_id', profile!.id).single()
    if (tutor) { setTutorId(tutor.id); loadSessions(tutor.id) }
    else setLoading(false)
  }

  async function loadSessions(tId: string) {
    setLoading(true)
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .eq('tutor_id', tId)
      .order('scheduled_at', { ascending: true })
    setSessions(data ?? [])
    setLoading(false)
  }

  async function markComplete(sessionId: string, rateCents: number) {
    setCompleting(sessionId)
    try {
      await supabase.from('sessions').update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      }).eq('id', sessionId)

      // Create payout record (30% tutor, 70% platform)
      if (tutorId) {
        const tutorShare = Math.round(rateCents * 0.30)
        const platformShare = rateCents - tutorShare
        await supabase.from('tutor_payouts').insert({
          tutor_id: tutorId,
          session_id: sessionId,
          session_rate_cents: rateCents,
          tutor_share_cents: tutorShare,
          platform_share_cents: platformShare,
          status: 'pending',
          stripe_transfer_id: null,
          sent_at: null,
        })
      }

      await loadSessions(tutorId!)
    } finally {
      setCompleting(null)
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1)

  const filtered = sessions.filter(s => {
    const d = new Date(s.scheduled_at)
    if (tab === 'today') return d >= today && d < tomorrow
    if (tab === 'upcoming') return d >= tomorrow && s.status !== 'completed'
    return s.status === 'completed'
  })

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'grid', placeItems: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--apex-plum)' }}>Loading sessions…</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'var(--font-body)' }}>
      <div className="apex-orb apex-orb-1" />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 2 }}>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--apex-plum)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            My Sessions
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--slate)' }}>
            Click "End session" after each call to trigger payment processing.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'rgba(33,28,48,0.06)', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
          {(['today', 'upcoming', 'completed'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600,
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? 'var(--apex-plum)' : 'var(--slate)',
                boxShadow: tab === t ? '0 2px 8px rgba(33,28,48,0.1)' : 'none',
                transition: 'all 0.15s', textTransform: 'capitalize',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Session list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.length === 0 ? (
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '48px', textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--fog)' }}>event_busy</span>
              <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--slate)' }}>
                No {tab} sessions.
              </p>
            </div>
          ) : filtered.map(session => {
            const scheduledDate = new Date(session.scheduled_at)
            const isActive = session.status === 'confirmed' || session.status === 'pending'
            return (
              <div key={session.id} className="glass-panel motion-card" style={{ borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: isActive ? 'var(--apex-plum)' : '#d1fae5', display: 'grid', placeItems: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '22px', color: isActive ? '#fff' : '#065f46' }}>
                      {session.status === 'completed' ? 'check_circle' : 'schedule'}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--apex-plum)', letterSpacing: '-0.01em' }}>
                      {session.subject_type ?? 'Standard Session'}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--slate)', marginTop: '2px' }}>
                      {scheduledDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {' · '}
                      {scheduledDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      {' · '}
                      {session.duration_minutes} min
                    </div>
                    <div style={{ marginTop: '6px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, background: 'var(--apex-violet)', color: 'var(--apex-plum)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {session.status}
                      </span>
                      <span style={{ padding: '3px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, background: '#fef3c7', color: '#92400e' }}>
                        ${(session.rate_cents / 100).toFixed(0)} · you earn ${Math.round(session.rate_cents * 0.30 / 100)}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {session.google_meet_link && (
                    <a
                      href={session.google_meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ padding: '10px 18px', borderRadius: '9px', border: '1.5px solid var(--fog)', background: '#fff', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 600, color: 'var(--apex-plum)', textDecoration: 'none', transition: 'border-color 0.15s' }}
                    >
                      Join Meet
                    </a>
                  )}
                  {isActive && (
                    <button
                      onClick={() => markComplete(session.id, session.rate_cents)}
                      disabled={completing === session.id}
                      style={{
                        padding: '10px 20px', borderRadius: '9px', border: 'none',
                        background: completing === session.id ? 'var(--fog)' : 'linear-gradient(135deg, #065f46, #047857)',
                        color: '#fff', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 700,
                        cursor: completing === session.id ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {completing === session.id ? 'Processing…' : 'End session ✓'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
