import { useParams, useNavigate } from 'react-router-dom'

const TUTORS: Record<string, { id: string; name: string; subjects: string[]; rating: number; sessions: number; bio: string; photo: string; longBio: string }> = {
  stem: { id: 'stem', name: 'Alex Chen', subjects: ['AP Calculus', 'AP Physics', 'SAT Math'], rating: 5.0, sessions: 28, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop', bio: 'MIT grad specializing in STEM fundamentals and AP exam mastery.', longBio: 'Alex graduated with honors from MIT in Applied Mathematics. He has helped over 28 students achieve A+ grades in AP Calculus and Physics, and consistently improves SAT Math scores by 100+ points within 8 weeks. His method focuses on concept clarity over memorization.' },
  humanities: { id: 'humanities', name: 'Maya Johnson', subjects: ['AP English', 'College Essays', 'Writing'], rating: 5.0, sessions: 22, photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=800&q=80&auto=format&fit=crop', bio: 'Yale English grad with a 100% college admissions essay success rate.', longBio: 'Maya earned her English degree from Yale and spent 3 years tutoring high-achieving students across the northeast. Every student she has coached on college essays has received at least one acceptance from their first-choice school.' },
  testprep: { id: 'testprep', name: 'Jordan Park', subjects: ['SAT', 'ACT', 'PSAT'], rating: 5.0, sessions: 31, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80&auto=format&fit=crop', bio: 'Perfect SAT scorer helping students crack the 1500+ barrier.', longBio: 'Jordan scored a perfect 1600 on the SAT and a 36 on the ACT. He teaches a proprietary method that isolates your weakest question types and builds targeted strategies. Average score improvement after 8 sessions: +180 points.' },
  admissions: { id: 'admissions', name: 'Dr. Sarah Lee', subjects: ['College Admissions', 'Common App', 'Interview Prep'], rating: 5.0, sessions: 19, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80&auto=format&fit=crop', bio: 'Former admissions officer from Stanford with insider knowledge.', longBio: 'Dr. Lee spent 7 years as a Senior Admissions Officer at Stanford University before founding her private consulting practice. She knows exactly what top schools look for and crafts application narratives that stand out from thousands of applicants.' },
}

export default function TutorProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const tutor = TUTORS[id ?? '']

  if (!tutor) return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--cream)' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--slate)' }}>Tutor not found.</p>
        <button onClick={() => navigate('/tutors')} className="ed-btn" style={{ marginTop: '16px' }}>Browse tutors</button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <section className="ed-section-white">
        <div className="ed-section-inner" style={{ maxWidth: '800px' }}>
          <button onClick={() => navigate('/tutors')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--slate)', marginBottom: '32px', padding: 0 }}>
            ← All tutors
          </button>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <img src={tutor.photo} alt={tutor.name} style={{ width: '160px', height: '160px', borderRadius: '20px', objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: '240px' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '6px', letterSpacing: '-0.025em' }}>{tutor.name}</h1>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--slate)', marginBottom: '16px' }}>★ {tutor.rating} · {tutor.sessions} sessions completed</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {tutor.subjects.map(s => <span key={s} style={{ padding: '5px 12px', borderRadius: '9999px', background: 'var(--apex-violet)', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 700, color: 'var(--apex-plum)' }}>{s}</span>)}
              </div>
              <button onClick={() => navigate('/booking')} className="ed-btn" style={{ padding: '14px 28px', fontSize: '15px' }}>
                Book a session →
              </button>
            </div>
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '12px' }}>About</h2>
            <p className="ed-section-body">{tutor.longBio}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
