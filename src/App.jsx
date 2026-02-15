import React, { useEffect, useState } from 'react'
import ScanoraLanding from './ScanoraLanding'
import Pricing from './Pricing'
import Register from './Register'
import Login from './Login'
import Dashboard from './Dashboard'

export default function App(){
  const [route, setRoute] = useState(() => (location.hash.replace('#','') || '/'))

  useEffect(() => {
    function onHash(){ setRoute(location.hash.replace('#','') || '/') }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Route handling
  if(route === '/pricing' || route === 'pricing') return <Pricing />
  if(route === '/register' || route === 'register') return <Register />
  if(route === '/login' || route === 'login') return <Login />
  if(route === '/dashboard' || route === 'dashboard') return <Dashboard />
  
  return <ScanoraLanding />
}
