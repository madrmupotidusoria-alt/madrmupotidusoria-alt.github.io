import React, { useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

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

    setCurrentPage(item.toLowerCase());
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowLogin(false);
    setCurrentPage('dashboard');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setShowRegister(false);
    setCurrentPage('dashboard');
  };

  const renderContent = () => {
    if (showLogin) {
      return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          <div className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-md w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">Login to SCANORA</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-300"
              >
                Login
              </button>
            </form>
            <button
              onClick={() => setShowLogin(false)}
              className="mt-4 w-full py-2 text-gray-400 hover:text-white transition duration-300"
            >
              Back
            </button>
          </div>
        </div>
      );
    }

    if (showRegister) {
      return (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          <div className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-md w-full">
            <h2 className="text-3xl font-bold mb-6 text-center">Register for SCANORA</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-300"
              >
                Register
              </button>
            </form>
            <button
              onClick={() => setShowRegister(false)}
              className="mt-4 w-full py-2 text-gray-400 hover:text-white transition duration-300"
            >
              Back
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
            onClick={() => setIsLoggedIn(false)}
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
          {["Dashboard", "Register", "Login", "Roster", "Features", "About", "Discord"].map((item, i) => (
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
