'use client';

import { useState } from 'react';

export default function Home() {
  const [isHovering, setIsHovering] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    setRotation(angle);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-16">
      <div className="text-4xl font-bold text-white">meow</div>
      
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        className="relative group cursor-pointer"
      >
        {/* Animated glow */}
        <div
          className={`absolute inset-0 rounded-full blur-3xl transition-all duration-300 ${
            isHovering ? 'opacity-100' : 'opacity-50'
          }`}
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(147,51,234,0.3) 100%)',
          }}
        ></div>

        {/* Cat image */}
        <img
          src="https://media1.tenor.com/m/BFv6MHd3tmsAAAAd/sleepy-sleepycat.gif"
          alt="sleepy cat"
          className={`relative w-80 h-80 object-cover rounded-3xl shadow-2xl transition-all duration-300 ${
            isHovering ? 'scale-110 shadow-blue-500/50' : 'scale-100'
          }`}
        />
      </div>
    </div>
  );
}
