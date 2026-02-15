import React from 'react'

export default function Pricing(){
  const plans = [
    { id: 'basic', title: 'Basic (Crypto)', price: '$20', period: 'month', desc: 'Monthly access paid in crypto.' },
    { id: 'premium', title: 'Premium', price: '$50', period: 'month', desc: 'Premium tools and priority support.' },
    { id: 'immortal', title: 'Immortal', price: '$100', period: 'month', desc: 'Immortal access — highest tier monthly.' },
    { id: 'lifetime', title: 'Lifetime', price: '$200', period: 'one-time', desc: 'One-time lifetime access.' }
  ]

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-white">Pricing</h1>
        <p className="text-gray-300 mt-3">Choose a plan that fits your operational needs. Payments supported via major cryptocurrencies for the crypto plan.</p>
      </header>

      <section className="max-w-6xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-4">
        {plans.map(p => (
          <div key={p.id} className="border border-gray-700 rounded-xl p-6 bg-gray-900/50 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-2 text-white">{p.title}</h3>
            <div className="text-3xl font-bold mb-2 text-white">{p.price}<span className="text-base font-medium text-gray-300">{p.period==='month' ? '/mo' : ''}</span></div>
            <p className="text-sm text-gray-300 mb-4">{p.desc}</p>
            <ul className="text-sm text-gray-200 mb-6 space-y-2">
              <li className="text-gray-200">- Secure access</li>
              <li className="text-gray-200">- Basic analytics</li>
              <li className="text-gray-200">- Community support</li>
            </ul>
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Subscribe</button>
              <button className="px-3 py-2 border border-gray-600 text-white rounded hover:bg-gray-800 transition-colors">Details</button>
            </div>
          </div>
        ))}
      </section>

      <footer className="max-w-4xl mx-auto text-center text-gray-400 mt-12">
        <p>Contact sales for invoices and bulk licensing — crypto payments accepted for the Basic plan.</p>
      </footer>
    </div>
  )
}
