import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from './supabaseClient'

export default function Login() {
  const [accountHash, setAccountHash] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [captcha, setCaptcha] = useState(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let newCaptcha = ''
    for (let i = 0; i < 6; i++) {
      newCaptcha += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return newCaptcha
  })

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let newCaptcha = ''
    for (let i = 0; i < 6; i++) {
      newCaptcha += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return newCaptcha
  }

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha())
    setUserInput('')
    setCaptchaVerified(false)
  }

  const verifyCaptcha = () => {
    if (userInput === captcha) {
      setCaptchaVerified(true)
      setError('')
    } else {
      setError('Incorrect captcha. Please try again.')
      refreshCaptcha()
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!accountHash.trim()) {
      setError('Please enter your account hash')
      return
    }

    if (accountHash.length !== 20) {
      setError('Account hash must be 20 characters long')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Check if account hash exists in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('account_hash', accountHash)
        .eq('is_active', true)
        .single()

      if (error) {
        setError('Login failed: ' + error.message)
      } else if (!data) {
        setError('Invalid account hash. Please check and try again.')
      } else {
        // Store login session
        sessionStorage.setItem('accountHash', accountHash)
        sessionStorage.setItem('userProfile', JSON.stringify(data))
        
        // Redirect to dashboard
        window.location.hash = '#/dashboard'
      }
    } catch (error) {
      setError('Login failed: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const goToRegister = () => {
    window.location.hash = '#/register'
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-800 relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-400 tracking-wider mb-2">SCANORA</h1>
          <p className="text-gray-400">Sign in with your account hash</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Captcha Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Verify Captcha</label>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gray-800 px-4 py-2 rounded border border-gray-700 font-mono text-lg select-none">
              {captcha}
            </div>
            <button
              onClick={refreshCaptcha}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              ↻
            </button>
          </div>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
            placeholder="Enter captcha code"
            disabled={captchaVerified}
          />
          {!captchaVerified && (
            <button
              onClick={verifyCaptcha}
              className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Verify Captcha
            </button>
          )}
        </div>

        {/* Hash Input Section */}
        {captchaVerified && (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Account Hash</label>
              <input
                type="text"
                value={accountHash}
                onChange={(e) => setAccountHash(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors font-mono"
                placeholder="Enter your 20-character account hash"
                maxLength={20}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg font-semibold transition duration-300 text-white"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account hash?{' '}
            <button
              onClick={goToRegister}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Generate one
            </button>
          </p>
        </div>

        <button
          onClick={() => window.location.hash = '#/'}
          className="mt-4 w-full py-2 text-gray-400 hover:text-white transition duration-300 text-sm"
        >
          ← Back to Home
        </button>
      </motion.div>
    </div>
  )
}
