import React, { useEffect, useState } from 'react'
import ScanoraLanding from './ScanoraLanding'
import Pricing from './Pricing'
import Register from './Register'
import Login from './Login'
import Dashboard from './Dashboard'

export default function App(){
  const [route, setRoute] = useState(() => (location.hash.replace('#','') || '/'))
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check authentication state on mount and route change
    const checkAuth = () => {
      const accountHash = sessionStorage.getItem('accountHash')
      setIsLoggedIn(!!accountHash)
    }

    checkAuth()

    function onHash(){ 
      const newRoute = location.hash.replace('#','') || '/'
      setRoute(newRoute)
      checkAuth()
    }
    
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Route handling with authentication checks
  if(route === '/pricing' || route === 'pricing') return <Pricing />
  if(route === '/register' || route === 'register') return <Register />
  if(route === '/login' || route === 'login') {
    // If already logged in, redirect to dashboard
    if(isLoggedIn) {
      window.location.hash = '#/dashboard'
      return null
    }
    return <Login />
  }
  if(route === '/dashboard' || route === 'dashboard') {
    // If not logged in, redirect to login
    if(!isLoggedIn) {
      window.location.hash = '#/login'
      return null
    }
    return <Dashboard />
  }
  
  // Default route - show landing or dashboard based on auth state
  if(isLoggedIn) {
    return <Dashboard />
  }
  
  return <ScanoraLanding />
}
