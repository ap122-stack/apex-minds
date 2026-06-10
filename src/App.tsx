import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import NavBar from './components/NavBar'
import PrivateRoute from './components/PrivateRoute'

// Pages — lazy loaded for performance
import { lazy, Suspense } from 'react'

const HomePage         = lazy(() => import('./pages/HomePage'))
const MatchPage        = lazy(() => import('./pages/MatchPage'))
const TutorsPage       = lazy(() => import('./pages/TutorsPage'))
const TutorProfile     = lazy(() => import('./pages/TutorProfile'))
const PackagesPage     = lazy(() => import('./pages/PackagesPage'))
const BookingPage      = lazy(() => import('./pages/BookingPage'))
const AdmissionsPage   = lazy(() => import('./pages/AdmissionsPage'))
const AboutPage        = lazy(() => import('./pages/AboutPage'))
const LoginPage        = lazy(() => import('./pages/LoginPage'))
const ParentLoginPage  = lazy(() => import('./pages/ParentLoginPage'))
const ParentDashboard  = lazy(() => import('./pages/ParentDashboard'))
const TutorSessionsPage = lazy(() => import('./pages/TutorSessionsPage'))
const TutorEarningsPage = lazy(() => import('./pages/TutorEarningsPage'))

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', background: 'var(--cream)' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--slate)', letterSpacing: '-0.01em' }}>Loading…</div>
    </div>
  )
}

export default function App() {
  const location = useLocation()

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Hide nav on auth pages
  const hideNav = ['/parent-login', '/login'].includes(location.pathname)

  return (
    <>
      {!hideNav && <NavBar />}

      {/* Ambient background orbs */}
      <div className="apex-orb apex-orb-1" aria-hidden="true" />
      <div className="apex-orb apex-orb-2" aria-hidden="true" />
      <div className="apex-orb apex-orb-3" aria-hidden="true" />
      <div className="apex-orb apex-orb-4" aria-hidden="true" />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/"           element={<HomePage />} />
          <Route path="/match"      element={<MatchPage />} />
          <Route path="/tutors"     element={<TutorsPage />} />
          <Route path="/tutors/:id" element={<TutorProfile />} />
          <Route path="/packages"   element={<PackagesPage />} />
          <Route path="/booking"    element={<BookingPage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/about"      element={<AboutPage />} />
          <Route path="/login"      element={<LoginPage />} />
          <Route path="/parent-login" element={<ParentLoginPage />} />

          {/* Auth: parent */}
          <Route path="/parent-dashboard" element={
            <PrivateRoute requiredRole="parent">
              <ParentDashboard />
            </PrivateRoute>
          } />

          {/* Auth: tutor */}
          <Route path="/tutor/sessions" element={
            <PrivateRoute requiredRole="tutor">
              <TutorSessionsPage />
            </PrivateRoute>
          } />
          <Route path="/tutor/earnings" element={
            <PrivateRoute requiredRole="tutor">
              <TutorEarningsPage />
            </PrivateRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>
    </>
  )
}
