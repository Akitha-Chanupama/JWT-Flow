import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import ProgressBar from './components/ProgressBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StepSection from './components/StepSection';
import CodeBlock from './components/CodeBlock';
import FlowDiagram from './components/FlowDiagram';
import TokenBreakdown from './components/TokenBreakdown';
import BackToTop from './components/BackToTop';
import JwtPlayground from './components/JwtPlayground';
import RecapFlow from './components/RecapFlow';
import Quiz from './components/Quiz';
import Comparison from './components/Comparison';

/* ── Glossary tooltip component ── */
function Glossary({ term, tip, children }) {
  return (
    <span className="glossary">
      <span className="glossary__trigger">{children || term}</span>
      <span className="glossary__tip">{tip}</span>
    </span>
  );
}

/* ── Helper: scroll to next step ── */
function NextStepButton({ targetId, label = 'Next Step' }) {
  return (
    <button
      className="next-step-btn"
      onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })}
    >
      <span>{label}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </button>
  );
}

/* ── Typing animation for Step 1 ── */
function TypedInput({ text, type = 'text', label }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done) {
        let i = 0;
        const timer = setInterval(() => {
          setDisplayed(text.slice(0, i + 1));
          i++;
          if (i >= text.length) {
            clearInterval(timer);
            setDone(true);
          }
        }, 80);
        return () => clearInterval(timer);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [text, done]);

  return (
    <div className="mock-form__field" ref={ref}>
      <label className="mock-form__label">{label}</label>
      <div className="mock-form__input-wrap">
        <input
          className="mock-form__input mock-form__input--typing"
          type={type}
          value={type === 'password' && done ? '••••••••' : type === 'password' ? displayed.replace(/./g, '•') : displayed}
          readOnly
        />
        {!done && <span className="mock-form__cursor" />}
      </div>
    </div>
  );
}

