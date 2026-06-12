import { useState } from 'react'

type AdminTab = 'profile' | 'availability' | 'bookings' | 'earnings'

export default function AdminDashboard() {
  const [tab, setTab] = useState<AdminTab>('profile')
  const [tutorName] = useState('Alex Chen')
  const [hourlyRate, setHourlyRate] = useState(75)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 700, color: 'var(--apex-plum)', marginBottom: '8px' }}>
            {tutorName} Dashboard
          </h1>
          <p style={{ color: 'var(--slate)', fontFamily: 'var(--font-body)' }}>Manage your profile, availability, bookings, and earnings</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid var(--apex-line)', paddingBottom: '16px' }}>
          {(['profile', 'availability', 'bookings', 'earnings'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: tab === t ? 'var(--apex-plum)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--slate)',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '14px',
                textTransform: 'capitalize',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div style={{ maxWidth: '600px' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: 'var(--apex-plum)' }}>
                Profile Settings
              </h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px' }}>Name</label>
                  <input
                    type="text"
                    defaultValue={tutorName}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid var(--fog)',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px' }}>Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid var(--fog)',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600, fontSize: '13px' }}>Bio</label>
                  <textarea
                    placeholder="Tell students about yourself..."
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid var(--fog)',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      minHeight: '100px',
                      fontFamily: 'var(--font-body)',
                    }}
                  />
                </div>
                <button
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'var(--apex-plum)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Availability Tab */}
        {tab === 'availability' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: 'var(--apex-plum)' }}>
              Manage Your Availability
            </h2>
            <p style={{ color: 'var(--slate)', marginBottom: '20px', fontSize: '14px' }}>Coming soon: Calendar view to block/unblock time slots</p>
          </div>
        )}

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: 'var(--apex-plum)' }}>
              Upcoming Bookings
            </h2>
            <p style={{ color: 'var(--slate)', marginBottom: '20px', fontSize: '14px' }}>Coming soon: List of bookings and student details</p>
          </div>
        )}

        {/* Earnings Tab */}
        {tab === 'earnings' && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, marginBottom: '20px', color: 'var(--apex-plum)' }}>
              Earnings
            </h2>
            <p style={{ color: 'var(--slate)', marginBottom: '20px', fontSize: '14px' }}>Coming soon: Earnings breakdown and payout history</p>
          </div>
        )}
      </div>
    </div>
  )
}
