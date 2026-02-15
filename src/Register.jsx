import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from './supabaseClient'

export default function Register() {
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [accountHash, setAccountHash] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let captcha = ''
    for (let i = 0; i < 6; i++) {
      captcha += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return captcha
  }

  const [captcha, setCaptcha] = useState(generateCaptcha())
  const [userInput, setUserInput] = useState('')

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

  const generateAccountHash = async () => {
    setIsGenerating(true)
    setError('')
    setSuccess('')

    try {
      // Generate 20-character hash
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let hash = ''
      for (let i = 0; i < 20; i++) {
        hash += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      setAccountHash(hash)

      // Store in Supabase profiles table
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            account_hash: hash,
            created_at: new Date().toISOString(),
            is_active: true,
            subscription_type: 'free'
          }
        ])

      if (error) {
        setError('Failed to save account. Please try again.')
        console.error('Supabase error:', error)
      } else {
        setSuccess('Account hash generated successfully! Save this hash securely.')
      }
    } catch (error) {
      setError('Failed to generate account hash. Please try again.')
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accountHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const goToLogin = () => {
    window.location.hash = '#/login'
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
          <p className="text-gray-400">Generate Your Account Hash</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-300 text-sm">
            {success}
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

        {/* Hash Generation Section */}
        {captchaVerified && (
          <div className="space-y-4">
            <button
              onClick={generateAccountHash}
              disabled={isGenerating}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed rounded-lg font-semibold transition duration-300 text-white"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate Account Hash'
              )}
            </button>

            {accountHash && (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Account Hash</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={accountHash}
                    readOnly
                    className="flex-1 px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white font-mono text-lg"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {copied ? '✓' : 'Copy'}
                  </button>
                </div>
                <p className="mt-3 text-xs text-red-400">
                  ⚠️ Save this hash securely. You'll need it to login.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account hash?{' '}
            <button
              onClick={goToLogin}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Sign in
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
