import React, { useState, useEffect } from 'react';

export default function Roster() {
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const words = ['XTC', '911'];
    
    const interval = setInterval(() => {
      setDisplayText(words[wordIndex].slice(0, charIndex));
      
      const newCharIndex = charIndex + direction;
      setCharIndex(newCharIndex);
      
      if (newCharIndex > words[wordIndex].length + 4) {
        setDirection(-1);
      } else if (newCharIndex < 0) {
        setDirection(1);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [wordIndex, charIndex, direction]);

  const rosterMembers = [
    { name: 'mar', image: 'https://files.catbox.moe/gh4buy.png' },
    { name: 'tbny', image: 'https://files.catbox.moe/5pr9ud.png' },
    { name: 'qtn', image: 'https://files.catbox.moe/5ub2h4.png' },
    { name: 'shimmy', image: 'https://files.catbox.moe/0e4qso.png' }
  ];

  return (
    <div style={{
      margin: 0,
      padding: 0,
      width: '100%',
      height: '100vh',
      background: '#000',
      fontFamily: "'Nosifer', cursive",
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Animated stars background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '2px',
        height: '2px',
        background: '#b400ff',
        boxShadow: `
          50px 100px #b400ff,
          120px 300px #b400ff,
          400px 200px #b400ff,
          700px 500px #b400ff,
          900px 150px #b400ff,
          1100px 600px #b400ff,
          1400px 300px #b400ff,
          1600px 700px #b400ff
        `,
        animation: 'float 40s linear infinite',
        filter: 'drop-shadow(0 0 8px #b400ff)'
      }} />
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '2px',
        height: '2px',
        background: '#b400ff',
        boxShadow: `
          50px 100px #b400ff,
          120px 300px #b400ff,
          400px 200px #b400ff,
          700px 500px #b400ff,
          900px 150px #b400ff,
          1100px 600px #b400ff,
          1400px 300px #b400ff,
          1600px 700px #b400ff
        `,
        animation: 'float 40s linear infinite',
        filter: 'drop-shadow(0 0 8px #b400ff)',
        top: '2000px'
      }} />

      {/* Animated title */}
      <div style={{
        position: 'fixed',
        top: '36px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#b400ff',
        fontSize: '64px',
        letterSpacing: '6px',
        textShadow: '0 0 10px #6a00ff, 0 0 40px rgba(180, 0, 255, 0.8)',
        animation: 'flicker 3.5s infinite',
        zIndex: 10
      }}>
        {displayText}
      </div>

      {/* Roster section */}
      <div style={{
        position: 'relative',
        padding: '300px 40px 80px',
        color: '#b400ff',
        zIndex: 1
      }}>
        <h2 style={{
          textAlign: 'center',
          letterSpacing: '8px',
          textShadow: '0 0 20px rgba(180, 0, 255, 0.7)',
          marginBottom: '60px'
        }}>
          ROSTER
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '28px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {rosterMembers.map((member, index) => (
            <div key={index} style={{
              background: 'rgba(20, 0, 30, 0.7)',
              border: '1px solid rgba(180, 0, 255, 0.4)',
              padding: '22px',
              textAlign: 'center',
              boxShadow: '0 0 30px rgba(180, 0, 255, 0.6)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(180, 0, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(180, 0, 255, 0.6)';
            }}
            >
              <img 
                src={member.image} 
                alt={member.name}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(180, 0, 255, 0.9)',
                  marginBottom: '14px',
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              />
              <span style={{
                display: 'block',
                letterSpacing: '4px',
                fontSize: '18px'
              }}>
                {member.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes float {
          from { transform: translateY(0); }
          to { transform: translateY(-2000px); }
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          6% { opacity: 0.5; }
          8% { opacity: 1; }
          12% { opacity: 0.3; }
          15% { opacity: 1; }
        }

        @import url('https://fonts.googleapis.com/css2?family=Nosifer&display=swap');
      `}</style>
    </div>
  );
}
