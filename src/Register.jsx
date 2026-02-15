import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Register() {
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [accountHash, setAccountHash] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

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
      generateAccountHash()
    } else {
      alert('Incorrect captcha. Please try again.')
      refreshCaptcha()
    }
  }

  const generateAccountHash = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let hash = ''
      for (let i = 0; i < 20; i++) {
        hash += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      setAccountHash(hash)
      setIsGenerating(false)
    }, 2000)
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
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20"></div>
      <motion.div
        className="absolute w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl top-20 left-20"
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -30, 30, 0],
        }}
        transition={{
          duration: 10,
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
            Create Account
          </motion.h1>
          <p className="text-gray-400">Generate your secure account hash</p>
        </div>

        {!captchaVerified ? (
          <div className="space-y-6">
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
              disabled={userInput.length !== 6}
              className={`w-full py-3 rounded-lg font-medium transition ${
                userInput.length === 6
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Verify & Generate Hash
            </motion.button>
          </div>
        ) : (
          <div className="space-y-6">
            {isGenerating ? (
              <div className="text-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-400">Generating secure account hash...</p>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <div className="text-green-400 text-sm font-medium mb-3">✓ Account Created Successfully</div>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <label className="block text-sm font-medium mb-2">Your Account Hash</label>
                    <div className="font-mono text-lg text-blue-400 break-all mb-3">
                      {accountHash}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-sm"
                    >
                      {copied ? '✓ Copied!' : '📋 Copy Hash'}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
                  <h3 className="font-medium mb-2 text-blue-400">⚠️ Important</h3>
                  <p className="text-sm text-gray-300">
                    Save this account hash securely. You'll need it to login to your account. 
                    This hash cannot be recovered if lost.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goToLogin}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
                >
                  Go to Login
                </motion.button>
              </>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="#/" className="text-gray-400 hover:text-blue-400 transition text-sm">
            ← Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  )
}
