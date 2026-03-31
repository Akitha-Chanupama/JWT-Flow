import { useEffect, useRef } from 'react';

export default function Hero() {
  const orbsRef = useRef(null);

  const scrollToStart = () => {
    document.getElementById('step-1')?.scrollIntoView({ behavior: 'smooth' });
  };

  /* ── Mouse parallax on orbs ── */
  useEffect(() => {
    const handleMove = (e) => {
      if (!orbsRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      orbsRef.current.style.setProperty('--mx', `${x * 30}px`);
      orbsRef.current.style.setProperty('--my', `${y * 30}px`);
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <section id="hero" className="hero">
      {/* Dot grid background */}
      <div className="dot-grid" />

      {/* Animated background orbs with parallax */}
      <div className="hero__orbs" ref={orbsRef}>
        <div className="hero__orb hero__orb--1" />
        <div className="hero__orb hero__orb--2" />
        <div className="hero__orb hero__orb--3" />
      </div>

      <div className="hero__content">
        <div className="hero__badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Interactive Guide
        </div>

        <h1 className="hero__title">
          What Happens When You Click{' '}
          <span className="hero__highlight">Login</span>?
        </h1>

        <p className="hero__subtitle">
          A visual, step-by-step guide to understanding JWT Authentication — from clicking the button to secured API calls.
        </p>

        <div className="hero__actions">
          <button className="hero__cta" onClick={scrollToStart}>
            <span>Start the Journey</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <polyline points="19 12 12 19 5 12"/>
            </svg>
          </button>
          <span className="hero__steps-count">8 steps · 5 min read</span>
        </div>

        <div className="hero__scroll-hint">
          <div className="hero__mouse">
            <div className="hero__mouse-wheel" />
          </div>
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
