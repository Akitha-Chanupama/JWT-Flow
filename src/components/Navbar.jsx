import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

const steps = [
  { id: 'step-1', label: '1' },
  { id: 'step-2', label: '2' },
  { id: 'step-3', label: '3' },
  { id: 'step-4', label: '4' },
  { id: 'step-5', label: '5' },
  { id: 'step-6', label: '6' },
  { id: 'step-7', label: '7' },
  { id: 'step-8', label: '8' },
];

export default function Navbar() {
  const [activeStep, setActiveStep] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveStep(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );

    steps.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#hero" className="navbar__logo" onClick={(e) => { e.preventDefault(); scrollTo('hero'); }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>JWT Flow</span>
        </a>

        <div className="navbar__steps">
          {steps.map(({ id, label }) => (
            <button
              key={id}
              className={`navbar__step${activeStep === id ? ' navbar__step--active' : ''}`}
              onClick={() => scrollTo(id)}
              aria-label={`Go to step ${label}`}
            >
              {label}
            </button>
          ))}
        </div>

        <ThemeToggle />
      </div>
    </nav>
  );
}
