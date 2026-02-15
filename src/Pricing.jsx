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

      <section className="max-w-6xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-4">
        <div className="border border-gray-700 rounded-xl p-6 bg-gray-900/50">
          <h3 className="text-xl font-semibold mb-2">Basic (Crypto)</h3>
          <div className="text-3xl font-bold mb-2">$20/mo</div>
          <p className="text-sm text-gray-300 mb-4">Monthly access paid in crypto.</p>
          <button className="w-full px-4 py-2 bg-blue-600 rounded">Subscribe</button>
        </div>

        <div className="border border-gray-700 rounded-xl p-6 bg-gray-900/50">
          <h3 className="text-xl font-semibold mb-2">Premium</h3>
          <div className="text-3xl font-bold mb-2">$50/mo</div>
          <p className="text-sm text-gray-300 mb-4">Premium tools and priority support.</p>
          <button className="w-full px-4 py-2 bg-blue-600 rounded">Subscribe</button>
        </div>

        <div className="border border-gray-700 rounded-xl p-6 bg-gray-900/50">
          <h3 className="text-xl font-semibold mb-2">Immortal</h3>
          <div className="text-3xl font-bold mb-2">$100/mo</div>
          <p className="text-sm text-gray-300 mb-4">Highest tier monthly access.</p>
          <button className="w-full px-4 py-2 bg-blue-600 rounded">Subscribe</button>
        </div>

        <div className="border border-gray-700 rounded-xl p-6 bg-gray-900/50">
          <h3 className="text-xl font-semibold mb-2">Lifetime</h3>
          <div className="text-3xl font-bold mb-2">$200</div>
          <p className="text-sm text-gray-300 mb-4">One-time lifetime access.</p>
          <button className="w-full px-4 py-2 bg-blue-600 rounded">Subscribe</button>
        </div>
      </section>
    </div>
  )
}
