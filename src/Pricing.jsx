import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient.js'

export default function Pricing(){
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session?.user);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const plans = [
    { id: 'basic', title: 'Basic (Crypto)', price: '$20', period: 'month', desc: 'Monthly access paid in crypto.', crypto: true },
    { id: 'premium', title: 'Premium', price: '$50', period: 'month', desc: 'Premium tools and priority support.', crypto: false },
    { id: 'immortal', title: 'Immortal', price: '$100', period: 'month', desc: 'Immortal access — highest tier monthly.', crypto: false },
    { id: 'lifetime', title: 'Lifetime', price: '$200', period: 'one-time', desc: 'One-time lifetime access.', crypto: false }
  ];

  const cryptoWallets = {
    BTC: 'bc1q50p9z8s5y43055ytghsuxvygm2j3rd3cf0m7k2',
    ETH: '0x5b27F2aA61c6a8A762668C45Bd499A495CFe22F5',
    LTC: 'LhCkxUXrk15qpw94z2uGADNDHNwnyAFSD2'
  };

  const handleSubscribe = (plan) => {
    if (!isLoggedIn) {
      alert('Please login to subscribe to a plan');
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    alert(`${type} wallet address copied to clipboard!`);
  };

  const PaymentModal = () => {
    if (!showPayment || !selectedPlan) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Complete Payment</h2>
          
          <div className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">{selectedPlan.title} Plan</h3>
            <p className="text-2xl font-bold text-blue-400">{selectedPlan.price}</p>
            <p className="text-sm text-gray-400">{selectedPlan.desc}</p>
          </div>

          {selectedPlan.crypto ? (
            <div className="space-y-4">
              <p className="text-center text-gray-300 mb-4">Pay with any of the following cryptocurrencies:</p>
              
              <div className="space-y-3">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-yellow-500">Bitcoin (BTC)</span>
                    <button
                      onClick={() => copyToClipboard(cryptoWallets.BTC, 'Bitcoin')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 font-mono break-all">{cryptoWallets.BTC}</p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-purple-500">Ethereum (ETH)</span>
                    <button
                      onClick={() => copyToClipboard(cryptoWallets.ETH, 'Ethereum')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 font-mono break-all">{cryptoWallets.ETH}</p>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-400">Litecoin (LTC)</span>
                    <button
                      onClick={() => copyToClipboard(cryptoWallets.LTC, 'Litecoin')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 font-mono break-all">{cryptoWallets.LTC}</p>
                </div>
              </div>

              <p className="text-sm text-gray-400 text-center mt-4">
                Send payment and contact support with transaction ID for activation
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-300 mb-4">For non-crypto plans, please contact sales</p>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                Contact Sales
              </button>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowPayment(false)}
              className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                alert('Payment instructions sent! Check your email.');
                setShowPayment(false);
              }}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
            >
              I've Paid
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <PaymentModal />
      
      <header className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold">Pricing</h1>
        <p className="text-gray-400 mt-3">
          Choose a plan that fits your operational needs. 
          {!isLoggedIn && <span className="text-yellow-500"> Please login to subscribe.</span>}
        </p>
      </header>

      <section className="max-w-6xl mx-auto grid gap-8 grid-cols-1 md:grid-cols-4">
        {plans.map(p => (
          <div key={p.id} className="border border-gray-800 rounded-xl p-6 bg-gray-900/30">
            <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
            <div className="text-3xl font-bold mb-2">
              {p.price}
              <span className="text-base font-medium">{p.period==='month' ? '/mo' : ''}</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">{p.desc}</p>
            <ul className="text-sm text-gray-300 mb-6 space-y-2">
              <li>- Secure access</li>
              <li>- Basic analytics</li>
              <li>- Community support</li>
              {p.crypto && <li>- Crypto payment accepted</li>}
            </ul>
            <div className="flex gap-3">
              <button 
                onClick={() => handleSubscribe(p)}
                className={`flex-1 px-4 py-2 rounded ${
                  isLoggedIn 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
                disabled={!isLoggedIn}
              >
                {isLoggedIn ? 'Subscribe' : 'Login Required'}
              </button>
              <button className="px-3 py-2 border border-gray-700 rounded hover:bg-gray-800">
                Details
              </button>
            </div>
          </div>
        ))}
      </section>

      <footer className="max-w-4xl mx-auto text-center text-gray-500 mt-12">
        <p>Contact sales for invoices and bulk licensing — crypto payments accepted for Basic plan.</p>
        {!isLoggedIn && (
          <p className="mt-2 text-yellow-500">
            <a href="/" className="underline hover:text-yellow-400">
              Click here to login or register
            </a>
          </p>
        )}
      </footer>
    </div>
  )
}
