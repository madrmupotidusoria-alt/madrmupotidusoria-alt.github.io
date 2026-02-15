import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [accountHash, setAccountHash] = useState('')
  const [logoutModal, setLogoutModal] = useState(false)

  useEffect(() => {
    const hash = sessionStorage.getItem('accountHash')
    const isLoggedIn = sessionStorage.getItem('isLoggedIn')
    
    if (!hash || !isLoggedIn) {
      window.location.hash = '#/login'
      return
    }
    
    setAccountHash(hash)
  }, [])

  const handleLogout = () => {
    sessionStorage.removeItem('accountHash')
    sessionStorage.removeItem('isLoggedIn')
    window.location.hash = '#/'
  }

  const goToPricing = () => {
    window.location.hash = '#/pricing'
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
              <span className="ml-2 font-mono text-blue-400">{accountHash.slice(0, 8)}...{accountHash.slice(-4)}</span>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h2>
          <p className="text-gray-400 mb-8">Manage your intelligence operations and access platform features</p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Active Operations', value: '12', change: '+3', color: 'blue' },
              { label: 'Data Processed', value: '2.4TB', change: '+15%', color: 'green' },
              { label: 'Success Rate', value: '98.5%', change: '+2.1%', color: 'purple' },
              { label: 'Threats Detected', value: '47', change: '+12', color: 'red' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-${stat.color}-600/50 transition`}
              >
                <div className={`text-2xl font-bold text-${stat.color}-400 mb-1`}>{stat.value}</div>
                <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                <div className="text-xs text-green-400">{stat.change}</div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-800/50 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-3 text-blue-400">🚀 Quick Start</h3>
              <p className="text-gray-300 mb-4">Launch a new intelligence operation</p>
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                New Operation
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border border-purple-800/50 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-3 text-purple-400">📊 Analytics</h3>
              <p className="text-gray-300 mb-4">View detailed performance metrics</p>
              <button className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
                View Analytics
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-800/50 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-3 text-green-400">💎 Upgrade Plan</h3>
              <p className="text-gray-300 mb-4">Access premium features and tools</p>
              <button 
                onClick={goToPricing}
                className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
              >
                View Plans
              </button>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { time: '10 mins ago', activity: 'SIGINT intercept processed', status: 'success' },
                { time: '1 hour ago', activity: 'OSINT report generated', status: 'success' },
                { time: '3 hours ago', activity: 'Threat analysis completed', status: 'success' },
                { time: '5 hours ago', activity: 'System maintenance performed', status: 'info' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <div className="text-white">{activity.activity}</div>
                      <div className="text-sm text-gray-400">{activity.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Logout Modal */}
      {logoutModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Confirm Logout</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to logout from your account?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setLogoutModal(false)}
                className="flex-1 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
