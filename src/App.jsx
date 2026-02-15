import React, { useEffect, useState } from 'react'
import ScanoraLanding from './ScanoraLanding'
import Pricing from './Pricing'

export default function App(){
  const [route, setRoute] = useState(() => (location.hash.replace('#','') || '/'))

  useEffect(() => {
    function onHash(){ setRoute(location.hash.replace('#','') || '/') }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if(route === '/pricing' || route === 'pricing') return <Pricing />
  return <ScanoraLanding />
}
