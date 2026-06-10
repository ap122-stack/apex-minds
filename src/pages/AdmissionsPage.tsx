import { useNavigate } from 'react-router-dom'

const SERVICES = [
  { icon: '📝', title: 'Common App Strategy', desc: 'End-to-end narrative crafting — activities list, honors, personal statement framing.' },
  { icon: '✍️', title: 'Essay Coaching', desc: 'Line-by-line essay revision with an ex-admissions officer perspective on what stands out.' },
  { icon: '🎯', title: 'School List Building', desc: 'Data-driven reach/match/safety list calibrated to your GPA, test scores, and goals.' },
  { icon: '🎤', title: 'Interview Prep', desc: 'Mock interviews with detailed feedback — for school interviews and scholarship panels.' },
  { icon: '📊', title: 'Application Timeline', desc: 'Week-by-week roadmap from junior fall through senior submission deadlines.' },
  { icon: '🏆', title: 'Scholarship Research', desc: 'Identify merit and need-based scholarships you qualify for beyond FAFSA.' },
]

const PACKAGES = [
  {
    id: 'adm-consult',
    name: 'Single Consultation',
    price: 400,
    desc: 'One focused 90-minute session. Ideal for a specific question — essay feedback, school list review, or interview prep.',
    features: ['90-minute deep-dive session', 'Recording + notes', 'Follow-up email Q&A (48hr)', 'One essay review'],
    tag: 'Most flexible',
    tagBg: '#f3efff',
    tagColor: '#211c30',
  },
  {
    id: 'adm-full',
    name: 'Full Admissions Package',
    price: 1200,
    desc: 'Three sessions covering your entire application — from school list through final essay polish.',
    features: ['3 × 90-minute sessions', 'Unlimited essay revisions', 'School list + strategy doc', 'Interview mock + debrief', 'Priority response (24hr)'],
    tag: 'Most comprehensive',
    tagBg: '#211c30',
    tagColor: '#fff',
    featured: true,
  },
]

export default function AdmissionsPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      {/* Hero */}
      <section className="ed-hero" style={{ minHeight: '52vh', background: 'var(--apex-plum)' }}>
        <div className="oled-hero-bg">
          <div className="oled-aurora oled-aurora-1" />
          <div className="oled-aurora oled-aurora-2" />
          <div className="oled-aurora oled-aurora-4" />
          <div className="oled-scanlines" />
          <div className="oled-grid-overlay" />
        </div>
        <div className="ed-hero-content" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
          <div className="ed-live-indicator">
            <span className="ed-live-dot" />
            College Admissions Consulting
          </div>
          <h1 className="ed-hero-display">
            Get into your dream school<span className="ed-ember-period">.</span>
          </h1>
          <p className="ed-hero-tagline">
            Expert guidance from a former Stanford admissions officer. Every application is different — your strategy should be too.
          </p>
          <div className="ed-hero-actions">
            <button onClick={() => navigate('/booking')} className="ed-hero-primary-btn cta-shimmer">
              Book a Consultation
            </button>
            <button onClick={() => navigate('/tutors/admissions')} className="ed-hero-ghost-btn">
              Meet Dr. Sarah Lee →
            </button>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <div className="ed-stat-strip">
        <div className="ed-stat-strip-inner">
          <div className="ed-stat-item">
            <span className="ed-stat-val">100%</span>
            <span>acceptance rate to first-choice schools</span>
          </div>
          <div className="ed-stat-item">
            <span className="ed-stat-val">70+</span>
            <span>students coached</span>
          </div>
          <div className="ed-stat-item">
            <span className="ed-stat-val">★★★★★</span>
            <span>5-star rating</span>
          </div>
        </div>
      </div>

      {/* Services */}
      <section className="ed-section">
        <div className="ed-section-inner">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 className="ed-section-heading" style={{ fontSize: '32px' }}>
              What we cover<span className="ed-ember-period">.</span>
            </h2>
            <p className="ed-section-body" style={{ maxWidth: '480px', margin: '12px auto 0' }}>
              Every part of the process — from your junior year activities list to hitting submit on your last school.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {SERVICES.map(s => (
              <div key={s.title} className="ed-card motion-card" style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '28px', flexShrink: 0, lineHeight: 1 }}>{s.icon}</span>
                <div>
                  <div className="ed-card-heading" style={{ fontSize: '18px', marginBottom: '8px' }}>{s.title}</div>
                  <p className="ed-card-body" style={{ fontSize: '14px' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="ed-section-white">
        <div className="ed-section-inner">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 className="ed-section-heading" style={{ fontSize: '32px' }}>
              Pricing<span className="ed-ember-period">.</span>
            </h2>
            <p className="ed-section-body" style={{ maxWidth: '420px', margin: '12px auto 0' }}>
              Flat-rate sessions. No hidden fees. Pay only for what you need.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', maxWidth: '760px', margin: '0 auto' }}>
            {PACKAGES.map(pkg => (
              <div
                key={pkg.id}
                className="ed-card motion-card glow-border-card"
                style={{
                  display: 'flex', flexDirection: 'column',
                  background: pkg.featured ? 'var(--apex-plum)' : '#fff',
                  color: pkg.featured ? '#fff' : undefined,
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700, background: pkg.tagBg, color: pkg.tagColor, fontFamily: 'var(--font-body)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {pkg.tag}
                  </span>
                </div>
                <div className="ed-card-heading" style={{ fontSize: '22px', color: pkg.featured ? '#fff' : undefined, marginBottom: '8px' }}>{pkg.name}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 800, color: pkg.featured ? '#fff' : 'var(--apex-plum)', letterSpacing: '-0.04em', marginBottom: '12px', lineHeight: 1 }}>
                  ${pkg.price}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: pkg.featured ? 'rgba(255,255,255,0.72)' : 'var(--slate)', lineHeight: 1.5, marginBottom: '20px', flex: 1 }}>
                  {pkg.desc}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {pkg.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-body)', fontSize: '14px', color: pkg.featured ? 'rgba(255,255,255,0.85)' : 'var(--ink)' }}>
                      <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: pkg.featured ? 'rgba(255,255,255,0.2)' : 'var(--apex-violet)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0, color: pkg.featured ? '#fff' : 'var(--apex-plum)' }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/booking')}
                  className={pkg.featured ? 'ed-hero-primary-btn cta-shimmer' : 'ed-btn'}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Book now →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="ed-section">
        <div className="ed-section-inner" style={{ textAlign: 'center' }}>
          <h2 className="ed-section-heading" style={{ fontSize: '28px' }}>Ready to get started<span className="ed-ember-period">?</span></h2>
          <p className="ed-section-body" style={{ maxWidth: '420px', margin: '12px auto 24px' }}>
            Spots fill fast — especially in fall. Book your consultation before the season starts.
          </p>
          <button onClick={() => navigate('/booking')} className="ed-btn" style={{ padding: '14px 32px', fontSize: '15px' }}>
            Book a consultation →
          </button>
        </div>
      </section>
    </div>
  )
}
