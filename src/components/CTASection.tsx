"use client";

import React, { useEffect, useRef } from 'react';
import { Mail } from 'lucide-react';
import { gsap } from 'gsap';
import { useMagnetic } from '@/hooks/useMagnetic';
import { useWaitlist } from './WaitlistProvider';

const CTASection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { wrapRef, btnRef } = useMagnetic();
  const { open } = useWaitlist();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    gsap.to(btnRef.current, { scale: 0.94, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" });
    open();
  };

  return (
    <section className="ez-cta fade-in" id="cta" ref={sectionRef}>
      <div className="ez-cta-icon">
        <Mail size={48} strokeWidth={1} color="rgba(255,255,255,0.65)" />
      </div>

      <h2 className="ez-cta-h2">
        Be among the first<br />
        <em>to get access</em>
      </h2>

      <div id="form-cta-wrap" className="magnetic-wrap" ref={wrapRef}>
        <form className="ez-form cta" id="form-cta" onSubmit={(e) => e.preventDefault()}>
          <div className="magnetic-wrap">
            <button
              type="button"
              className="ez-btn"
              ref={btnRef}
              onClick={handleClick}
            >
              Join the waitlist
            </button>
          </div>
        </form>
      </div>

      <p className="ez-cta-fine">No spam, ever. Unsubscribe anytime.</p>
    </section>
  );
};

export default CTASection;
