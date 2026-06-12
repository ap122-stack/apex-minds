import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  {
    id: 'discipline',
    question: 'Choose your academic discipline',
    category: true,
    options: [
      'AP Biology', 'AP Chemistry', 'AP Physics', 'AP Calculus',
      'AP Statistics', 'AP US History', 'AP English', 'AP Literature',
      'SAT Math', 'SAT Reading', 'ACT Math', 'ACT Science',
      'General Math', 'General Science', 'General English', 'College Chemistry',
      'College Biology', 'Other',
    ],
  },
  {
    id: 'subject',
    question: 'What subject do you need help with?',
    options: ['Math / Calculus', 'Science / Physics', 'Writing / English', 'SAT / ACT', 'AP Courses', 'College Admissions'],
  },
  {
    id: 'goal',
    question: "What's your main goal?",
    options: ['Improve my grade', 'Ace an upcoming exam', 'Get into a top college', 'Build strong fundamentals', 'Fast improvement'],
  },
  {
    id: 'timeline',
    question: 'How soon do you need help?',
    options: ['Right now', 'Within a week', 'Within a month', 'Just exploring'],
  },
]

export default function MatchPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  function pick(value: string) {
    const key = STEPS[step].id
    const updated = { ...answers, [key]: value }
    setAnswers(updated)
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else navigate('/tutors')
  }

  const current = STEPS[step]
  const isCategory = (current as any).category

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'grid', placeItems: 'center', padding: '24px' }}>
      <div className="apex-orb apex-orb-1" />
      <div className="apex-orb apex-orb-2" />
      <div style={{ width: '100%', maxWidth: '720px', position: 'relative', zIndex: 2 }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '40px', justifyContent: 'center' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                height: '4px',
                flex: 1,
                maxWidth: '80px',
                borderRadius: '9999px',
                background: i <= step ? 'var(--apex-plum)' : 'var(--fog)',
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 700,
            color: 'var(--apex-plum)',
            textAlign: 'center',
            marginBottom: '36px',
            letterSpacing: '-0.025em',
          }}
        >
          {current.question}
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: isCategory ? 'repeat(auto-fit, minmax(140px, 1fr))' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => pick(opt)}
              style={{
                padding: isCategory ? '16px 18px' : '20px 24px',
                borderRadius: '14px',
                border: '1.5px solid var(--fog)',
                background: '#fff',
                cursor: 'pointer',
                textAlign: 'center',
                fontFamily: 'var(--font-body)',
                fontSize: isCategory ? '13px' : '15px',
                fontWeight: 500,
                color: 'var(--ink)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(33,28,48,0.05)',
                animation: `float 3s ease-in-out infinite`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.borderColor = 'var(--apex-plum)'
                btn.style.background = 'var(--apex-violet)'
                btn.style.transform = 'translateY(-4px)'
                btn.style.boxShadow = '0 8px 16px rgba(33,28,48,0.15)'
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.borderColor = 'var(--fog)'
                btn.style.background = '#fff'
                btn.style.transform = 'translateY(0)'
                btn.style.boxShadow = '0 2px 8px rgba(33,28,48,0.05)'
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{
              display: 'block',
              margin: '24px auto 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--slate)',
            }}
          >
            ← Back
          </button>
        )}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  )
}
