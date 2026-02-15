import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from './supabaseClient'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!email.trim() || !password.trim() || !username.trim()) {
      setError('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          }
        }
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess('Registration successful! Please check your email to verify your account.')
        // Redirect to login after 3 seconds
        setTimeout(() => {
          window.location.hash = '#/login'
        }, 3000)
      }
    } catch (error) {
      setError('Registration failed: ' + error.message)
    } finally {
      setIsLoading(false)
    }
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
          <p className="text-gray-400">Create your account</p>
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

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
              placeholder="Create a password"
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
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
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
