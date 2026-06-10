import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import type { CartItem } from '../contexts/AppContext'

const PACKAGES = [
  { id: 'std-4', name: 'Standard Starter', type: 'Standard', sessions: 4, priceCents: 30000, tag: 'Most flexible' },
  { id: 'std-8', name: 'Standard Growth', type: 'Standard', sessions: 8, priceCents: 56000, tag: 'Best value' },
  { id: 'ap-4', name: 'AP Intensive', type: 'AP', sessions: 4, priceCents: 40000, tag: 'AP focused' },
  { id: 'ap-8', name: 'AP Full Prep', type: 'AP', sessions: 8, priceCents: 76000, tag: 'Recommended' },
  { id: 'sat-4', name: 'SAT/ACT Sprint', type: 'Test Prep', sessions: 4, priceCents: 40000, tag: 'Quick boost' },
  { id: 'sat-8', name: 'SAT/ACT Mastery', type: 'Test Prep', sessions: 8, priceCents: 76000, tag: 'Most popular' },
  { id: 'adm-1', name: 'Admissions Consult', type: 'Admissions', sessions: 1, priceCents: 40000, tag: 'Single session' },
  { id: 'adm-3', name: 'Admissions Full', type: 'Admissions', sessions: 3, priceCents: 120000, tag: 'Full package' },
]

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  'Standard':   { bg: 'var(--apex-violet)', color: 'var(--apex-plum)' },
  'AP':         { bg: '#fef3c7', color: '#92400e' },
  'Test Prep':  { bg: '#d1fae5', color: '#065f46' },
  'Admissions': { bg: '#fee2e2', color: '#991b1b' },
}

export default function PackagesPage() {
  const navigate = useNavigate()
  const { addToCart, cart } = useApp()

  function handleAdd(pkg: typeof PACKAGES[0]) {
    const item: CartItem = {
      id: pkg.id,
      name: pkg.name,
      type: pkg.type,
      sessions: pkg.sessions,
      priceCents: pkg.priceCents,
    }
    addToCart(item)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <section className="ed-section">
        <div className="ed-section-inner">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h1 className="ed-section-heading" style={{ fontSize: '36px' }}>Packages &amp; Pricing<span className="ed-ember-period">.</span></h1>
            <p className="ed-section-body" style={{ marginTop: '12px', maxWidth: '480px', margin: '12px auto 0' }}>
              No subscription, no hidden fees. Pay for what you need.
            </p>
          </div>

          {(['Standard', 'AP', 'Test Prep', 'Admissions'] as const).map(type => (
            <div key={type} style={{ marginBottom: '48px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '20px', letterSpacing: '-0.02em' }}>
                {type}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {PACKAGES.filter(p => p.type === type).map(pkg => {
                  const c = TYPE_COLORS[pkg.type]
                  const inCart = cart.some(i => i.id === pkg.id)
                  return (
                    <div key={pkg.id} className="ed-card motion-card" style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, background: c.bg, color: c.color, fontFamily: 'var(--font-body)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                          {pkg.tag}
                        </span>
                      </div>
                      <h3 className="ed-card-heading">{pkg.name}</h3>
                      <p className="ed-card-body" style={{ fontSize: '14px', marginBottom: '20px', flex: 1 }}>
                        {pkg.sessions} × 1-hour session{pkg.sessions > 1 ? 's' : ''}
                      </p>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--apex-plum)', letterSpacing: '-0.03em', marginBottom: '20px' }}>
                        ${(pkg.priceCents / 100).toFixed(0)}
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 400, color: 'var(--slate)' }}>
                          {' '}(${Math.round(pkg.priceCents / pkg.sessions / 100)}/session)
                        </span>
                      </div>
                      <button
                        onClick={() => inCart ? navigate('/booking') : handleAdd(pkg)}
                        className="ed-btn"
                        style={{ width: '100%', justifyContent: 'center', background: inCart ? 'var(--apex-plum-vivid)' : undefined }}
                      >
                        {inCart ? 'In cart — Book now →' : 'Add to cart'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
