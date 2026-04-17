"use client";

import React, { useEffect, useRef } from 'react';

const Particles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create particles
    const createParticle = () => {
      const p = document.createElement('div');
      p.className = 'particle';
      
      const size = Math.random() * 2 + 1;
      const left = Math.random() * 100;
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;
      const rot = Math.random() * 360;
      const sway = (Math.random() - 0.5) * 100;
      
      p.style.setProperty('--rot', `${rot}deg`);
      p.style.setProperty('--sway', `${sway}px`);
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${left}%`;
      p.style.background = 'rgba(255,255,255,0.3)';
      p.style.borderRadius = '50%';
      p.style.boxShadow = '0 0 10px rgba(255,255,255,0.2)';
      p.style.animation = `particleDrift ${duration}s linear ${delay}s infinite`;
      
      containerRef.current?.appendChild(p);
      
      // Remove after one cycle if needed, but here it's infinite animation.
    };

    for (let i = 0; i < 40; i++) {
      createParticle();
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div id="particles" ref={containerRef} aria-hidden="true" />;
};

export default Particles;
