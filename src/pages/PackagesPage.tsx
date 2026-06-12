import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BookOpen, Zap, Lightbulb } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

const PACKAGES = [
  {
    id: 'standard',
    name: 'Standard Tutoring',
    description: 'Expert guidance across all subjects',
    icon: <BookOpen className="w-8 h-8" style={{ color: 'var(--apex-plum)' }} />,
    baseRate: 40,
    discounts: { 1: 0, 4: 2, 8: 4, 12: 6 },
    stripeKey: 'standard',
    isBold: false,
    features: [
      { label: 'Flexible scheduling', included: true },
      { label: 'Expert tutor matching', included: true },
      { label: 'Progress tracking', included: true },
      { label: 'Priority support', included: true },
    ],
  },
  {
    id: 'ap',
    name: 'AP Exam Prep',
    description: 'Master Advanced Placement courses',
    icon: <Zap className="w-8 h-8" style={{ color: 'var(--apex-plum)' }} />,
    baseRate: 45,
    discounts: { 1: 0, 4: 2, 8: 4, 12: 6 },
    stripeKey: 'ap',
    isBold: false,
    features: [
      { label: 'Exam-focused strategies', included: true },
      { label: 'Practice problems & drills', included: true },
      { label: 'Full-length exam prep', included: true },
      { label: 'Score improvement guarantee*', included: true },
    ],
    recommended: true,
  },
  {
    id: 'testprep',
    name: 'SAT/ACT Prep',
    description: 'Comprehensive test preparation',
    icon: <Lightbulb className="w-8 h-8" style={{ color: 'var(--apex-plum)' }} />,
    baseRate: 70,
    discounts: { 1: 0, 4: 2, 8: 4, 12: 6 },
    stripeKey: 'testprep',
    isBold: true,
    features: [
      { label: 'Personalized study plans', included: true },
      { label: 'Practice tests & scoring', included: true },
      { label: 'Test-day strategies', included: true },
      { label: 'Math & reading coaching', included: true },
    ],
  },
]

const SESSION_COUNTS = [1, 4, 8, 12]

