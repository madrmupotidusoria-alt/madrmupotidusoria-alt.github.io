import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { supabase } from './supabaseClient.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session?.user);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session?.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavClick = (item) => {
    if (item === 'Discord') {
      window.open('https://discord.gg/xtce', '_blank');
      return;
    }

    if (item === 'Dashboard' && !isLoggedIn) {
      setShowLogin(true);
      return;
    }

    if (item === 'Login') {
      setShowLogin(true);
      setShowRegister(false);
      return;
    }

    if (item === 'Register') {
      setShowRegister(true);
      setShowLogin(false);
      return;
    }

    if (item === 'Pricing') {
      // Navigate to pricing page
      window.location.href = '/pricing.html';
      return;
    }

    setCurrentPage(item.toLowerCase());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email') || formData.get('username') + '@scanora.com';
    const password = formData.get('password');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        // Fallback to demo login for testing
        if (formData.get('username') === 'tbny' && password === 'admin123') {
          setIsLoggedIn(true);
          setShowLogin(false);
          setCurrentPage('dashboard');
          alert('Demo login successful!');
        } else {
          alert(error.message || 'Login failed');
        }
      } else {
        setIsLoggedIn(true);
        setShowLogin(false);
        setCurrentPage('dashboard');
      }
    } catch (error) {
      alert('Login error: ' + error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: formData.get('username'),
          }
        }
      });
      
      if (error) {
        alert(error.message || 'Registration failed');
      } else {
        setIsLoggedIn(true);
        setShowRegister(false);
        setCurrentPage('dashboard');
        alert('Registration successful! Please check your email to verify.');
      }
    } catch (error) {
      alert('Registration error: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('home');
  };

  const renderContent = () => {
    if (showLogin || showRegister) {
      return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          <div className="bg-black p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-800">
            {/* SCANORA Logo */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-400 tracking-wider">SCANORA</h1>
            </div>

            {/* Tabs */}
            <div className="flex mb-8 border-b border-gray-700">
              <button
                onClick={() => { setShowLogin(true); setShowRegister(false); }}
                className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                  showLogin 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => { setShowRegister(true); setShowLogin(false); }}
                className={`flex-1 pb-3 text-sm font-medium transition-colors ${
                  showRegister 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>

            {/* Login Form */}
            {showLogin && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    required
                  />
                </div>
                <div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email (optional)"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-300 text-white"
                >
                  Login
                </button>
              </form>
            )}

            {/* Register Form */}
            {showRegister && (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    required
                  />
                </div>
                <div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    required
                  />
                </div>
                <div>
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-300 text-white"
                >
                  Register
                </button>
              </form>
            )}

            {/* Back Button */}
            <button
              onClick={() => { setShowLogin(false); setShowRegister(false); }}
              className="mt-6 w-full py-2 text-gray-400 hover:text-white transition duration-300 text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      );
    }

    if (currentPage === 'dashboard' && isLoggedIn) {
      return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          <h2 className="text-4xl font-bold mb-8">SCANORA Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
            <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition duration-300">
              <h3 className="text-xl font-semibold mb-2">Username Recon</h3>
              <p className="text-gray-400">Search 500+ platforms</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition duration-300">
              <h3 className="text-xl font-semibold mb-2">Email Analysis</h3>
              <p className="text-gray-400">Breach data investigation</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition duration-300">
              <h3 className="text-xl font-semibold mb-2">IP Intelligence</h3>
              <p className="text-gray-400">Network mapping tools</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-8 px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition duration-300"
          >
            Logout
          </button>
        </div>
      );
    }

    return (
      <div className="relative z-10 flex flex-col items-center justify-center text-center mt-32 px-6">
        <h2 className="text-5xl md:text-6xl font-bold max-w-4xl leading-tight animate-fadeInUp">
          Advanced Digital Intelligence Platform
        </h2>
        <p className="mt-6 text-gray-400 max-w-2xl text-lg animate-fadeIn delay-200">
          SCANORA represents the next generation of cyber intelligence tools,
          combining cutting-edge technology with intuitive design for maximum
          operational effectiveness.
        </p>
        <button 
          onClick={() => setShowRegister(true)}
          className="mt-10 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30 transition duration-300 hover:scale-105 animate-fadeIn delay-500"
        >
          Get Started
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Gradient Center */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-black to-black"></div>

      {/* Floating Glow */}
      <div className="glow"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold tracking-widest">SCANORA</h1>

        <div className="flex gap-8 text-sm text-gray-300">
          {["Dashboard", "Register", "Login", "Roster", "Features", "Pricing", "About", "Discord"].map((item, i) => (
            <button
              key={i}
              onClick={() => handleNavClick(item)}
              className="hover:text-white transition duration-300 cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      {renderContent()}

      {/* Animations */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 1.2s ease forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 1.2s ease forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
