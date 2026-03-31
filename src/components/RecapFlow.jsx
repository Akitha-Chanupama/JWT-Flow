import { useState } from 'react';

export default function RecapFlow() {
  const steps = [
    { num: '1', icon: '👤', title: 'Enter Credentials', desc: 'The user types their email and password into the login form and clicks Login.' },
    { num: '2', icon: '📤', title: 'Send Request', desc: 'The browser sends a POST request to the server with the credentials as JSON.' },
    { num: '3', icon: '🔍', title: 'Validate Credentials', desc: 'The server checks the database and verifies the password hash matches.' },
    { num: '4', icon: '🔑', title: 'Generate JWT', desc: 'A JSON Web Token is created with Header, Payload, and Signature parts.' },
    { num: '5', icon: '📥', title: 'Return Token', desc: 'The server responds with the JWT token. The client is now authenticated.' },
    { num: '6', icon: '💾', title: 'Store Token', desc: 'The client stores the token in localStorage, sessionStorage, or an HttpOnly cookie.' },
    { num: '7', icon: '🔓', title: 'Auth Requests', desc: 'Every API request includes the token in the Authorization header for verification.' },
    { num: '8', icon: '⏱', title: 'Expiry & Refresh', desc: 'Tokens expire for security. Refresh tokens can issue new access tokens without re-login.' },
  ];

  const [active, setActive] = useState(0);

  return (
    <div className="recap">
      <h2 className="recap__title">
        The Complete <span className="text-gradient">JWT Flow</span>
      </h2>
      <p className="recap__subtitle">Click any step to explore · use the arrows to navigate</p>

      {/* ── Node strip ── */}
      <div className="recap__flow">
        {steps.map((step, i) => (
          <div key={step.num} className="recap__item">
            <button
              className={`recap__node ${active === i ? 'recap__node--active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Step ${step.num}: ${step.title}`}
            >
              <span className="recap__icon">{step.icon}</span>
              <span className="recap__num">{step.num}</span>
            </button>
            {i < steps.length - 1 && (
              <div className="recap__connector">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Detail card ── */}
      <div className="recap__detail" key={active}>
        <span className="recap__detail-step">Step {steps[active].num}</span>
        <h3 className="recap__detail-title">{steps[active].title}</h3>
        <p className="recap__detail-desc">{steps[active].desc}</p>
        <div className="recap__detail-nav">
          <button
            className="recap__detail-btn"
            onClick={() => setActive(Math.max(0, active - 1))}
            disabled={active === 0}
          >
            ← Previous
          </button>
          <button
            className="recap__detail-btn recap__detail-btn--jump"
            onClick={() => document.getElementById(`step-${steps[active].num}`)?.scrollIntoView({ behavior: 'smooth' })}
          >
            Jump to full step ↗
          </button>
          <button
            className="recap__detail-btn"
            onClick={() => setActive(Math.min(steps.length - 1, active + 1))}
            disabled={active === steps.length - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
