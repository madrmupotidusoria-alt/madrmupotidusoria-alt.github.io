import React from "react";
import { motion } from "framer-motion";

export default function ScanoraLanding() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background Glow */}
      <motion.div
        className="absolute w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-6 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-2xl font-bold tracking-widest"
        >
          SCANORA
        </motion.h1>

        <div className="flex gap-8 text-sm">
          {[
            { label: 'Home', href: '#/' },
            { label: 'Register', href: '#/register' },
            { label: 'Login', href: '#/login' },
            { label: 'Roster', href: '#/roster' },
            { label: 'Features', href: '#/features' },
            { label: 'Pricing', href: '#/pricing' },
            { label: 'About', href: '#/about' },
            { label: 'Contact', href: '#/contact' },
          ].map((item, i) => (
            <motion.a key={i} href={item.href} whileHover={{ scale: 1.1 }} className="hover:text-blue-400 transition">
              {item.label}
            </motion.a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-32 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-5xl md:text-6xl font-bold max-w-4xl leading-tight"
        >
          Advanced Digital Intelligence Platform
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="mt-6 text-gray-400 max-w-2xl text-lg"
        >
          SCANORA represents the next generation of cyber intelligence tools, combining cutting-edge technology with intuitive design for maximum operational effectiveness.
        </motion.p>

        {/* Animated Button */}
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="mt-10 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30 transition">
          Get Started
        </motion.button>
      </div>
    </div>
  );
}
