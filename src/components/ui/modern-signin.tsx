'use client'

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export default function ModernSignIn() {
  const navigate = useNavigate()
  const { signInWithEmail, signUpWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    setError('')

    try {
      if (isSignUp) {
        const { error: signUpError } = await signUpWithEmail(email, password, email.split('@')[0], 'student')
        if (signUpError) {
          setError(signUpError.message || 'Sign up failed')
        } else {
          navigate('/')
        }
      } else {
        const { error: signInError } = await signInWithEmail(email, password)
        if (signInError) {
          setError(signInError.message || 'Sign in failed')
        } else {
          navigate('/')
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-apex-plum/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-apex-ember/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Apex Minds</h1>
          <p className="text-gray-300">Elite AP Tutoring & Consulting</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-apex-plum/50 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-apex-plum/50 transition"
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-400 bg-red-500/10 p-2 rounded">{error}</div>}
        </div>

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="w-full bg-gradient-to-r from-apex-plum to-apex-plum-vivid text-white font-semibold py-2.5 rounded-lg hover:shadow-lg hover:shadow-apex-plum/30 transition mb-4 disabled:opacity-50"
        >
          {loading ? 'Loading...' : isSignUp ? 'Sign up' : 'Sign in'}
        </button>

        <div className="text-center text-sm">
          <span className="text-gray-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white hover:underline font-medium"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-12 text-center">
        <p className="text-gray-400 text-sm">
          Join <span className="text-white font-medium">hundreds</span> of students
          <br />
          mastering AP exams with Apex Minds
        </p>
      </div>
    </div>
  )
}
