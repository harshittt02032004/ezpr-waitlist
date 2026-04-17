"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`ez-header ${isScrolled ? 'scrolled' : ''}`}>
      <a href="#" className="ez-logo-link" aria-label="EZPR Home">
        <Image 
          src="/images/ezpr_logo_png.png" 
          alt="EZPR — Permanent Residency" 
          width={320} 
          height={320} 
          className="ez-logo-img"
          priority
        />
      </a>
      <span className="ez-coming-soon">Coming soon</span>
    </header>
  );
};

export default Header;
