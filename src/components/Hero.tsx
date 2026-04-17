"use client";

import React from 'react';
import { gsap } from 'gsap';
import { useMagnetic } from '@/hooks/useMagnetic';
import { useWaitlist } from './WaitlistProvider';

const Hero: React.FC = () => {
  const { wrapRef, btnRef } = useMagnetic();
  const { open } = useWaitlist();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    gsap.to(btnRef.current, { scale: 0.94, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" });
    open();
  };

  return (
    <section className="ez-hero fade-in visible" id="hero">
      <div className="ez-eyebrow">
        <span className="ez-eyebrow-line"></span>
        <span className="ez-eyebrow-text">Limited access</span>
        <span className="ez-eyebrow-line"></span>
      </div>

      <h1 className="ez-h1" style={{ marginBottom: "24px" }}>
        Permanent Residency,<br />
        <span className="red">Made Simple.</span>
      </h1>
      <p className="ez-hero-secondary">AI-Powered. RCIC-Built.</p>

      <div id="form-hero-wrap" className="magnetic-wrap" ref={wrapRef}>
        <form className="ez-form" id="form-hero" onSubmit={(e) => e.preventDefault()}>
          <div className="magnetic-wrap">
            <button
              type="button"
              className="ez-btn"
              ref={btnRef}
              onClick={handleClick}
            >
              Join The Waitlist
            </button>
          </div>
        </form>
      </div>

      <p className="ez-microcopy">No credit card required. No Commitment.</p>
    </section>
  );
};

export default Hero;
