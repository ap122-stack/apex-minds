import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'

const TUTORS: Record<string, { id: string; name: string; subjects: string[]; rating: number; sessions: number; bio: string; photo: string; longBio: string }> = {
  stem: { id: 'stem', name: 'Alex Chen', subjects: ['AP Calculus', 'AP Physics', 'SAT Math'], rating: 5.0, sessions: 28, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop', bio: 'MIT grad specializing in STEM fundamentals and AP exam mastery.', longBio: 'Alex graduated with honors from MIT in Applied Mathematics. He has helped over 28 students achieve A+ grades in AP Calculus and Physics, and consistently improves SAT Math scores by 100+ points within 8 weeks. His method focuses on concept clarity over memorization.' },
  humanities: { id: 'humanities', name: 'Maya Johnson', subjects: ['AP English', 'College Essays', 'Writing'], rating: 5.0, sessions: 22, photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=800&q=80&auto=format&fit=crop', bio: 'Yale English grad with a 100% college admissions essay success rate.', longBio: 'Maya earned her English degree from Yale and spent 3 years tutoring high-achieving students across the northeast. Every student she has coached on college essays has received at least one acceptance from their first-choice school.' },
  testprep: { id: 'testprep', name: 'Jordan Park', subjects: ['SAT', 'ACT', 'PSAT'], rating: 5.0, sessions: 31, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80&auto=format&fit=crop', bio: 'Perfect SAT scorer helping students crack the 1500+ barrier.', longBio: 'Jordan scored a perfect 1600 on the SAT and a 36 on the ACT. He teaches a proprietary method that isolates your weakest question types and builds targeted strategies. Average score improvement after 8 sessions: +180 points.' },
  admissions: { id: 'admissions', name: 'Dr. Sarah Lee', subjects: ['College Admissions', 'Common App', 'Interview Prep'], rating: 5.0, sessions: 19, photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80&auto=format&fit=crop', bio: 'Former admissions officer from Stanford with insider knowledge.', longBio: 'Dr. Lee spent 7 years as a Senior Admissions Officer at Stanford University before founding her private consulting practice. She knows exactly what top schools look for and crafts application narratives that stand out from thousands of applicants.' },
}

const PRICING: Record<string, Record<number, number>> = {
  standard: { 1: 40, 4: 152, 8: 288, 12: 408 },
  ap: { 1: 45, 4: 172, 8: 328, 12: 468 },
  testprep: { 1: 70, 4: 272, 8: 528, 12: 768 },
}

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']

const DISCIPLINES = ['Standard', 'AP', 'Test Prep']
const SESSION_COUNTS = [1, 4, 8, 12]
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type BookingStep = 'discipline' | 'sessions' | 'calendar' | 'summary' | 'confirm'

export default function TutorProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const tutor = TUTORS[id ?? '']

  const [bookingStep, setBookingStep] = useState<BookingStep | null>(null)
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null)
  const [selectedSessions, setSelectedSessions] = useState<number | null>(null)
  const [selectedDateTimes, setSelectedDateTimes] = useState<Array<{ date: string; time: string }>>([])
  const [selectedDateForTime, setSelectedDateForTime] = useState<string | null>(null)
  const [viewDate, setViewDate] = useState(new Date())

  if (!tutor) return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--cream)' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--slate)' }}>Tutor not found.</p>
        <button onClick={() => navigate('/tutors')} className="ed-btn" style={{ marginTop: '16px' }}>Browse tutors</button>
      </div>
    </div>
  )

  const handleBack = () => {
    if (bookingStep === 'calendar') setBookingStep('sessions')
    else if (bookingStep === 'summary') setBookingStep('calendar')
    else if (bookingStep === 'confirm') setBookingStep('summary')
    else setBookingStep(null)
  }

  const handleDateSelect = (day: number) => {
    const dateStr = `${MONTHS_FULL[viewDate.getMonth()]} ${day}`
    setSelectedDateForTime(dateStr)
  }

  const handleTimeSelect = (time: string) => {
    if (!selectedDateForTime) return
    const exists = selectedDateTimes.find((dt) => dt.date === selectedDateForTime)
    if (exists) {
      setSelectedDateTimes((prev) => prev.filter((dt) => !(dt.date === selectedDateForTime)))
    } else {
      if (selectedDateTimes.length < (selectedSessions || 4)) {
        setSelectedDateTimes((prev) => [...prev, { date: selectedDateForTime, time }])
        setSelectedDateForTime(null)
      }
    }
  }

  const buildCalendar = () => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }

  const calendarCells = buildCalendar()
  const packageKey = selectedDiscipline?.toLowerCase().replace(' ', '') || 'standard'
  const totalPrice = selectedSessions && PRICING[packageKey as keyof typeof PRICING]?.[selectedSessions as keyof typeof PRICING['standard']] || 0

  if (bookingStep === 'discipline') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'grid', placeItems: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '24px', textAlign: 'center' }}>
            Choose a discipline with {tutor.name}
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {DISCIPLINES.map((d) => (
              <button
                key={d}
                onClick={() => { setSelectedDiscipline(d); setBookingStep('sessions') }}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid var(--fog)',
                  background: '#fff',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--apex-plum)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.borderColor = 'var(--apex-plum)'
                  btn.style.background = 'var(--apex-violet)'
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                  const btn = e.currentTarget as HTMLButtonElement
                  btn.style.borderColor = 'var(--fog)'
                  btn.style.background = '#fff'
                }}
              >
                {d}
              </button>
            ))}
          </div>
          <button onClick={() => setBookingStep(null)} style={{ width: '100%', marginTop: '16px', padding: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            ← Back
          </button>
        </div>
      </div>
    )
  }

  if (bookingStep === 'sessions') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'grid', placeItems: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '500px', width: '100%' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '24px', textAlign: 'center' }}>
            How many sessions?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            {SESSION_COUNTS.map((count) => (
              <button
                key={count}
                onClick={() => { setSelectedSessions(count); setSelectedDateTimes([]); setBookingStep('calendar') }}
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  border: selectedSessions === count ? '2px solid var(--apex-plum)' : '1px solid var(--fog)',
                  background: selectedSessions === count ? 'var(--apex-violet)' : '#fff',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--apex-plum)',
                  transition: 'all 0.2s',
                }}
              >
                {count}
              </button>
            ))}
          </div>
          <button onClick={handleBack} style={{ width: '100%', padding: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            ← Back
          </button>
        </div>
      </div>
    )
  }

  if (bookingStep === 'calendar') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'grid', placeItems: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '600px', width: '100%' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '20px', textAlign: 'center' }}>
            Select {selectedSessions} date{selectedSessions !== 1 ? 's' : ''} & time ({selectedDateTimes.length} chosen)
          </h2>

          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>←</button>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--apex-plum)' }}>
                {MONTHS_FULL[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>→</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '12px' }}>
              {DAYS_SHORT.map((d) => (
                <div key={d} style={{ textAlign: 'center', fontWeight: 700, fontSize: '12px', color: 'var(--slate)' }}>
                  {d}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '20px' }}>
              {calendarCells.map((day, i) => {
                const dateStr = `${MONTHS_FULL[viewDate.getMonth()]} ${day}`
                const isSelected = selectedDateTimes.some((dt) => dt.date === dateStr)
                return (
                  <button
                    key={i}
                    onClick={() => day && handleDateSelect(day)}
                    disabled={!day}
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: selectedDateForTime === dateStr ? '2px solid var(--apex-plum)' : isSelected ? '2px solid var(--apex-ember)' : '1px solid var(--fog)',
                      background: selectedDateForTime === dateStr ? 'var(--apex-violet)' : isSelected ? 'var(--apex-ember)' : '#fff',
                      color: selectedDateForTime === dateStr || isSelected ? '#fff' : 'var(--apex-plum)',
                      cursor: day ? 'pointer' : 'default',
                      fontSize: '12px',
                      fontWeight: 600,
                      opacity: day ? 1 : 0.3,
                    }}
                  >
                    {day}
                  </button>
                )
              })}
            </div>

            {selectedDateForTime && (
              <div style={{ paddingTop: '20px', borderTop: '1px solid var(--apex-line)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--apex-plum)', marginBottom: '12px' }}>
                  Pick time for {selectedDateForTime}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => handleTimeSelect(slot)}
                      style={{
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid var(--fog)',
                        background: '#fff',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        color: 'var(--apex-plum)',
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => selectedDateTimes.length === selectedSessions && setBookingStep('summary')}
            disabled={selectedDateTimes.length !== selectedSessions}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: selectedDateTimes.length === selectedSessions ? 'var(--apex-plum)' : 'var(--fog)',
              color: '#fff',
              border: 'none',
              cursor: selectedDateTimes.length === selectedSessions ? 'pointer' : 'not-allowed',
              fontWeight: 600,
              marginBottom: '12px',
            }}
          >
            Next →
          </button>

          <button onClick={handleBack} style={{ width: '100%', padding: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            ← Back
          </button>
        </div>
      </div>
    )
  }

  if (bookingStep === 'summary') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'grid', placeItems: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '500px', width: '100%', background: '#fff', borderRadius: '12px', padding: '32px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '24px', textAlign: 'center' }}>
            Review your booking
          </h2>

          <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--apex-line)' }}>
            <div style={{ fontSize: '13px', color: 'var(--slate)', marginBottom: '16px' }}>
              <strong>Tutor:</strong> {tutor.name}<br />
              <strong>Discipline:</strong> {selectedDiscipline}<br />
              <strong>Sessions:</strong> {selectedSessions}<br />
            </div>
            <div style={{ fontSize: '13px', color: 'var(--slate)' }}>
              <strong>Sessions:</strong><br />
              {selectedDateTimes.map((dt, i) => (
                <div key={i}>• {dt.date} at {dt.time}</div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--apex-plum)' }}>
              ${totalPrice}
            </div>
          </div>

          <button
            onClick={() => setBookingStep('confirm')}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: 'var(--apex-plum)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              marginBottom: '12px',
            }}
          >
            Confirm & Continue →
          </button>

          <button onClick={() => setBookingStep('calendar')} style={{ width: '100%', padding: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            ← Edit dates
          </button>
        </div>
      </div>
    )
  }

  if (bookingStep === 'confirm') {
    const packageMap: Record<string, string> = { standard: 'standard', ap: 'ap', testprep: 'testprep' }
    const packageKey = packageMap[selectedDiscipline?.toLowerCase() || 'standard']

    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'grid', placeItems: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '500px', width: '100%', background: '#fff', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '16px' }}>
            Ready to book?
          </h2>
          <p style={{ color: 'var(--slate)', marginBottom: '32px', fontFamily: 'var(--font-body)' }}>
            {selectedSessions} sessions · {selectedDiscipline} · ${totalPrice}
          </p>

          <button
            onClick={() => {
              const params = new URLSearchParams({
                package: packageKey,
                sessions: String(selectedSessions),
                tutor: tutor.id,
              })
              navigate(`/packages?${params.toString()}`)
            }}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              background: 'var(--apex-plum)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              marginBottom: '12px',
            }}
          >
            Proceed to Checkout →
          </button>

          <button onClick={() => setBookingStep('summary')} style={{ width: '100%', padding: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            ← Back
          </button>
        </div>
      </div>
    )
  }

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
                {tutor.subjects.map((s) => (
                  <span key={s} style={{ padding: '5px 12px', borderRadius: '9999px', background: 'var(--apex-violet)', fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 700, color: 'var(--apex-plum)' }}>
                    {s}
                  </span>
                ))}
              </div>
              <button onClick={() => setBookingStep('discipline')} className="ed-btn" style={{ padding: '14px 28px', fontSize: '15px' }}>
                Book with {tutor.name} →
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
