import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Login() {
  const [accountHash, setAccountHash] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
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

  const handleLogin = async () => {
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

    // Simulate authentication process
    setTimeout(() => {
      // In a real app, this would validate against a backend
      // For demo purposes, we'll accept any 20-character hash
      setIsLoading(false)
      setIsLoggedIn(true)
      
      // Store session
      sessionStorage.setItem('accountHash', accountHash)
      sessionStorage.setItem('isLoggedIn', 'true')
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.hash = '#/dashboard'
      }, 2000)
    }, 1500)
  }

  const goToRegister = () => {
    window.location.hash = '#/register'
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 to-blue-900/20"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center relative z-10"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Login Successful!</h2>
          <p className="text-gray-400">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
      <motion.div
        className="absolute w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl bottom-20 right-20"
        animate={{
          x: [0, -50, 50, 0],
          y: [0, 30, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm relative z-10"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-2"
          >
            Welcome Back
          </motion.h1>
          <p className="text-gray-400">Verify and enter your account hash to login</p>
        </div>

        <div className="space-y-6">
          {/* Captcha Section */}
          <div>
            <label className="block text-sm font-medium mb-3">Verify you're human</label>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
              <div className="text-2xl font-mono tracking-widest text-blue-400 mb-3 select-none">
                {captcha}
              </div>
              <button
                onClick={refreshCaptcha}
                className="text-sm text-gray-400 hover:text-white transition"
              >
                🔄 Refresh captcha
              </button>
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Enter captcha code"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition"
              maxLength={6}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={verifyCaptcha}
            disabled={userInput.length !== 6 || captchaVerified}
            className={`w-full py-3 rounded-lg font-medium transition ${
              userInput.length === 6 && !captchaVerified
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {captchaVerified ? '✓ Verified' : 'Verify Captcha'}
          </motion.button>

          {/* Account Hash Section - Only shown after captcha verification */}
          {captchaVerified && (
            <>
              <div className="border-t border-gray-700 pt-6">
                <label className="block text-sm font-medium mb-2">Account Hash</label>
                <input
                  type="text"
                  placeholder="Enter your 20-character account hash"
                  value={accountHash}
                  onChange={(e) => {
                    setAccountHash(e.target.value.toUpperCase())
                    setError('')
                  }}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition font-mono"
                  maxLength={20}
                />
                <div className="mt-2 text-xs text-gray-400">
                  {accountHash.length}/20 characters
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/20 border border-red-800/50 rounded-lg p-3 text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                disabled={isLoading || accountHash.length !== 20}
                className={`w-full py-3 rounded-lg font-medium transition ${
                  !isLoading && accountHash.length === 20
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Authenticating...
                  </div>
                ) : (
                  'Login to Dashboard'
                )}
              </motion.button>
            </>
          )}
        </div>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <a href="#/register" className="text-blue-400 hover:text-blue-300 transition text-sm">
              Don't have an account? Register here
            </a>
          </div>
          <div className="text-center">
            <a href="#/" className="text-gray-400 hover:text-blue-400 transition text-sm">
              ← Back to Home
            </a>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
          <h3 className="font-medium mb-2 text-blue-400 text-sm">🔐 Security Notice</h3>
          <p className="text-xs text-gray-300">
            Your account hash is your unique identifier. Keep it secure and never share it with others.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
