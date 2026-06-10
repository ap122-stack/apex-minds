import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS_SHORT = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const SUBJECT_TYPES = ['Standard', 'AP', 'Test Prep'] as const
type SubjectType = typeof SUBJECT_TYPES[number]

function buildHourSlots(dateKey: string) {
  const slots: { id: string; time: string; hour: number }[] = []
  for (let h = 9; h <= 20; h++) {
    const ampm = h < 12 ? 'AM' : 'PM'
    const hour = h <= 12 ? h : h - 12
    slots.push({ id: `${dateKey}-${h}`, time: `${hour}:00 ${ampm}`, hour: h })
  }
  return slots
}

function PremiumCalendar({ onConfirm }: { onConfirm: (data: { slots: string[]; subjectType: string; sessionCount: number }) => void }) {
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [subjectType, setSubjectType] = useState<SubjectType>('Standard')
  const [sessionTarget, setSessionTarget] = useState(4)
  const navigate = useNavigate()

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const getDayKey = (day: number) => `${MONTHS_FULL[month]} ${day}`
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const isPast = (day: number) => new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const isToday = (day: number) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const daySlots = selectedDay ? buildHourSlots(getDayKey(selectedDay)) : []

  const toggleSlot = (id: string) => {
    setSelectedSlots(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= sessionTarget) return prev
      return [...prev, id]
    })
  }

  const getCellClass = (day: number | null) => {
    if (!day) return 'apex-cal-cell'
    const classes = ['apex-cal-cell']
    if (isPast(day)) classes.push('apex-cal-cell-booked')
    else classes.push('apex-cal-cell-available')
    if (isToday(day)) classes.push('apex-cal-cell-today')
    if (selectedDay === day) classes.push('apex-cal-cell-selected')
    return classes.join(' ')
  }

  return (
    <div className="apex-cal">
      {/* Subject picker */}
      <div style={{ marginBottom: '16px' }}>
        <div className="apex-cal-slots-title" style={{ marginBottom: '10px' }}>Session type</div>
        <div className="apex-cal-subject-picker">
          {SUBJECT_TYPES.map(t => (
            <button key={t} className={'apex-cal-subj-btn' + (subjectType === t ? ' apex-cal-subj-btn-active' : '')} onClick={() => setSubjectType(t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Session count */}
      <div className="apex-cal-session-counter">
        <button className="apex-cal-counter-btn" onClick={() => setSessionTarget(n => Math.max(1, n - 1))}>&#8722;</button>
        <div style={{ flex: 1 }}>
          <span className="apex-cal-counter-label">Sessions to book</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
            <span className="apex-cal-multi-count">{sessionTarget}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(33,28,48,0.5)' }}>/month</span>
          </div>
        </div>
        <button className="apex-cal-counter-btn" onClick={() => setSessionTarget(n => Math.min(16, n + 1))}>+</button>
        <div style={{ textAlign: 'right' }}>
          <span className="apex-cal-multi-count" style={{ color: selectedSlots.length >= sessionTarget ? 'var(--apex-ember)' : 'var(--apex-plum)' }}>{selectedSlots.length}</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(33,28,48,0.45)', display: 'block' }}>selected</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="apex-cal-header">
        <button className="apex-cal-nav-btn" onClick={() => { setViewDate(new Date(year, month - 1, 1)); setSelectedDay(null) }}>←</button>
        <span className="apex-cal-month-label">{MONTHS_FULL[month]} {year}</span>
        <button className="apex-cal-nav-btn" onClick={() => { setViewDate(new Date(year, month + 1, 1)); setSelectedDay(null) }}>→</button>
      </div>
      <div className="apex-cal-daynames">
        {DAYS_SHORT.map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="apex-cal-grid">
        {cells.map((day, i) => (
          <div key={i} className={getCellClass(day)} onClick={() => { if (day && !isPast(day)) setSelectedDay(day === selectedDay ? null : day) }}>
            {day && <>
              <span className="apex-cal-day-num">{day}</span>
              {!isPast(day) && <span className="apex-cal-dot"></span>}
            </>}
          </div>
        ))}
      </div>

      {/* Hour slots */}
      {selectedDay && (
        <div className="apex-cal-slots">
          <div className="apex-cal-slots-title">{getDayKey(selectedDay)} — pick up to {sessionTarget} slot{sessionTarget !== 1 ? 's' : ''}</div>
          <div className="apex-cal-slots-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {daySlots.map(slot => (
              <button
                key={slot.id}
                className={'apex-cal-time-btn' + (selectedSlots.includes(slot.id) ? ' apex-cal-time-multi-selected' : '')}
                onClick={() => toggleSlot(slot.id)}
                disabled={!selectedSlots.includes(slot.id) && selectedSlots.length >= sessionTarget}
                style={{ opacity: !selectedSlots.includes(slot.id) && selectedSlots.length >= sessionTarget ? 0.4 : 1 }}
              >
                <span className="apex-cal-time" style={{ fontSize: '14px' }}>{slot.time}</span>
                <span className="apex-cal-subject">{subjectType}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {selectedSlots.length > 0 && (
        <div className="apex-cal-selected-summary">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span>{selectedSlots.length} of {sessionTarget} sessions selected · {subjectType}</span>
            <button onClick={() => setSelectedSlots([])} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', color: 'white', fontSize: '11px', fontWeight: 700 }}>
              Clear
            </button>
          </div>
          {selectedSlots.length === sessionTarget && (
            <button className="apex-cal-confirm-btn" style={{ marginTop: 0 }} onClick={() => { onConfirm({ slots: selectedSlots, subjectType, sessionCount: sessionTarget }); navigate('/packages') }}>
              Continue to Packages →
            </button>
          )}
        </div>
      )}

      {!selectedDay && selectedSlots.length === 0 && (
        <div className="apex-cal-empty-state">Select a date to see available time slots.</div>
      )}
    </div>
  )
}

export default function BookingPage() {
  const { setSelectedBooking } = useApp()
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <section className="ed-section">
        <div className="ed-section-inner" style={{ maxWidth: '720px' }}>
          <div style={{ marginBottom: '40px' }}>
            <h1 className="ed-section-heading" style={{ fontSize: '32px' }}>Book your sessions<span className="ed-ember-period">.</span></h1>
            <p className="ed-section-body" style={{ marginTop: '10px' }}>Select your session type, how many you want, then pick your time slots.</p>
          </div>
          <PremiumCalendar
            onConfirm={(data) => {
              setSelectedBooking(data)
              navigate('/packages')
            }}
          />
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button onClick={() => navigate('/tutors')} className="ed-btn-outline">
              ← Choose a different tutor
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
