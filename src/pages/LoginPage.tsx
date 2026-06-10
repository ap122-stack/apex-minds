import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signInWithEmail(email, password)
    if (error) setError(error.message)
    else navigate('/')
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'grid', placeItems: 'center', padding: '24px' }}>
      <div className="apex-orb apex-orb-1" />
      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--apex-plum)', textDecoration: 'none' }}>
            Apex Minds
          </Link>
        </div>
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '24px', letterSpacing: '-0.02em' }}>
            Sign in
          </h1>
          <button onClick={signInWithGoogle} style={{ width: '100%', padding: '13px', borderRadius: '10px', border: '1.5px solid var(--fog)', background: '#fff', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 600, color: 'var(--ink)', marginBottom: '20px' }}>
            Continue with Google
          </button>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--fog)', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none', boxSizing: 'border-box', width: '100%' }} />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '12px 14px', borderRadius: '10px', border: '1.5px solid var(--fog)', fontFamily: 'var(--font-body)', fontSize: '14px', outline: 'none', boxSizing: 'border-box', width: '100%' }} />
            {error && <div style={{ padding: '10px', borderRadius: '8px', background: '#fef2f2', color: '#dc2626', fontSize: '13px' }}>{error}</div>}
            <button type="submit" disabled={loading} className="ed-filled-btn" style={{ width: '100%', padding: '13px', fontSize: '15px' }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--slate)', fontFamily: 'var(--font-body)' }}>
            Parent? <Link to="/parent-login" style={{ color: 'var(--apex-plum)', fontWeight: 600 }}>Parent login →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
