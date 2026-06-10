import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Session, Invoice, Student, Tutor } from '../types/database'

interface StudentWithTutor extends Student {
  tutor?: Tutor
  sessionsUsed?: number
  sessionsTotal?: number
  packageType?: string
}

interface SessionWithDetails extends Session {
  student?: Student
  tutor?: Tutor
}

export default function ParentDashboard() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [students, setStudents] = useState<StudentWithTutor[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<SessionWithDetails[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [parentId, setParentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    if (profile) loadDashboard()
  }, [profile])

  async function loadDashboard() {
    setLoading(true)
    try {
      // Get parent record
      const { data: parent } = await supabase
        .from('parents')
        .select('id')
        .eq('profile_id', profile!.id)
        .single()

      if (!parent) {
        // Auto-create parent record on first visit
        const { data: newParent } = await supabase
          .from('parents')
          .insert({ profile_id: profile!.id, email: profile!.email, full_name: profile!.full_name ?? '', phone: null, google_id: null })
          .select('id')
          .single()
        if (newParent) setParentId(newParent.id)
        setLoading(false)
        return
      }
      setParentId(parent.id)

      // Load linked students with invoices
      const { data: psLinks } = await supabase
        .from('parent_students')
        .select('student_id')
        .eq('parent_id', parent.id)

      const studentIds = (psLinks ?? []).map(l => l.student_id)

      if (studentIds.length > 0) {
        const { data: studentsData } = await supabase
          .from('students')
          .select('*')
          .in('id', studentIds)
        setStudents(studentsData ?? [])

        // Upcoming sessions for these students
        const { data: sessionsData } = await supabase
          .from('sessions')
          .select('*')
          .in('student_id', studentIds)
          .in('status', ['confirmed', 'pending'])
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(5)
        setUpcomingSessions(sessionsData ?? [])
      }

      // Invoices
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('*')
        .eq('parent_id', parent.id)
        .order('created_at', { ascending: false })
      setInvoices(invoicesData ?? [])

    } finally {
      setLoading(false)
    }
  }

  // Subscribe to real-time session updates
  useEffect(() => {
    if (!parentId) return
    const channel = supabase
      .channel('parent-sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sessions' }, () => {
        loadDashboard()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [parentId])

  const totalPaidCents = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total_cents, 0)
  const totalCompleted = upcomingSessions.filter(s => s.status === 'completed').length
  const totalSessions = invoices.reduce((s, i) => s + i.sessions_count, 0)
  const totalUsed = invoices.reduce((s, i) => s + i.sessions_used, 0)

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--apex-plum)' }}>
          Loading dashboard…
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'var(--font-body)' }}>
      <div className="apex-orb apex-orb-1" />
      <div className="apex-orb apex-orb-2" />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--apex-plum)', letterSpacing: '-0.02em' }}>
              Welcome back, {profile?.full_name?.split(' ')[0] ?? 'Parent'}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--slate)', marginTop: '4px' }}>
              Here's your student progress overview
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/')} className="ed-btn-outline">← Home</button>
            <button onClick={() => signOut()} className="ed-ghost-btn">Sign out</button>
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Sessions Booked', value: totalSessions, icon: 'calendar_month' },
            { label: 'Sessions Completed', value: totalCompleted, icon: 'check_circle' },
            { label: 'Sessions Remaining', value: totalSessions - totalUsed, icon: 'schedule' },
            { label: 'Total Paid', value: `$${(totalPaidCents / 100).toFixed(0)}`, icon: 'payments' },
          ].map(stat => (
            <div key={stat.label} className="glass-panel motion-card" style={{ borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--apex-plum-vivid)' }}>{stat.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{stat.label}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--apex-plum)', letterSpacing: '-0.03em' }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Students grid */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '20px', letterSpacing: '-0.02em' }}>
            Active Students
          </h2>
          {students.length === 0 ? (
            <div className="glass-panel" style={{ borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', color: 'var(--slate)', marginBottom: '16px' }}>No students linked yet.</div>
              <button onClick={() => navigate('/match')} className="ed-filled-btn">Find a Tutor →</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {students.map(student => {
                const used = student.sessionsUsed ?? 0
                const total = student.sessionsTotal ?? 0
                const progress = total > 0 ? (used / total) * 100 : 0
                return (
                  <div key={student.id} className="glass-panel motion-card" style={{ borderRadius: '16px', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--apex-plum)', display: 'grid', placeItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: '#fff' }}>
                          {student.full_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: 'var(--apex-plum)' }}>
                          {student.full_name}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--slate)' }}>Grade {student.grade_level ?? 'N/A'}</div>
                      </div>
                    </div>

                    {student.packageType && (
                      <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '9999px', background: 'var(--apex-violet)', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '12px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {student.packageType}
                      </div>
                    )}

                    {total > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--slate)', fontWeight: 600 }}>Sessions used</span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--apex-plum)' }}>{used} / {total}</span>
                        </div>
                        <div style={{ height: '6px', borderRadius: '9999px', background: 'rgba(33,28,48,0.1)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: '9999px', background: 'linear-gradient(90deg, var(--apex-plum-vivid), var(--apex-plum))', width: `${progress}%`, transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    )}

                    <button onClick={() => navigate('/booking')} className="ed-btn" style={{ width: '100%', justifyContent: 'center', fontSize: '13px', padding: '10px' }}>
                      Book session →
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Upcoming sessions */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '20px', letterSpacing: '-0.02em' }}>
            Upcoming Sessions
          </h2>
          <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            {upcomingSessions.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', fontSize: '14px', color: 'var(--slate)' }}>
                No upcoming sessions. <button onClick={() => navigate('/booking')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--apex-plum)', fontWeight: 600 }}>Book one →</button>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--fog)' }}>
                    {['Date', 'Subject', 'Status', 'Meet Link'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 800, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {upcomingSessions.map((s, i) => (
                    <tr key={s.id} style={{ borderBottom: i < upcomingSessions.length - 1 ? '1px solid var(--fog)' : 'none' }}>
                      <td style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: 'var(--ink)' }}>
                        {new Date(s.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        <span style={{ display: 'block', fontSize: '12px', fontWeight: 400, color: 'var(--slate)' }}>
                          {new Date(s.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '14px', color: 'var(--ink)' }}>{s.subject_type ?? 'Standard'}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700,
                          background: s.status === 'confirmed' ? '#d1fae5' : '#fef3c7',
                          color: s.status === 'confirmed' ? '#065f46' : '#92400e',
                          fontFamily: 'var(--font-body)', letterSpacing: '0.04em', textTransform: 'capitalize',
                        }}>
                          {s.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        {s.google_meet_link ? (
                          <a href={s.google_meet_link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--apex-plum-vivid)', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>
                            Join →
                          </a>
                        ) : (
                          <span style={{ fontSize: '13px', color: 'var(--stone)' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Invoice history */}
        <div>
          <button
            onClick={() => setShowHistory(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--apex-plum)', letterSpacing: '-0.02em', padding: 0, marginBottom: '16px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px', transition: 'transform 0.2s', transform: showHistory ? 'rotate(180deg)' : 'none' }}>expand_more</span>
            Past sessions &amp; invoices
          </button>
          {showHistory && (
            <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              {invoices.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', fontSize: '14px', color: 'var(--slate)' }}>No invoices yet.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--fog)' }}>
                      {['Date', 'Package', 'Sessions', 'Amount', 'Status'].map(h => (
                        <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 800, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv, i) => (
                      <tr key={inv.id} style={{ borderBottom: i < invoices.length - 1 ? '1px solid var(--fog)' : 'none' }}>
                        <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--ink)' }}>
                          {new Date(inv.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--ink)' }}>Package #{inv.package_id?.slice(0, 8) ?? 'N/A'}</td>
                        <td style={{ padding: '14px 20px', fontSize: '13px', color: 'var(--ink)' }}>{inv.sessions_used} / {inv.sessions_count}</td>
                        <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 700, color: 'var(--apex-plum)' }}>
                          ${(inv.total_cents / 100).toFixed(0)}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            padding: '3px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700,
                            background: inv.status === 'paid' ? '#d1fae5' : '#fef3c7',
                            color: inv.status === 'paid' ? '#065f46' : '#92400e',
                            textTransform: 'capitalize',
                          }}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
