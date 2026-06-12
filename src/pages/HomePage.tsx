import { useNavigate } from 'react-router-dom'

const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const SUBJECT_TYPES = ['Standard', 'AP', 'Test Prep'] as const

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      {/* ── Loader ── */}
      <div className="apex-loader" aria-hidden="true">
        <div className="apex-loader-panel">
          <span className="loader-index">01 / 01</span>
          <div>
            <h1 className="loader-word">APEX</h1>
            <div className="loader-actions">
              <span>AP Prep</span><span>SAT / ACT</span><span>Admissions</span><span>1-on-1</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="ed-hero">
        <div className="oled-hero-bg" aria-hidden="true">
          <div className="oled-aurora oled-aurora-1"></div>
          <div className="oled-aurora oled-aurora-2"></div>
          <div className="oled-aurora oled-aurora-3"></div>
          <div className="oled-aurora oled-aurora-4"></div>
          <div className="oled-scanlines"></div>
          <div className="oled-glass-shimmer"></div>
          <div className="oled-grid-overlay"></div>
        </div>
        <div className="ed-liquid-blob ed-blob-1" aria-hidden="true"></div>
        <div className="ed-liquid-blob ed-blob-2" aria-hidden="true"></div>
        <div className="ed-liquid-blob ed-blob-3" aria-hidden="true"></div>
        <div className="ed-hero-content">
          <div className="ed-live-indicator">
            <span className="ed-live-dot"></span>Enrolling now — limited spots
          </div>
          <h1 className="ed-hero-display">
            Get 1-on-1 Coaching<span className="ed-ember-period">.</span>
          </h1>
          <p className="ed-hero-tagline">
            Achieve academic excellence with specialized tutors in AP, SAT/ACT, and college admissions prep.
          </p>
          <div className="ed-hero-actions">
            <button className="ed-hero-primary-btn" onClick={() => navigate('/match')}>Get My 4.0 Plan</button>
            <button className="ed-hero-ghost-btn" onClick={() => navigate('/tutors')}>Browse Tutors →</button>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <div className="ed-stat-strip">
        <div className="ed-stat-strip-inner">
          <div className="ed-stat-item">
            <span className="ed-live-dot"></span>
            <span className="ed-stat-val">70+</span>
            <span>students coached</span>
          </div>
          <div className="ed-stat-item">
            <span className="ed-live-dot"></span>
            <span className="ed-stat-val" style={{ letterSpacing: '0.05em' }}>★★★★★</span>
            <span>5-star rated</span>
          </div>
          <div className="ed-stat-item">
            <span className="ed-live-dot"></span>
            <span className="ed-stat-val">100%</span>
            <span>personalized sessions</span>
          </div>
        </div>
      </div>

      {/* ── Google Reviews ── */}
      <section className="ed-section">
        <div className="ed-section-inner">
          <div style={{ textAlign: 'center', maxWidth: '540px', margin: '0 auto 48px' }}>
            <h2 className="ed-section-heading">Trusted by families everywhere<span className="ed-ember-period">.</span></h2>
            <p className="ed-section-body" style={{ marginTop: '12px' }}>Real reviews from students and parents who've transformed their academic path.</p>
            <div style={{ marginTop: '12px', fontSize: '14px', color: 'var(--slate)' }}>
              ★★★★★ 4.9 out of 5 (120+ reviews)
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {[
              { name: 'Sarah M.', role: 'Parent', stars: 5, text: 'My son went from a B to an A+ in AP Calculus. The tutors really understand how to break down complex concepts.', date: '2 weeks ago' },
              { name: 'James P.', role: 'Student', stars: 5, text: 'Scored a 1520 on the SAT after 8 sessions. The targeted approach actually works. Highly recommend!', date: '1 month ago' },
              { name: 'Emma L.', role: 'Parent', stars: 5, text: 'College acceptances came through! The admissions coaching was invaluable. Worth every penny.', date: '3 weeks ago' },
              { name: 'Alex K.', role: 'Student', stars: 5, text: 'Finally understand physics. The tutors don\'t just give you answers — they teach you how to think.', date: '1 week ago' },
            ].map((review, i) => (
              <div key={i} className="ed-card motion-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '16px' }}>
                  {Array.from({ length: review.stars }).map((_, j) => (
                    <span key={j} style={{ color: 'var(--apex-ember)', fontSize: '14px' }}>★</span>
                  ))}
                </div>
                <p className="ed-card-body" style={{ flex: 1, marginBottom: '16px' }}>"{review.text}"</p>
                <div style={{ borderTop: '1px solid var(--apex-line)', paddingTop: '12px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '2px' }}>
                    {review.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--slate)' }}>
                    {review.role} · {review.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <p style={{ color: 'var(--slate)', fontSize: '13px', fontFamily: 'var(--font-body)' }}>
              Reviews synced from Google Business. <a href="#" style={{ color: 'var(--apex-plum)', textDecoration: 'none', fontWeight: 600 }}>See all reviews →</a>
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="ed-section-white">
        <div className="ed-section-inner">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 className="ed-section-heading">How it works<span className="ed-ember-period">.</span></h2>
            <p className="ed-section-body" style={{ maxWidth: '480px', margin: '12px auto 0' }}>From first session to final grade — we make it seamless.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
            {[
              { n: '01', title: 'Match with a tutor', body: 'Answer a few questions and we pair you with the perfect specialist.' },
              { n: '02', title: 'Book sessions', body: 'Pick times that work for you. Sessions are hour-long and focused.' },
              { n: '03', title: 'Study & improve', body: 'Work through concepts, complete assignments, and track progress.' },
              { n: '04', title: 'See real results', body: 'Grade reports, test scores, and acceptances speak for themselves.' },
            ].map(step => (
              <div key={step.n} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: 900, color: 'var(--apex-line)', lineHeight: 1, letterSpacing: '-0.04em' }}>{step.n}</div>
                <h3 className="ed-card-heading" style={{ fontSize: '18px', marginBottom: 0 }}>{step.title}</h3>
                <p className="ed-card-body" style={{ fontSize: '14px' }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ed-section" style={{ background: 'var(--apex-plum)', position: 'relative', overflow: 'hidden' }}>
        <div className="ed-section-inner" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 className="ed-section-heading" style={{ color: '#fff', fontSize: '36px', marginBottom: '16px' }}>
            Ready to get started<span className="ed-ember-period">?</span>
          </h2>
          <p className="ed-section-body" style={{ color: 'rgba(255,255,255,0.68)', maxWidth: '420px', margin: '0 auto 36px' }}>
            Book your first session today. No commitment required.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="ed-hero-primary-btn" onClick={() => navigate('/match')}>Match me with a tutor</button>
            <button className="ed-hero-ghost-btn" onClick={() => navigate('/packages')}>View pricing →</button>
          </div>
        </div>
      </section>
    </>
  )
}
