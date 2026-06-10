import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ParentLoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    if (isSignUp) {
      const { error } = await signUpWithEmail(email, password, fullName, 'parent')
      if (error) setError(error.message)
      else navigate('/parent-dashboard')
    } else {
      const { error } = await signInWithEmail(email, password)
      if (error) setError(error.message)
      else navigate('/parent-dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'grid', placeItems: 'center', padding: '24px' }}>
      {/* Ambient orbs */}
      <div className="apex-orb apex-orb-1" />
      <div className="apex-orb apex-orb-2" />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 2 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--apex-plum)', textDecoration: 'none', letterSpacing: '-0.02em' }}>
            Apex Minds
          </Link>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--slate)', marginTop: '6px' }}>
            Parent portal
          </p>
        </div>

        <div className="glass-panel" style={{ borderRadius: '20px', padding: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            {isSignUp ? 'Create parent account' : 'Welcome back'}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--slate)', marginBottom: '28px' }}>
            {isSignUp ? 'Track your student\'s progress and sessions.' : 'Sign in to view your student\'s dashboard.'}
          </p>

          {/* Google OAuth */}
          <button
            onClick={signInWithGoogle}
            style={{
              width: '100%', padding: '13px 20px', borderRadius: '10px',
              border: '1.5px solid var(--fog)', background: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, color: 'var(--ink)',
              transition: 'border-color 0.15s, box-shadow 0.15s', marginBottom: '20px',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--fog)' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--stone)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--fog)' }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isSignUp && (
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                style={{ padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--fog)', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
              />
            )}
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--fog)', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--fog)', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' }}
            />

            {error && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fca5a5', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#dc2626' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="ed-filled-btn"
              style={{ width: '100%', padding: '14px', fontSize: '15px', fontWeight: 600, marginTop: '4px', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Loading…' : isSignUp ? 'Create account' : 'Sign in'}
            </button>
          </form>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--slate)', textAlign: 'center', marginTop: '20px' }}>
            {isSignUp ? 'Already have an account? ' : 'New here? '}
            <button
              onClick={() => { setIsSignUp(v => !v); setError('') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--apex-plum)', fontWeight: 600, fontFamily: 'var(--font-body)', fontSize: '13px', padding: 0 }}
            >
              {isSignUp ? 'Sign in' : 'Create account'}
            </button>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--stone)' }}>
          Student login? <Link to="/login" style={{ color: 'var(--apex-plum)', fontWeight: 600 }}>Click here</Link>
        </p>
      </div>
    </div>
  )
}
