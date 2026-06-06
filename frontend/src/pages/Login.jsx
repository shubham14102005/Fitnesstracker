import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendLoginOtp, verifyLoginOtp, requestPasswordReset, resetPassword, adminLogin } from '../api'

export default function Login({ activeUser, onLoginSuccess }) {
  const [mode, setMode] = useState('CREDENTIALS') // CREDENTIALS | OTP | FORGOT_REQ | FORGOT_RESET
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [validationError, setValidationError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  
  const [otpTimer, setOtpTimer] = useState(300) // 5 minutes in seconds
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (activeUser) {
      navigate('/')
    }
  }, [activeUser, navigate])

  // OTP Countdown timer
  useEffect(() => {
    let interval = null
    if (mode === 'OTP' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    } else if (otpTimer === 0) {
      setError('OTP has expired. Please request a new one.')
    }
    return () => clearInterval(interval)
  }, [mode, otpTimer])

  // Error handler to distinguish between network/system errors and bad credentials/parameters
  const handleApiError = (err, defaultMsg) => {
    console.error(err)
    if (!err.response) {
      setError('Unable to connect to the server. Please check your internet connection or ensure the backend server is running.')
      return
    }
    const status = err.response.status
    if (status >= 500) {
      setError('A system error occurred on the server. Please try again later or contact support.')
      return
    }
    
    // Parameter validation / authentication errors (4xx)
    const serverMessage = err.response.data?.message || (typeof err.response.data === 'string' ? err.response.data : null)
    setValidationError(serverMessage || defaultMsg)
  }

  // Form submit handlers
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setValidationError(null)
    setSuccessMessage(null)
    try {
      const res = await sendLoginOtp({ email, password })
      if (res.data.otpRequired === false) {
        // Direct login for admin
        onLoginSuccess(res.data.user)
        navigate('/')
      } else {
        // Requires OTP for trainers and users
        setOtpTimer(300) // reset timer to 5 minutes
        setMode('OTP')
      }
    } catch (err) {
      handleApiError(err, 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setValidationError(null)
    setSuccessMessage(null)
    try {
      const res = await adminLogin({ email, password })
      onLoginSuccess(res.data)
      navigate('/')
    } catch (err) {
      handleApiError(err, 'Invalid admin credentials or access denied.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otpTimer === 0) {
      setValidationError('OTP expired. Please go back and request a new one.')
      return
    }
    setLoading(true)
    setError(null)
    setValidationError(null)
    try {
      const res = await verifyLoginOtp({ email, otp })
      onLoginSuccess(res.data)
      navigate('/')
    } catch (err) {
      handleApiError(err, 'Invalid OTP verification code. Please check and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setValidationError(null)
    setSuccessMessage(null)
    try {
      await requestPasswordReset({ email })
      setSuccessMessage('Reset code sent. Please check your email or system console logs.')
      setMode('FORGOT_RESET')
    } catch (err) {
      handleApiError(err, 'Email not found or error generating reset code.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotReset = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setValidationError('Passwords do not match.')
      return
    }
    setLoading(true)
    setError(null)
    setValidationError(null)
    try {
      await resetPassword({ email, code: resetCode, newPassword })
      setSuccessMessage('Password reset successfully. Please sign in with your new password.')
      setMode('CREDENTIALS')
      setPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    } catch (err) {
      handleApiError(err, 'Invalid recovery code or reset failed.')
    } finally {
      setLoading(false)
    }
  }

  // Format timer into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full text-white animate-fadeIn">
      
      {/* Logo and Header */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl">💪</span>
          <span className="font-extrabold text-2xl uppercase tracking-wider text-white">
            FIT<span className="text-[#ed563b]">NEXUS</span>
          </span>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Corporate Wellness Portal
        </span>
      </div>

      {/* Dynamic Alerts */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-xs flex items-center gap-2 mb-6 animate-fadeIn">
          <span>⚠️</span>
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {validationError && (
        <div className="bg-orange-500/10 border border-[#ed563b]/30 text-[#ed563b] p-4 rounded-xl text-xs flex items-center gap-2 mb-6 animate-fadeIn">
          <span>ℹ️</span>
          <span className="font-semibold">{validationError}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl text-xs flex items-center gap-2 mb-6 animate-fadeIn">
          <span>✅</span>
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* ================================================== */}
      {/* MODE: CREDENTIALS */}
      {/* ================================================== */}
      {mode === 'CREDENTIALS' && (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div>
            <h2 className="text-xl font-black uppercase text-white">Sign In</h2>
            <p className="text-slate-400 text-xs mt-1">Enter your email and password to sign in.</p>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. srvaghani22@gmail.com"
              className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-[#ed563b] transition focus:outline-none cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 font-medium">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-[#ed563b] focus:ring-[#ed563b] bg-[#1e1e1e] border-white/10 cursor-pointer"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => { setMode('FORGOT_REQ'); setError(null); setSuccessMessage(null); }}
              className="text-[#ed563b] hover:text-[#ff684d] font-bold transition"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-black uppercase tracking-wider bg-[#ed563b] hover:bg-[#ff684d] text-white shadow-lg shadow-orange-950/20 transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="text-center pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={() => { setMode('ADMIN_CREDENTIALS'); setError(null); setSuccessMessage(null); }}
              className="text-xs font-black uppercase text-[#ed563b] hover:text-[#ff684d] tracking-wider transition"
            >
              Sign In as Administrator
            </button>
          </div>
        </form>
      )}

      {/* ================================================== */}
      {/* MODE: OTP */}
      {/* ================================================== */}
      {mode === 'OTP' && (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <h2 className="text-xl font-black uppercase text-white">Verification Code</h2>
            <p className="text-slate-400 text-xs mt-1">We sent a 6-digit OTP code to <strong className="text-slate-200">{email}</strong>.</p>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Enter 6-digit OTP
            </label>
            <input
              type="text"
              required
              maxLength="6"
              pattern="\d{6}"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="e.g. 123456"
              className="w-full glass-input rounded-xl px-4 py-3 text-center tracking-[0.7em] text-lg font-bold focus:outline-none"
            />
          </div>

          <div className="text-center text-xs">
            {otpTimer > 0 ? (
              <p className="text-slate-400 font-medium">
                Code expires in: <span className="text-[#ed563b] font-bold">{formatTime(otpTimer)}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-[#ed563b] hover:text-[#ff684d] font-bold underline transition"
              >
                Resend Verification OTP
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-black uppercase tracking-wider bg-[#ed563b] hover:bg-[#ff684d] text-white shadow-lg shadow-orange-950/20 transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Verifying...
              </>
            ) : (
              'Verify & Login'
            )}
          </button>

          <button
            type="button"
            onClick={() => { setMode('CREDENTIALS'); setError(null); setSuccessMessage(null); setOtp(''); }}
            className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-200 transition"
          >
            ← Back to Sign In
          </button>
        </form>
      )}

      {/* ================================================== */}
      {/* MODE: FORGOT_REQ */}
      {/* ================================================== */}
      {mode === 'FORGOT_REQ' && (
        <form onSubmit={handleForgotRequest} className="space-y-5">
          <div>
            <h2 className="text-xl font-black uppercase text-white">Password Recovery</h2>
            <p className="text-slate-400 text-xs mt-1">Enter your email address to receive a password reset verification code.</p>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. srvaghani22@gmail.com"
              className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-black uppercase tracking-wider bg-[#ed563b] hover:bg-[#ff684d] text-white shadow-lg shadow-orange-950/20 transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Sending Request...
              </>
            ) : (
              'Generate Reset Code'
            )}
          </button>

          <button
            type="button"
            onClick={() => { setMode('CREDENTIALS'); setError(null); setSuccessMessage(null); }}
            className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-200 transition"
          >
            ← Back to Sign In
          </button>
        </form>
      )}

      {/* ================================================== */}
      {/* MODE: FORGOT_RESET */}
      {/* ================================================== */}
      {mode === 'FORGOT_RESET' && (
        <form onSubmit={handleForgotReset} className="space-y-5">
          <div>
            <h2 className="text-xl font-black uppercase text-white">Set New Password</h2>
            <p className="text-slate-400 text-xs mt-1">Input the 6-digit recovery code and choose a new password.</p>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Recovery Code
            </label>
            <input
              type="text"
              required
              maxLength="6"
              pattern="\d{6}"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              placeholder="e.g. 123456"
              className="w-full glass-input rounded-xl px-4 py-3 text-center tracking-[0.4em] font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Must be at least 6 characters"
                className="w-full glass-input rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-[#ed563b] transition focus:outline-none cursor-pointer"
                title={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full glass-input rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-[#ed563b] transition focus:outline-none cursor-pointer"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-black uppercase tracking-wider bg-[#ed563b] hover:bg-[#ff684d] text-white shadow-lg shadow-orange-950/20 transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Resetting Password...
              </>
            ) : (
              'Update Password'
            )}
          </button>

          <button
            type="button"
            onClick={() => { setMode('CREDENTIALS'); setError(null); setSuccessMessage(null); }}
            className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-200 transition"
          >
            ← Cancel and Sign In
          </button>
        </form>
      )}

      {/* ================================================== */}
      {/* MODE: ADMIN_CREDENTIALS */}
      {/* ================================================== */}
      {mode === 'ADMIN_CREDENTIALS' && (
        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div>
            <h2 className="text-xl font-black uppercase text-white">Admin Sign In</h2>
            <p className="text-slate-400 text-xs mt-1">Enter your administrator credentials to sign in directly (No OTP required).</p>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Admin Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@fitness.com"
              className="w-full glass-input rounded-xl px-4 py-3 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass-input rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 hover:text-[#ed563b] transition focus:outline-none cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-black uppercase tracking-wider bg-[#ed563b] hover:bg-[#ff684d] text-white shadow-lg shadow-orange-950/20 transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                Signing in...
              </>
            ) : (
              'Secure Admin Sign In'
            )}
          </button>

          <button
            type="button"
            onClick={() => { setMode('CREDENTIALS'); setError(null); setSuccessMessage(null); }}
            className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-200 transition"
          >
            ← Back to User Sign In
          </button>
        </form>
      )}

    </div>
  )
}
