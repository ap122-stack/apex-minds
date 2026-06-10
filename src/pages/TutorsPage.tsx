import { useNavigate } from 'react-router-dom'

const TUTORS = [
  { id: 'stem', name: 'Alex Chen', subjects: ['AP Calculus', 'AP Physics', 'SAT Math'], rate: 75, rating: 5.0, sessions: 28, bio: 'MIT grad specializing in STEM fundamentals and AP exam mastery.', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&auto=format&fit=crop' },
  { id: 'humanities', name: 'Maya Johnson', subjects: ['AP English', 'College Essays', 'Writing'], rate: 70, rating: 5.0, sessions: 22, bio: 'Yale English grad with a 100% college admissions essay success rate.', photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&q=80&auto=format&fit=crop' },
  { id: 'testprep', name: 'Jordan Park', subjects: ['SAT', 'ACT', 'PSAT'], rate: 80, rating: 5.0, sessions: 31, bio: 'Perfect SAT scorer helping students crack the 1500+ barrier.', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop' },
  { id: 'admissions', name: 'Dr. Sarah Lee', subjects: ['College Admissions', 'Common App', 'Interview Prep'], rate: 120, rating: 5.0, sessions: 19, bio: 'Former admissions officer from Stanford with insider knowledge.', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&auto=format&fit=crop' },
]

export default function TutorsPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <section className="ed-section">
        <div className="ed-section-inner">
          <div style={{ marginBottom: '48px' }}>
            <h1 className="ed-section-heading" style={{ fontSize: '36px' }}>Our tutors<span className="ed-ember-period">.</span></h1>
            <p className="ed-section-body" style={{ marginTop: '12px', maxWidth: '480px' }}>
              Every Apex Minds tutor is vetted for subject mastery, teaching effectiveness, and student outcomes.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {TUTORS.map(tutor => (
              <div key={tutor.id} className="ed-card motion-card glow-border-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                  <img src={tutor.photo} alt={tutor.name} style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover' }} />
                  <div>
                    <div className="ed-card-heading" style={{ fontSize: '18px', marginBottom: '2px' }}>{tutor.name}</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--slate)' }}>
                      ★ {tutor.rating} · {tutor.sessions} sessions
                    </div>
                  </div>
                </div>
                <p className="ed-card-body" style={{ fontSize: '14px', marginBottom: '16px', flex: 1 }}>{tutor.bio}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {tutor.subjects.map(s => (
                    <span key={s} style={{ padding: '4px 10px', borderRadius: '9999px', background: 'var(--apex-violet)', fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 700, color: 'var(--apex-plum)', letterSpacing: '0.03em' }}>{s}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--apex-plum)' }}>
                    ${tutor.rate}<span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 400, color: 'var(--slate)' }}>/hr</span>
                  </span>
                </div>
                <button onClick={() => navigate(`/tutors/${tutor.id}`)} className="ed-btn" style={{ width: '100%', justifyContent: 'center' }}>
                  View Profile →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
