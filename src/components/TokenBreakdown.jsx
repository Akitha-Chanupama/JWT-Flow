import { useState, useEffect, useRef } from 'react';

const parts = [
  {
    name: 'Header',
    color: 'var(--token-header)',
    encoded: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    decoded: `{
  "alg": "HS256",
  "typ": "JWT"
}`,
  },
  {
    name: 'Payload',
    color: 'var(--token-payload)',
    encoded: 'eyJzdWIiOiIxMjM0NTY3ODkwIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNjE2MjM5MDIyfQ',
    decoded: `{
  "sub": "1234567890",
  "email": "user@example.com",
  "iat": 1616239022
}`,
  },
  {
    name: 'Signature',
    color: 'var(--token-signature)',
    encoded: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    decoded: `HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  your-256-bit-secret
)`,
  },
];

export default function TokenBreakdown() {
  const [activePart, setActivePart] = useState(null);
  const [assembled, setAssembled] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAssembled(true), 400);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="token-breakdown" ref={ref}>
      {/* Token assembly animation */}
      <div className={`token-breakdown__assembly ${assembled ? 'token-breakdown__assembly--done' : ''}`}>
        {parts.map((part, i) => (
          <div
            key={part.name}
            className="token-breakdown__part"
            style={{ '--part-color': part.color, '--part-i': i }}
          >
            <span className="token-breakdown__part-label">{part.name}</span>
          </div>
        ))}
      </div>

      {/* Token string visualization */}
      <div className={`token-breakdown__token ${assembled ? 'token-breakdown__token--visible' : ''}`}>
        {parts.map((part, i) => (
          <span key={part.name}>
            <span
              className={`token-breakdown__segment ${activePart === i ? 'token-breakdown__segment--active' : ''}`}
              style={{ color: part.color }}
              onMouseEnter={() => setActivePart(i)}
              onMouseLeave={() => setActivePart(null)}
              onClick={() => setActivePart(activePart === i ? null : i)}
            >
              {part.encoded}
            </span>
            {i < parts.length - 1 && <span className="token-breakdown__dot">.</span>}
          </span>
        ))}
      </div>

      {/* Decoded cards */}
      <div className="token-breakdown__cards">
        {parts.map((part, i) => (
          <div
            key={part.name}
            className={`token-breakdown__card ${activePart === i ? 'token-breakdown__card--active' : ''}`}
            style={{ '--card-color': part.color }}
            onMouseEnter={() => setActivePart(i)}
            onMouseLeave={() => setActivePart(null)}
          >
            <div className="token-breakdown__card-header">
              <div className="token-breakdown__card-dot" style={{ background: part.color }} />
              <span>{part.name}</span>
            </div>
            <pre className="token-breakdown__card-code">{part.decoded}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
