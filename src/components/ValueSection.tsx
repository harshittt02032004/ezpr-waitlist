"use client";

import React, { useEffect, useRef } from 'react';
import { HelpCircle, Orbit } from 'lucide-react';

const ValueSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="ez-value fade-in" id="value" ref={sectionRef}>
      <p className="ez-value-intro">
        Every year, thousands of Canada PR applications get refused - Not because people don’t qualify. But because of small, avoidable mistakes.
      </p>

      <h2 className="ez-h2">
        A better way<br />
        <span className="red">is coming soon.</span>
      </h2>

      <div className="ez-pain-grid">
        <div className="ez-pain-card">
          <div className="ez-pain-header">
            <HelpCircle className="ez-pain-icon" size={28} strokeWidth={1.5} />
            <span className="ez-pain-label"><span className="white">No more</span> confusion</span>
          </div>
        </div>
        <div className="ez-pain-card">
          <div className="ez-pain-header">
            <Orbit className="ez-pain-icon" size={28} strokeWidth={1.5} />
            <span className="ez-pain-label"><span className="white">No more</span> guesswork</span>
          </div>
        </div>
      </div>

      <div className="ez-value-body">
        <p style={{ marginBottom: "8px" }}>It will help you:</p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "32px", color: "rgba(255,255,255,0.65)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D52B1E" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg> 
            Spot possible mistakes early
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D52B1E" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg> 
            Move forward with more clarity
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D52B1E" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg> 
            Reduce uncertainty in your application
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueSection;
