import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { authAPI } from '../api/api'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Email not found. Please register again.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await authAPI.verifyEmail({ email, code })
      setSuccess('Email verified! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please check the code.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setResendLoading(true)
    try {
      await authAPI.resendCode({ email })
      setSuccess('New code sent! Check your email.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code.')
    } finally {
      setResendLoading(false)
    }
  }

  if (!email) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-stone-200 text-center">
          <p className="text-stone-600 mb-4">No email found. Please register first.</p>
          <Link to="/register" className="text-teal-600 hover:text-teal-500 font-medium">
            Go to Register
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-stone-200">
        <h1 className="text-2xl font-bold text-stone-800 mb-2">Verify your email</h1>
        <p className="text-stone-600 text-sm mb-6">
          We sent a 6-digit code to <strong>{email}</strong>. Enter it below.
        </p>
        <form onSubmit={handleVerify} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
          )}
          {success && (
            <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm">{success}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Verification code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                setError('')
              }}
              maxLength={6}
              placeholder="000000"
              required
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-center text-xl tracking-[0.5em]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <p className="mt-4 text-center text-stone-600 text-sm">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading}
            className="text-teal-600 hover:text-teal-500 font-medium disabled:opacity-50"
          >
            {resendLoading ? 'Sending...' : 'Resend'}
          </button>
        </p>
      </div>
    </div>
  )
}