function PackageCard({ pkg, lockedPackage, lockedSessions }: { pkg: typeof PACKAGES[0]; lockedPackage: string | null; lockedSessions: string | null }) {
  const [sessions, setSessions] = useState(lockedSessions ? Number(lockedSessions) : 4)
  const [loading, setLoading] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [studentEmail, setStudentEmail] = useState('')

  const isLocked = lockedPackage && lockedPackage !== pkg.id
  const ratePerSession = pkg.baseRate - (pkg.discounts[sessions as keyof typeof pkg.discounts] || 0)
  const totalPrice = ratePerSession * sessions
  const baseTotalPrice = pkg.baseRate * sessions
  const savings = baseTotalPrice - totalPrice

  const cardBg = isLocked ? '#f5f5f5' : '#fff'
  const borderColor = isLocked ? 'var(--apex-line)' : pkg.isBold ? 'var(--apex-ember)' : pkg.recommended ? 'var(--apex-plum)' : 'var(--apex-line)'
  const borderWidth = isLocked ? '1px' : pkg.isBold ? '3px' : pkg.recommended ? '3px' : '1px'
  const opacity = isLocked ? 0.5 : 1

  async function handleCheckout() {
    if (!studentName || !studentEmail) {
      alert('Please enter your name and email')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${BACKEND_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: pkg.id,
          sessions,
          studentName,
          studentEmail,
        }),
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Error: ' + (data.error || 'Could not create checkout'))
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        padding: '32px',
        borderRadius: '20px',
        background: cardBg,
        border: `${borderWidth} solid ${borderColor}`,
        boxShadow:
          pkg.isBold
            ? 'rgba(255,106,31,0.2) 0px 12px 48px'
            : pkg.recommended
              ? 'rgba(33,28,48,0.25) 0px 12px 48px'
              : 'rgba(33,28,48,0.10) 0px 6px 27px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        opacity: opacity,
        pointerEvents: isLocked ? 'none' : 'auto',
      } as React.CSSProperties}
    >
      {(pkg.recommended || pkg.isBold) && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            right: '20px',
            padding: '6px 16px',
            background: pkg.isBold ? 'var(--apex-ember)' : 'var(--apex-plum)',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 700,
            borderRadius: '9999px',
            fontFamily: 'var(--font-body)',
          }}
        >
          {pkg.isBold ? 'INCREDIBLE VALUE' : 'RECOMMENDED'}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>{pkg.icon}</div>
      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          fontWeight: 700,
          color: pkg.isBold ? 'var(--apex-ember)' : 'var(--apex-plum)',
          marginBottom: '8px',
        }}
      >
        <strong>{pkg.name}</strong>
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--slate)', marginBottom: '24px', flex: 1 }}>
        {pkg.description}
      </p>

      {/* Session selector */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: pkg.isBold ? 'var(--apex-ember)' : 'var(--apex-plum)',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Select sessions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {SESSION_COUNTS.map((count) => (
            <button
              key={count}
              onClick={() => setSessions(count)}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: sessions === count ? `2px solid ${pkg.isBold ? 'var(--apex-ember)' : 'var(--apex-plum)'}` : '1px solid var(--fog)',
                background: sessions === count ? (pkg.isBold ? 'rgba(255,106,31,0.1)' : 'var(--apex-violet)') : '#fff',
                color: pkg.isBold ? 'var(--apex-ember)' : 'var(--apex-plum)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Price display */}
      <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--apex-line)' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '40px',
            fontWeight: 800,
            color: pkg.isBold ? 'var(--apex-ember)' : 'var(--apex-plum)',
          }}
        >
          <strong>${totalPrice}</strong>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--slate)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              textDecoration: pkg.isBold ? 'line-through' : 'none',
              opacity: pkg.isBold ? 0.6 : 1,
            }}
          >
            ${pkg.baseRate}/hr
          </span>
          {sessions > 1 && (
            <span style={{ fontWeight: 700, color: 'var(--apex-ember)' }}>
              Save ${savings}
            </span>
          )}
        </div>
        {sessions > 1 && (
          <div style={{ fontSize: '11px', color: 'var(--slate)', marginTop: '4px' }}>
            ${ratePerSession}/hr × {sessions} sessions
          </div>
        )}
      </div>

      {/* Student info inputs */}
      <div style={{ marginBottom: '16px', display: 'grid', gap: '10px' }}>
        <input
          type="text"
          placeholder="Your name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid var(--fog)',
            fontSize: '13px',
            fontFamily: 'var(--font-body)',
          }}
        />
        <input
          type="email"
          placeholder="Your email"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid var(--fog)',
            fontSize: '13px',
            fontFamily: 'var(--font-body)',
          }}
        />
      </div>

      {/* Buy button */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          padding: '14px 20px',
          borderRadius: '8px',
          background: pkg.isBold ? 'var(--apex-ember)' : pkg.recommended ? 'var(--apex-plum)' : 'var(--apex-plum-soft)',
          color: '#fff',
          border: 'none',
          fontWeight: 600,
          fontSize: '14px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '16px',
          transition: 'opacity 0.2s',
          opacity: loading ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'
        }}
        onMouseLeave={(e) => {
          if (!loading) (e.currentTarget as HTMLButtonElement).style.opacity = '1'
        }}
      >
        {loading ? 'Processing...' : 'Checkout →'}
      </button>

      {/* Features list */}
      <div style={{ fontSize: '13px' }}>
        <div
          style={{
            fontWeight: 700,
            color: pkg.isBold ? 'var(--apex-ember)' : 'var(--apex-plum)',
            marginBottom: '12px',
          }}
        >
          What's included
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {pkg.features.map((f, i) => (
            <li key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', color: 'var(--slate)', fontSize: '12px' }}>
              <span style={{ color: pkg.isBold ? 'var(--apex-ember)' : 'var(--apex-plum)', fontWeight: 700 }}>✓</span>
              {f.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function PackagesPage() {
  const [searchParams] = useSearchParams()
  const lockedPackage = searchParams.get('package')
  const lockedSessions = searchParams.get('sessions')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <section className="ed-section">
        <div className="ed-section-inner">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h1 className="ed-section-heading" style={{ fontSize: '40px' }}>
              Flexible Pricing<span className="ed-ember-period">.</span>
            </h1>
            <p className="ed-section-body" style={{ marginTop: '12px', maxWidth: '540px', margin: '12px auto 0' }}>
              Choose your package and select how many sessions you need. Pay only for what you use.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {PACKAGES.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} lockedPackage={lockedPackage} lockedSessions={lockedSessions} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