/* ── Login button simulation ── */
function LoginButton() {
  const [phase, setPhase] = useState('idle'); // idle → loading → success

  const handleClick = () => {
    if (phase !== 'idle') return;
    setPhase('loading');
    setTimeout(() => {
      setPhase('success');
      setTimeout(() => {
        document.getElementById('step-2')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => setPhase('idle'), 1200);
      }, 900);
    }, 1400);
  };

  return (
    <button className={`mock-form__btn mock-form__btn--${phase}`} type="button" onClick={handleClick}>
      {phase === 'idle' && <>
        <span className="mock-form__btn-text">Login</span>
        <span className="mock-form__btn-icon">→</span>
      </>}
      {phase === 'loading' && <span className="mock-form__spinner" />}
      {phase === 'success' && (
        <svg className="mock-form__check" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
    </button>
  );
}

/* ── Tabbed storage visual for Step 6 ── */
function StorageTabs() {
  const [tab, setTab] = useState('localStorage');
  const tabs = [
    { id: 'localStorage', label: 'localStorage', icon: '📦' },
    { id: 'sessionStorage', label: 'sessionStorage', icon: '📋' },
    { id: 'cookies', label: 'HttpOnly Cookie', icon: '🍪' },
  ];

  const content = {
    localStorage: {
      code: `// Store in localStorage (persists until cleared)
localStorage.setItem("token", response.token);
const token = localStorage.getItem("token");`,
      pros: 'Persists across tabs and browser restarts',
      cons: 'Vulnerable to XSS attacks',
    },
    sessionStorage: {
      code: `// Store in sessionStorage (cleared when tab closes)
sessionStorage.setItem("token", response.token);
const token = sessionStorage.getItem("token");`,
      pros: 'Cleared automatically when tab closes',
      cons: 'Still vulnerable to XSS, lost on new tab',
    },
    cookies: {
      code: `// Server sets an HttpOnly cookie (most secure)
// Response header from server:
Set-Cookie: token=eyJhbG...; HttpOnly; Secure; SameSite=Strict`,
      pros: 'Cannot be accessed by JavaScript (XSS safe)',
      cons: 'Requires server-side setup, sent with every request',
    },
  };

  return (
    <div className="storage-tabs">
      <div className="storage-tabs__bar">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`storage-tabs__tab ${tab === t.id ? 'storage-tabs__tab--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      <div className="storage-tabs__content">
        <CodeBlock title={`${tab}.js`} language="javascript" code={content[tab].code} />
        <div className="storage-tabs__meta">
          <div className="storage-tabs__pro">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>{content[tab].pros}</span>
          </div>
          <div className="storage-tabs__con">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            <span>{content[tab].cons}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Auth result branching for Step 7 ── */
function AuthResult() {
  return (
    <div className="auth-result">
      <div className="auth-result__branch auth-result__branch--success">
        <div className="auth-result__icon auth-result__icon--success">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
          </svg>
        </div>
        <h4>Valid Token</h4>
        <p>Server decodes the token, verifies the signature, and grants access to the protected resource.</p>
        <div className="auth-result__status auth-result__status--success">200 OK</div>
      </div>
      <div className="auth-result__divider">
        <span>OR</span>
      </div>
      <div className="auth-result__branch auth-result__branch--failure">
        <div className="auth-result__icon auth-result__icon--failure">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h4>Invalid / Expired Token</h4>
        <p>Signature mismatch or token has exceeded its expiration time. Access denied.</p>
        <div className="auth-result__status auth-result__status--failure">401 Unauthorized</div>
      </div>
    </div>
  );
}

/* ── Token lifecycle bar for Step 8 ── */
function TokenLifecycle() {
  return (
    <div className="lifecycle">
      <div className="lifecycle__bar">
        <div className="lifecycle__segment lifecycle__segment--created">
          <span className="lifecycle__dot" />
          <span>Created</span>
        </div>
        <div className="lifecycle__segment lifecycle__segment--active">
          <span className="lifecycle__dot" />
          <span>Active</span>
        </div>
        <div className="lifecycle__segment lifecycle__segment--warning">
          <span className="lifecycle__dot" />
          <span>Expiring</span>
        </div>
        <div className="lifecycle__segment lifecycle__segment--expired">
          <span className="lifecycle__dot" />
          <span>Expired</span>
        </div>
      </div>
      <div className="lifecycle__progress">
        <div className="lifecycle__fill" />
      </div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  /* ── Keyboard navigation ── */
  useEffect(() => {
    const stepIds = ['hero', 'step-1', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7', 'step-8'];
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      const currentY = window.scrollY + window.innerHeight / 2;
      let currentIndex = 0;
      stepIds.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop < currentY) currentIndex = i;
      });

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        const next = stepIds[Math.min(currentIndex + 1, stepIds.length - 1)];
        document.getElementById(next)?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = stepIds[Math.max(currentIndex - 1, 0)];
        document.getElementById(prev)?.scrollIntoView({ behavior: 'smooth' });
      } else if (e.key === 'Escape') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  /* ── Card glow effect (mouse spotlight) + 3D tilt ── */
  const handleMouseMove = useCallback((e) => {
    const cards = document.querySelectorAll('.glow-card, .info-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--glow-x', `${x}px`);
      card.style.setProperty('--glow-y', `${y}px`);

      /* 3D tilt — only when hovering */
      if (
        x >= 0 && x <= rect.width &&
        y >= 0 && y <= rect.height
      ) {
        const rotateY = ((x / rect.width) - 0.5) * 8;   // ±4 deg
        const rotateX = ((y / rect.height) - 0.5) * -8;  // ±4 deg
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    const cards = document.querySelectorAll('.glow-card, .info-card');
    cards.forEach(card => {
      card.style.transform = '';
    });
  }, []);

  return (
    <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {/* Loading overlay */}
      <div className={`app-loader ${!loading ? 'app-loader--hidden' : ''}`}>
        <div className="app-loader__spinner" />
      </div>

      <ProgressBar />
      <Navbar />
      <Hero />

      <main>
        {/* ═══════════════════════════════════════════
            STEP 1 — User Enters Credentials
           ═══════════════════════════════════════════ */}
        <StepSection
          id="step-1"
          number="01"
          title="User Enters Credentials"
          description="Everything starts here. The user types their email and password into the login form and clicks the Login button."
        >
          <div className="mock-form glow-card">
            <h3 className="mock-form__title">Welcome Back</h3>
            <p className="mock-form__subtitle">Sign in to your account</p>
            <TypedInput label="Email" text="user@example.com" type="text" />
            <TypedInput label="Password" text="mypassword" type="password" />
            <LoginButton />
          </div>
          <NextStepButton targetId="step-2" />
        </StepSection>

        {/* ═══════════════════════════════════════════
            STEP 2 — Request Sent to Server
           ═══════════════════════════════════════════ */}
        <StepSection
          id="step-2"
          number="02"
          title="Request Sent to Server"
          description={<>When you hit Login, the browser sends a <Glossary term="POST" tip="An HTTP method used to send data to the server, as opposed to GET which only retrieves data.">POST request</Glossary> to the server with your credentials as JSON data.</>}
        >
          <FlowDiagram direction="right" label="POST /api/login" animated />
          <CodeBlock
            title="request-body.json"
            code={`{
  "email": "user@example.com",
  "password": "••••••••"
}`}
          />
          <div className="info-card glow-card">
            <div className="info-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>
            <h4 className="info-card__title">Always use <Glossary term="HTTPS" tip="HTTP Secure — encrypts all traffic between client and server using TLS, preventing eavesdropping.">HTTPS</Glossary></h4>
            <p className="info-card__text">
              Credentials must be sent over an encrypted connection (HTTPS). Never send passwords over plain HTTP — they could be intercepted.
            </p>
          </div>
          <NextStepButton targetId="step-3" />
        </StepSection>

        {/* ═══════════════════════════════════════════
            STEP 3 — Server Validates Credentials
           ═══════════════════════════════════════════ */}
        <StepSection
          id="step-3"
          number="03"
          title="Server Validates Credentials"
          description="The server receives the request, looks up the user in the database, and verifies the password hash matches."
        >
          <div className="server-visual glow-card">
            <div className="server-visual__item">
              <div className="server-visual__icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                  <line x1="6" y1="6" x2="6.01" y2="6"/>
                  <line x1="6" y1="18" x2="6.01" y2="18"/>
                </svg>
              </div>
              <span className="server-visual__label">Server</span>
            </div>

            <div className="server-visual__arrow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>

            <div className="server-visual__item">
              <div className="server-visual__icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"/>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                </svg>
              </div>
              <span className="server-visual__label">Database</span>
            </div>

            <div className="server-visual__arrow">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>

            <div className="server-visual__item">
              <div className="server-visual__icon" style={{ color: 'var(--success)', background: 'rgba(52,211,153,0.12)' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <span className="server-visual__label">Verified ✓</span>
            </div>
          </div>

          <CodeBlock
            title="server-validation.js"
            language="javascript"
            code={`// Server-side validation
const user = await db.findByEmail(email);
const valid = await bcrypt.compare(password, user.passwordHash);

if (!valid) {
  return res.status(401).json({ error: "Invalid credentials" });
}
// ✅ Credentials are valid — generate token`}
          />
          <NextStepButton targetId="step-4" />
        </StepSection>

        {/* ═══════════════════════════════════════════
            STEP 4 — JWT Token Generation
           ═══════════════════════════════════════════ */}
        <StepSection
          id="step-4"
          number="04"
          title="JWT Token is Generated"
          description={<>The server creates a JSON Web Token with three parts: Header, Payload, and Signature. Each part is <Glossary term="Base64URL" tip="A URL-safe variant of Base64 encoding that replaces + with - and / with _, and omits padding = characters.">Base64URL encoded</Glossary> and joined with dots.</>}
        >
          <TokenBreakdown />
          <div className="cards-grid">
            <div className="info-card glow-card">
              <div className="info-card__icon" style={{ color: 'var(--token-header)', background: 'rgba(251,113,133,0.12)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>
                </svg>
              </div>
              <h4 className="info-card__title">Header</h4>
              <p className="info-card__text">Specifies the token type (JWT) and the signing algorithm (e.g., <Glossary term="HS256" tip="HMAC-SHA256 — a symmetric signing algorithm that uses a shared secret key to create and verify signatures.">HS256</Glossary>).</p>
            </div>
            <div className="info-card glow-card">
              <div className="info-card__icon" style={{ color: 'var(--token-payload)', background: 'rgba(192,132,252,0.12)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h4 className="info-card__title">Payload</h4>
              <p className="info-card__text">Contains the <Glossary term="claims" tip="Key-value pairs in the payload — registered claims (like exp, iss) and custom claims (like role, email).">claims</Glossary> — user data like ID, email, and token expiration time.</p>
            </div>
            <div className="info-card glow-card">
              <div className="info-card__icon" style={{ color: 'var(--token-signature)', background: 'rgba(56,189,248,0.12)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h4 className="info-card__title">Signature</h4>
              <p className="info-card__text">Ensures the token hasn't been tampered with. Created using the header, payload, and a <Glossary term="secret key" tip="A private string known only to the server, used to sign and verify tokens. If leaked, all tokens can be forged.">secret key</Glossary>.</p>
            </div>
          </div>
          <NextStepButton targetId="step-5" />
        </StepSection>

        {/* ═══════════════════════════════════════════
            STEP 5 — Token Sent Back to Client
           ═══════════════════════════════════════════ */}
        <StepSection
          id="step-5"
          number="05"
          title="Token Sent Back to Client"
          description="The server responds with the JWT token. The client receives it and is now authenticated."
        >
          <FlowDiagram direction="left" label="200 OK + Token" animated />
          <CodeBlock
            title="server-response.json"
            code={`{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}`}
          />
          <NextStepButton targetId="step-6" />
        </StepSection>

        {/* ═══════════════════════════════════════════
            STEP 6 — Token Stored in Browser
           ═══════════════════════════════════════════ */}
        <StepSection
          id="step-6"
          number="06"
          title="Token Stored in Browser"
          description="The client stores the token so it can be used for future requests. There are several storage options, each with tradeoffs."
        >
          <div className="browser-visual glow-card">
            <div className="browser-visual__bar">
              <div className="browser-visual__dots">
                <span className="browser-visual__dot" style={{ background: '#f87171' }} />
                <span className="browser-visual__dot" style={{ background: '#fbbf24' }} />
                <span className="browser-visual__dot" style={{ background: '#34d399' }} />
              </div>
              <div className="browser-visual__urlbar">🔒 https://myapp.com</div>
            </div>
            <div className="browser-visual__body">
              <div className="browser-visual__storage">
                <div className="browser-visual__storage-header">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                  Application → Local Storage
                </div>
                <div className="browser-visual__storage-row">
                  <span className="browser-visual__storage-key">"token"</span>
                  <span className="browser-visual__storage-value">"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOi..."</span>
                </div>
              </div>
            </div>
          </div>

          <StorageTabs />
          <NextStepButton targetId="step-7" />
        </StepSection>

        {/* ═══════════════════════════════════════════
            STEP 7 — Authenticated Requests
           ═══════════════════════════════════════════ */}
        <StepSection
          id="step-7"
          number="07"
          title="Making Authenticated Requests"
          description={<>For every subsequent API request, the client includes the JWT in the <Glossary term="Authorization header" tip="An HTTP header where the client sends credentials. The Bearer scheme indicates a token-based auth: Authorization: Bearer &lt;token&gt;">Authorization header</Glossary>. The server verifies the token before processing the request.</>}
        >
          <FlowDiagram direction="right" label="GET /api/profile" animated />

          <CodeBlock
            title="authenticated-request.js"
            language="javascript"
            code={`// Attach token to every request
fetch("/api/profile", {
  method: "GET",
  headers: {
    "Authorization": "Bearer eyJhbGciOiJIUzI1...",
    "Content-Type": "application/json"
  }
});`}
          />

          <AuthResult />
          <NextStepButton targetId="step-8" />
        </StepSection>

        {/* ═══════════════════════════════════════════
            STEP 8 — Token Expiration & Security
           ═══════════════════════════════════════════ */}
        <StepSection
          id="step-8"
          number="08"
          title="Token Expiration & Security"
          description="JWTs are designed to expire. This limits the damage if a token is stolen. Refresh tokens can be used to get new access tokens without re-entering credentials."
          isLast
        >
          <TokenLifecycle />

          {/* Timer visual */}
          <div className="timer-ring">
            <svg width="120" height="120" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="6" />
              <circle
                className="timer-ring__circle"
                cx="50" cy="50" r="45"
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="central" fill="var(--text-primary)" fontSize="16" fontWeight="700" fontFamily="var(--font-mono)">
                exp
              </text>
            </svg>
          </div>

          <div className="expiry-visual">
            <div className="expiry-visual__card glow-card">
              <div className="expiry-visual__icon expiry-visual__icon--clock">⏱</div>
              <h4 className="expiry-visual__card-title">Short-Lived Tokens</h4>
              <p className="expiry-visual__card-text">
                Access tokens typically expire in 15 minutes to 1 hour. This limits exposure if a token is compromised.
              </p>
            </div>
            <div className="expiry-visual__card glow-card">
              <div className="expiry-visual__icon expiry-visual__icon--refresh">🔄</div>
              <h4 className="expiry-visual__card-title">Refresh Tokens</h4>
              <p className="expiry-visual__card-text">
                A longer-lived refresh token can request a new access token. Stored securely, it avoids repeated logins.
              </p>
            </div>
            <div className="expiry-visual__card glow-card">
              <div className="expiry-visual__icon expiry-visual__icon--shield">🛡</div>
              <h4 className="expiry-visual__card-title">Security Best Practices</h4>
              <p className="expiry-visual__card-text">
                Use HTTPS, HttpOnly cookies, short expiry times, and rotate secrets regularly to keep your app secure.
              </p>
            </div>
          </div>

          <CodeBlock
            title="token-expiry.js"
            language="javascript"
            code={`// Check if token is expired
function isTokenExpired(token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return Date.now() >= payload.exp * 1000;
}

// Refresh the token
async function refreshAccessToken(refreshToken) {
  const res = await fetch("/api/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
  return res.json(); // { token: "new-access-token" }
}`}
          />
        </StepSection>

        {/* ═══════════════════════════════════════════
            SECTION DIVIDER
           ═══════════════════════════════════════════ */}
        <div className="section-divider">
          <div className="section-divider__line" />
          <span className="section-divider__icon">✦</span>
          <div className="section-divider__line" />
        </div>

        {/* ═══════════════════════════════════════════
            RECAP FLOW
           ═══════════════════════════════════════════ */}
        <section id="recap-section" className="recap-section">
          <RecapFlow />
        </section>

        {/* ═══════════════════════════════════════════
            JWT PLAYGROUND
           ═══════════════════════════════════════════ */}
        <section className="playground-section">
          <JwtPlayground />
        </section>

        {/* ═══════════════════════════════════════════
            JWT vs SESSION COMPARISON
           ═══════════════════════════════════════════ */}
        <section className="comparison-section">
          <Comparison />
        </section>

        {/* ═══════════════════════════════════════════
            QUIZ
           ═══════════════════════════════════════════ */}
        <section className="quiz-section">
          <h2 className="quiz-section__heading">
            Test Your <span className="text-gradient">Knowledge</span>
          </h2>
          <p className="quiz-section__sub">5 questions to see how well you understood the JWT flow</p>
          <Quiz />
        </section>
      </main>

      {/* ═══════════════════════════════════════════
          FOOTER
         ═══════════════════════════════════════════ */}
      <footer id="footer" className="footer">
        <p>Built to explain <strong className="text-gradient">JWT Authentication</strong> visually.</p>
        <p className="footer__hint">Use ← → arrow keys to navigate · Esc to return to top</p>
      </footer>

      <BackToTop />
    </div>
  );
}