"use client";

import React, { useState } from 'react';
import { gsap } from 'gsap';
import { useMagnetic } from '@/hooks/useMagnetic';

const Hero: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { wrapRef, btnRef } = useMagnetic();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Replicate original animation
    gsap.to(btnRef.current, { scale: 0.94, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
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

      {!isSubmitted ? (
        <div id="form-hero-wrap" className="magnetic-wrap" ref={wrapRef}>
          <form className="ez-form" id="form-hero" onSubmit={handleSubmit}>
            <div className="magnetic-wrap">
              <button 
                type="submit" 
                className="ez-btn" 
                ref={btnRef}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Joining...' : 'Join The Waitlist'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="ez-success" style={{ marginTop: "20px" }}>
          <span className="ez-success-title">You're on the list.</span>
          <span className="ez-success-sub">We'll reach out when it's your turn.</span>
        </div>
      )}

      <p className="ez-microcopy">No credit card required. No Commitment.</p>
    </section>
  );
};

export default Hero;
