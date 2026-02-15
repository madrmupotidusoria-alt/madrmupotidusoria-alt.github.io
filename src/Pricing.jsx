import React from 'react'

export default function Pricing() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <header className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold">Pricing</h1>
        <p className="text-gray-300 mt-3">
          Choose a plan that fits your operational needs.
        </p>
      </header>

      <section className="max-w-6xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="border border-gray-700 rounded-xl p-6 bg-gray-900/50 hover:border-blue-500 transition-colors">
          <h3 className="text-xl font-semibold mb-2">Monthly</h3>
          <div className="text-3xl font-bold mb-2">$5/mo</div>
          <p className="text-sm text-gray-300 mb-4">Full monthly access to all tools.</p>
          <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">Subscribe</button>
        </div>

        <div className="border border-gray-700 rounded-xl p-6 bg-gray-900/50 hover:border-blue-500 transition-colors">
          <h3 className="text-xl font-semibold mb-2">Permanent</h3>
          <div className="text-3xl font-bold mb-2">$15</div>
          <p className="text-sm text-gray-300 mb-4">One-time permanent access.</p>
          <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">Subscribe</button>
        </div>

        <div className="border border-gray-700 rounded-xl p-6 bg-gray-900/50 hover:border-blue-500 transition-colors">
          <h3 className="text-xl font-semibold mb-2">Lifetime</h3>
          <div className="text-3xl font-bold mb-2">$100</div>
          <p className="text-sm text-gray-300 mb-4">Lifetime access with priority support.</p>
          <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">Subscribe</button>
        </div>

        <div className="border border-purple-600 rounded-xl p-6 bg-purple-900/30 hover:border-purple-500 transition-colors">
          <h3 className="text-xl font-semibold mb-2 text-purple-400">Roster Access</h3>
          <div className="text-3xl font-bold mb-2 text-purple-400">$50</div>
          <p className="text-sm text-gray-300 mb-4">Get featured on the SCANORA roster.</p>
          <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors">Join Roster</button>
        </div>
      </section>
    </div>
  )
}
