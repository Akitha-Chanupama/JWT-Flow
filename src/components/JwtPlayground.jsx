import { useState, useMemo, useCallback } from 'react';

function fakeBase64(str) {
  try {
    return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  } catch {
    return btoa(encodeURIComponent(str)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }
}

function safeDecode(b64) {
  try {
    const padded = b64.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export default function JwtPlayground() {
  const [tab, setTab] = useState('build');
  const [copied, setCopied] = useState(false);

  /* ── Build tab state ── */
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [role, setRole] = useState('admin');
  const [activeSection, setActiveSection] = useState(null);

  const token = useMemo(() => {
    const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
    const payload = JSON.stringify({
      sub: '1234567890',
      name,
      email,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    const headerB64 = fakeBase64(header);
    const payloadB64 = fakeBase64(payload);
    const sigB64 = fakeBase64(`HMACSHA256(${headerB64}.${payloadB64},secret)`).slice(0, 43);
    return { headerB64, payloadB64, sigB64, full: `${headerB64}.${payloadB64}.${sigB64}` };
  }, [name, email, role]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(token.full).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [token.full]);

  /* ── Decode tab state ── */
  const [pastedToken, setPastedToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const decoded = useMemo(() => {
    const parts = pastedToken.split('.');
    if (parts.length !== 3) return null;
    const header = safeDecode(parts[0]);
    const payload = safeDecode(parts[1]);
    if (!header || !payload) return null;
    return { header, payload, sig: parts[2] };
  }, [pastedToken]);

  return (
    <div className="playground">
      {/* ── Tab bar ── */}
      <div className="playground__tabs">
        <button className={`playground__tab ${tab === 'build' ? 'playground__tab--active' : ''}`} onClick={() => setTab('build')}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          Build
        </button>
        <button className={`playground__tab ${tab === 'decode' ? 'playground__tab--active' : ''}`} onClick={() => setTab('decode')}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Decode
        </button>
      </div>

      {tab === 'build' ? (
        /* ════════ BUILD TAB — Minimal ════════ */
        <div className="build">
          {/* ── Compact inline inputs ── */}
          <div className="build__fields">
            <div className="build__field">
              <label>name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="build__field">
              <label>email</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
            </div>
            <div className="build__field build__field--sm">
              <label>role</label>
              <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="admin">admin</option>
                <option value="user">user</option>
                <option value="editor">editor</option>
              </select>
            </div>
          </div>

          {/* ── Hero token output ── */}
          <div className="build__token-wrap">
            <div className="build__token-bar">
              <span className="build__token-label">Generated JWT</span>
              <button className="build__copy-btn" onClick={handleCopy} title="Copy token">
                {copied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                )}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="build__token">
              <span
                className={`build__seg build__seg--header ${activeSection === 'header' ? 'build__seg--glow' : ''}`}
                onMouseEnter={() => setActiveSection('header')}
                onMouseLeave={() => setActiveSection(null)}
              >{token.headerB64}</span>
              <span className="build__dot">.</span>
              <span
                className={`build__seg build__seg--payload ${activeSection === 'payload' ? 'build__seg--glow' : ''}`}
                onMouseEnter={() => setActiveSection('payload')}
                onMouseLeave={() => setActiveSection(null)}
              >{token.payloadB64}</span>
              <span className="build__dot">.</span>
              <span
                className={`build__seg build__seg--sig ${activeSection === 'sig' ? 'build__seg--glow' : ''}`}
                onMouseEnter={() => setActiveSection('sig')}
                onMouseLeave={() => setActiveSection(null)}
              >{token.sigB64}</span>
            </div>
          </div>

          {/* ── Decoded cards ── */}
          <div className="build__cards">
            <button
              className={`build__card ${activeSection === 'header' ? 'build__card--active' : ''}`}
              onMouseEnter={() => setActiveSection('header')}
              onMouseLeave={() => setActiveSection(null)}
              onClick={() => setActiveSection(activeSection === 'header' ? null : 'header')}
            >
              <div className="build__card-accent" style={{ background: 'var(--token-header)' }} />
              <div className="build__card-body">
                <span className="build__card-tag" style={{ color: 'var(--token-header)' }}>Header</span>
                <span className="build__card-algo">HS256</span>
              </div>
              {activeSection === 'header' && (
                <pre className="build__card-pre">{`{ "alg": "HS256", "typ": "JWT" }`}</pre>
              )}
            </button>
            <button
              className={`build__card ${activeSection === 'payload' ? 'build__card--active' : ''}`}
              onMouseEnter={() => setActiveSection('payload')}
              onMouseLeave={() => setActiveSection(null)}
              onClick={() => setActiveSection(activeSection === 'payload' ? null : 'payload')}
            >
              <div className="build__card-accent" style={{ background: 'var(--token-payload)' }} />
              <div className="build__card-body">
                <span className="build__card-tag" style={{ color: 'var(--token-payload)' }}>Payload</span>
                <span className="build__card-algo">{name} · {role}</span>
              </div>
              {activeSection === 'payload' && (
                <pre className="build__card-pre">{JSON.stringify({ sub: '1234567890', name, email, role }, null, 2)}</pre>
              )}
            </button>
            <button
              className={`build__card ${activeSection === 'sig' ? 'build__card--active' : ''}`}
              onMouseEnter={() => setActiveSection('sig')}
              onMouseLeave={() => setActiveSection(null)}
              onClick={() => setActiveSection(activeSection === 'sig' ? null : 'sig')}
            >
              <div className="build__card-accent" style={{ background: 'var(--token-signature)' }} />
              <div className="build__card-body">
                <span className="build__card-tag" style={{ color: 'var(--token-signature)' }}>Signature</span>
                <span className="build__card-algo">HMAC-SHA256</span>
              </div>
              {activeSection === 'sig' && (
                <pre className="build__card-pre">HMACSHA256(header + "." + payload, secret)</pre>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* ════════ DECODE TAB ════════ */
        <>
          <div className="playground__inputs">
            <h3 className="playground__title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              Decode a Token
            </h3>
            <p className="playground__subtitle">Paste any JWT to see its decoded contents</p>
            <div className="playground__field">
              <label>Paste JWT</label>
              <textarea
                className="playground__textarea"
                value={pastedToken}
                onChange={e => setPastedToken(e.target.value)}
                rows={4}
                placeholder="eyJhbGciOiJIUzI1NiIs..."
              />
            </div>
          </div>
          <div className="playground__output">
            {decoded ? (
              <>
                <div className="playground__decoded">
                  <div className="playground__decoded-section" style={{ borderColor: 'var(--token-header)' }}>
                    <span className="playground__decoded-label" style={{ color: 'var(--token-header)' }}>Header</span>
                    <pre>{JSON.stringify(decoded.header, null, 2)}</pre>
                  </div>
                  <div className="playground__decoded-section" style={{ borderColor: 'var(--token-payload)' }}>
                    <span className="playground__decoded-label" style={{ color: 'var(--token-payload)' }}>Payload</span>
                    <pre>{JSON.stringify(decoded.payload, null, 2)}</pre>
                  </div>
                  <div className="playground__decoded-section" style={{ borderColor: 'var(--token-signature)' }}>
                    <span className="playground__decoded-label" style={{ color: 'var(--token-signature)' }}>Signature</span>
                    <pre>{decoded.sig}</pre>
                  </div>
                </div>
                {decoded.payload.exp && (
                  <div className={`playground__exp-badge ${Date.now() / 1000 > decoded.payload.exp ? 'playground__exp-badge--expired' : 'playground__exp-badge--valid'}`}>
                    {Date.now() / 1000 > decoded.payload.exp ? '⚠ Token Expired' : '✓ Token Still Valid'}
                  </div>
                )}
              </>
            ) : (
              <div className="playground__error">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>Paste a valid JWT (three Base64URL segments separated by dots)</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
