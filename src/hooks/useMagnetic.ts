"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const useMagnetic = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const btn = btnRef.current;
    if (!wrap || !btn) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      const x = (relX - rect.width / 2) * 0.15;
      const y = (relY - rect.height / 2) * 0.15;

      gsap.to(btn, {
        x: x,
        y: y,
        duration: 0.8,
        ease: "power3.out"
      });
    };

    const onMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 1.0,
        ease: "elastic.out(1, 0.4)"
      });
    };

    wrap.addEventListener('mousemove', onMouseMove);
    wrap.addEventListener('mouseleave', onMouseLeave);

    return () => {
      wrap.removeEventListener('mousemove', onMouseMove);
      wrap.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return { wrapRef, btnRef };
};
