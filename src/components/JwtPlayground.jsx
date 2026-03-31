import { useState, useMemo } from 'react';

function fakeBase64(str) {
  try {
    return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  } catch {
    return btoa(encodeURIComponent(str)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }
}

export default function JwtPlayground() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [role, setRole] = useState('admin');

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
    return { headerB64, payloadB64, sigB64 };
  }, [name, email, role]);

  return (
    <div className="playground">
      <div className="playground__inputs">
        <h3 className="playground__title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
          </svg>
          Try It Yourself
        </h3>
        <p className="playground__subtitle">Edit the fields and watch the token update in real-time</p>
        <div className="playground__field">
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="playground__field">
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="playground__field">
          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="admin">admin</option>
            <option value="user">user</option>
            <option value="editor">editor</option>
          </select>
        </div>
      </div>
      <div className="playground__output">
        <div className="playground__output-label">Generated Token</div>
        <div className="playground__token">
          <span style={{ color: 'var(--token-header)' }}>{token.headerB64}</span>
          <span className="playground__token-dot">.</span>
          <span style={{ color: 'var(--token-payload)' }}>{token.payloadB64}</span>
          <span className="playground__token-dot">.</span>
          <span style={{ color: 'var(--token-signature)' }}>{token.sigB64}</span>
        </div>
        <div className="playground__decoded">
          <div className="playground__decoded-section" style={{ borderColor: 'var(--token-header)' }}>
            <span className="playground__decoded-label" style={{ color: 'var(--token-header)' }}>Header</span>
            <pre>{`{ "alg": "HS256", "typ": "JWT" }`}</pre>
          </div>
          <div className="playground__decoded-section" style={{ borderColor: 'var(--token-payload)' }}>
            <span className="playground__decoded-label" style={{ color: 'var(--token-payload)' }}>Payload</span>
            <pre>{JSON.stringify({ sub: '1234567890', name, email, role }, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
