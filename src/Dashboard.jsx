import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from './supabaseClient'

export default function Dashboard() {
  const [accountHash, setAccountHash] = useState('')
  const [userProfile, setUserProfile] = useState(null)
  const [logoutModal, setLogoutModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hash = sessionStorage.getItem('accountHash')
    const profile = sessionStorage.getItem('userProfile')
    
    if (!hash) {
      window.location.hash = '#/login'
      return
    }
    
    setAccountHash(hash)
    
    // Load user profile from session storage or fetch from Supabase
    if (profile) {
      setUserProfile(JSON.parse(profile))
      setLoading(false)
    } else {
      fetchUserProfile(hash)
    }
  }, [])

  const fetchUserProfile = async (hash) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('account_hash', hash)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Profile fetch error:', error)
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          await createProfile(hash)
        }
      } else if (data) {
        setUserProfile(data)
        sessionStorage.setItem('userProfile', JSON.stringify(data))
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProfile = async (hash) => {
    try {
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
        .select()
        .single()

      if (error) {
        console.error('Profile creation error:', error)
      } else if (data) {
        setUserProfile(data)
        sessionStorage.setItem('userProfile', JSON.stringify(data))
      }
    } catch (error) {
      console.error('Profile creation error:', error)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('accountHash')
    sessionStorage.removeItem('userProfile')
    window.location.hash = '#/'
  }

  const goToPricing = () => {
    window.location.hash = '#/pricing'
  }

  const goToRoster = () => {
    window.location.hash = '#/roster'
  }

  const formatAccountHash = (hash) => {
    if (!hash) return '...'
    return `${hash.slice(0, 8)}...${hash.slice(-4)}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-400">SCANORA</h1>
            <div className="text-sm text-gray-400">
              Dashboard
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-sm">
              <span className="text-gray-400">Account:</span>
              <span className="ml-2 font-mono text-blue-400">{formatAccountHash(accountHash)}</span>
            </div>
            <button
              onClick={() => setLogoutModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome to SCANORA</h2>
          <p className="text-gray-400">
            Account Hash: <span className="font-mono text-blue-400">{accountHash}</span>
          </p>
          {userProfile && (
            <p className="text-gray-400 text-sm mt-1">
              Member since: {formatDate(userProfile.created_at)}
            </p>
          )}
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gray-900 p-6 rounded-xl border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-2">Account Status</h3>
            <p className="text-2xl font-bold text-green-400">Active</p>
            <p className="text-gray-400 text-sm mt-1">All systems operational</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gray-900 p-6 rounded-xl border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-2">Subscription</h3>
            <p className="text-2xl font-bold text-blue-400 capitalize">
              {userProfile?.subscription_type || 'Free'}
            </p>
            <p className="text-gray-400 text-sm mt-1">Current plan</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-gray-900 p-6 rounded-xl border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-2">API Calls</h3>
            <p className="text-2xl font-bold text-purple-400">0</p>
            <p className="text-gray-400 text-sm mt-1">This month</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-gray-900 p-6 rounded-xl border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-2">Security</h3>
            <p className="text-2xl font-bold text-green-400">Secure</p>
            <p className="text-gray-400 text-sm mt-1">Hash-based auth</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={goToPricing}
              className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-blue-500 transition-all text-left group"
            >
              <h4 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                Upgrade Plan
              </h4>
              <p className="text-gray-400 text-sm">
                Unlock premium features and get roster access
              </p>
            </button>

            <button
              onClick={goToRoster}
              className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-purple-500 transition-all text-left group"
            >
              <h4 className="text-lg font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                View Roster
              </h4>
              <p className="text-gray-400 text-sm">
                See the SCANORA team members
              </p>
            </button>

            <button className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-green-500 transition-all text-left group">
              <h4 className="text-lg font-semibold mb-2 group-hover:text-green-400 transition-colors">
                API Documentation
              </h4>
              <p className="text-gray-400 text-sm">
                Learn how to integrate SCANORA tools
              </p>
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-800">
                <div>
                  <p className="font-medium">Account Created</p>
                  <p className="text-sm text-gray-400">
                    {userProfile ? formatDate(userProfile.created_at) : 'Loading...'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-900/50 text-green-400 rounded-full text-sm">
                  Success
                </span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Dashboard Access</p>
                  <p className="text-sm text-gray-400">Logged in successfully</p>
                </div>
                <span className="px-3 py-1 bg-blue-900/50 text-blue-400 rounded-full text-sm">
                  Active
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Logout Modal */}
      {logoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 p-8 rounded-2xl border border-gray-800 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold mb-4">Confirm Logout</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to logout? You'll need your account hash to sign back in.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Logout
              </button>
              <button
                onClick={() => setLogoutModal(false)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
