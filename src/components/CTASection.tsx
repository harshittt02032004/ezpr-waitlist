"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mail } from 'lucide-react';
import { gsap } from 'gsap';
import { useMagnetic } from '@/hooks/useMagnetic';

const CTASection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { wrapRef, btnRef } = useMagnetic();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    gsap.to(btnRef.current, { scale: 0.94, duration: 0.12, yoyo: true, repeat: 1, ease: "power2.inOut" });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
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

      {!isSubmitted ? (
        <div id="form-cta-wrap" className="magnetic-wrap" ref={wrapRef}>
          <form className="ez-form cta" id="form-cta" onSubmit={handleSubmit}>
            <div className="magnetic-wrap">
              <button 
                type="submit" 
                className="ez-btn" 
                ref={btnRef}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Joining...' : 'Join the waitlist'}
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

      <p className="ez-cta-fine">No spam, ever. Unsubscribe anytime.</p>
    </section>
  );
};

export default CTASection;
