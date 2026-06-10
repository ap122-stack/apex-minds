import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { useAuth } from '../contexts/AuthContext'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Match', path: '/match' },
  { name: 'Browse Tutors', path: '/tutors' },
  { name: 'Pricing', path: '/packages' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'About Us', path: '/about' },
]

export default function NavBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cart } = useApp()
  const { user, profile, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="ed-nav">
      <div className="ed-nav-inner">
        <Link to="/" className="ed-nav-logo">Apex Minds</Link>

        {/* Desktop links */}
        <div className="hidden xl:flex items-center gap-5">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={'ed-nav-link' + (location.pathname === link.path ? ' ed-nav-link-active' : '')}
            >
              {link.name}
            </Link>
          ))}
          {profile?.role === 'parent' && (
            <Link
              to="/parent-dashboard"
              className={'ed-nav-link' + (location.pathname.startsWith('/parent') ? ' ed-nav-link-active' : '')}
            >
              Dashboard
            </Link>
          )}
          {profile?.role === 'tutor' && (
            <Link
              to="/tutor/sessions"
              className={'ed-nav-link' + (location.pathname.startsWith('/tutor') ? ' ed-nav-link-active' : '')}
            >
              My Sessions
            </Link>
          )}
        </div>

        <div className="ed-nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 500, color: 'var(--slate)' }}>
                {profile?.full_name?.split(' ')[0] ?? 'Account'}
              </span>
              <button onClick={() => signOut()} className="ed-ghost-btn">Sign out</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block ed-ghost-btn">Login</Link>
              <button onClick={() => navigate('/match')} className="ed-filled-btn">Get Started</button>
            </>
          )}

          {/* Cart */}
          <div
            onClick={() => navigate('/packages')}
            className={'ed-nav-cart' + (cart.length > 0 ? ' ed-nav-cart-active' : '')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--apex-plum)' }}>
              shopping_cart
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 700, color: 'var(--apex-plum)', minWidth: '12px', textAlign: 'center' }}>
              {cart.length}
            </span>
            {cart.length > 0 && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--apex-plum)', display: 'block' }} />
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(v => !v)}
            className="xl:hidden"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: 'var(--ink)' }}
          >
            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="ed-nav-mobile-menu">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={'ed-nav-mobile-link' + (location.pathname === link.path ? ' ed-active-link' : '')}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {!user && (
            <Link to="/login" className="ed-nav-mobile-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
          )}
          {profile?.role === 'parent' && (
            <Link to="/parent-dashboard" className="ed-nav-mobile-link" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
