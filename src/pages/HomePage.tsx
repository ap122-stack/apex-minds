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

      {/* ── Disciplines ── */}
      <section className="ed-section">
        <div className="ed-section-inner">
          <div style={{ maxWidth: '520px', marginBottom: '48px' }}>
            <h2 className="ed-section-heading">Specialized academic disciplines<span className="ed-ember-period">.</span></h2>
            <p className="ed-section-body" style={{ marginTop: '12px' }}>Each tutor is carefully matched to a specific domain — so you get genuine expertise, not a generalist.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {[
              { icon: 'science', title: 'STEM', body: 'Algebra, Calculus & Physics mastery with custom concept-repair for AP and college-level courses.' },
              { icon: 'edit_note', title: 'Humanities', body: 'Essay coaching, literary analysis, and rhetorical writing for AP English and college applications.' },
              { icon: 'quiz', title: 'Test Prep', body: 'Targeted SAT & ACT strategy that addresses your exact weak sections through diagnostic-driven drills.' },
              { icon: 'school', title: 'Admissions', body: 'College application strategy, Common App essays, and interview coaching for top-choice admits.' },
            ].map(card => (
              <div key={card.title} className="ed-card scroll-reveal-stagger motion-card">
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--graphite)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                  <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '22px' }}>{card.icon}</span>
                </div>
                <h3 className="ed-card-heading">{card.title}</h3>
                <p className="ed-card-body">{card.body}</p>
                <button onClick={() => navigate('/tutors')} className="ed-btn" style={{ marginTop: '24px', fontSize: '13px', padding: '9px 18px' }}>
                  Find {card.title} tutors
                </button>
              </div>
            ))}
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
