import React from "react";
import { motion } from "framer-motion";

export default function ScanoraLanding() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col overflow-hidden relative">
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
              { label: 'Home', href: '#/', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
              { label: 'Features', href: '#features', action: () => scrollToSection('features') },
              { label: 'Modules', href: '#modules', action: () => scrollToSection('modules') },
              { label: 'Records', href: '#records', action: () => scrollToSection('records') },
              { label: 'Register', href: '#/register' },
              { label: 'Login', href: '#/login' },
              { label: 'Roster', href: '#/roster' },
              { label: 'Pricing', href: '#/pricing' },
            ].map((item, i) => (
              <motion.a 
                key={i} 
                href={item.href} 
                onClick={(e) => {
                  if (item.action) {
                    e.preventDefault();
                    item.action();
                  }
                }}
                whileHover={{ scale: 1.1 }} 
                className="hover:text-blue-400 transition"
              >
                {item.label}
              </motion.a>
            ))}
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex flex-col items-center justify-center text-center px-6 mt-32 relative z-10 flex-grow">
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
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }} 
            className="mt-10 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30 transition"
            onClick={() => scrollToSection('features')}
          >
            Explore Features
          </motion.button>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-gray-400 text-sm"
            >
              Scroll to explore ↓
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen py-20 px-12 relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Powerful Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time Analysis",
                description: "Process and analyze data streams in real-time for immediate intelligence insights.",
                icon: "⚡"
              },
              {
                title: "Advanced Encryption",
                description: "Military-grade encryption ensures your data remains secure and confidential.",
                icon: "🔒"
              },
              {
                title: "AI-Powered Insights",
                description: "Leverage machine learning algorithms to uncover patterns and anomalies.",
                icon: "🤖"
              },
              {
                title: "Global Coverage",
                description: "Access intelligence data from across the globe with comprehensive coverage.",
                icon: "🌍"
              },
              {
                title: "Custom Dashboards",
                description: "Build personalized dashboards tailored to your specific operational needs.",
                icon: "📊"
              },
              {
                title: "API Integration",
                description: "Seamlessly integrate with existing systems through our robust API.",
                icon: "🔗"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-blue-600 transition-colors"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="min-h-screen py-20 px-12 relative bg-gray-950/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Intelligence Modules
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "SIGINT Module",
                description: "Signals Intelligence collection and analysis framework",
                capabilities: ["Radio Interception", "Signal Analysis", "Frequency Monitoring", "Decryption Tools"]
              },
              {
                title: "OSINT Module", 
                description: "Open Source Intelligence gathering and processing",
                capabilities: ["Social Media Monitoring", "Web Scraping", "Image Analysis", "Metadata Extraction"]
              },
              {
                title: "HUMINT Module",
                description: "Human Intelligence management and coordination",
                capabilities: ["Agent Management", "Source Validation", "Information Verification", "Secure Communications"]
              },
              {
                title: "CYBERINT Module",
                description: "Cyber Intelligence and threat detection systems",
                capabilities: ["Network Monitoring", "Threat Detection", "Vulnerability Assessment", "Incident Response"]
              }
            ].map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-900/70 border border-gray-800 rounded-xl p-8 hover:border-blue-600 transition-colors"
              >
                <h3 className="text-2xl font-bold mb-3 text-blue-400">{module.title}</h3>
                <p className="text-gray-300 mb-6">{module.description}</p>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Capabilities:</h4>
                  {module.capabilities.map((capability, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-300">{capability}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Records Section */}
      <section id="records" className="min-h-screen py-20 px-12 relative">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-center mb-16"
          >
            Intelligence Records
          </motion.h2>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: "Total Records", value: "2.5M+", change: "+12%" },
                { label: "Active Cases", value: "847", change: "+5%" },
                { label: "Success Rate", value: "94.2%", change: "+2.1%" },
                { label: "Response Time", value: "1.2s", change: "-0.3s" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-blue-400 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                  <div className={`text-xs ${stat.change.startsWith('+') ? 'text-green-400' : 'text-blue-400'}`}>
                    {stat.change}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Recent Intelligence Activities</h3>
              {[
                { time: "2 mins ago", activity: "New SIGINT intercept processed", status: "completed" },
                { time: "15 mins ago", activity: "OSINT report generated", status: "completed" },
                { time: "1 hour ago", activity: "Cyber threat detected and analyzed", status: "completed" },
                { time: "3 hours ago", activity: "HUMINT source verification", status: "in-progress" },
                { time: "5 hours ago", activity: "Network traffic analysis completed", status: "completed" }
              ].map((record, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${record.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <div>
                      <div className="text-white">{record.activity}</div>
                      <div className="text-sm text-gray-400">{record.time}</div>
                    </div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${record.status === 'completed' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                    {record.status === 'completed' ? 'Completed' : 'In Progress'}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
