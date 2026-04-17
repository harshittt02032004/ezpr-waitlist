"use client";

import React, { useEffect } from 'react';
import Lenis from 'lenis';

const SmoothScroll: React.FC = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Global Lenis instance for access in other components if needed
    (window as any).lenis = lenis;

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;
