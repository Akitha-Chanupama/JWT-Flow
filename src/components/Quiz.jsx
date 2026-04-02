import { useState } from 'react';

/* ── Certificate modal ── */
function Certificate({ score, total, onClose }) {
  const pct = Math.round((score / total) * 100);
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return (
    <div className="cert-overlay" onClick={onClose}>
      <div className="cert-modal" onClick={e => e.stopPropagation()}>
        <button className="cert-close" onClick={onClose} aria-label="Close certificate">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div className="cert-badge">
          <div className="cert-badge-ring">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="6"/>
              <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
            </svg>
          </div>
        </div>
        <div className="cert-header">
          <p className="cert-label">Certificate of Achievement</p>
          <h2 className="cert-title">JWT Authentication<br />Mastered!</h2>
        </div>
        <p className="cert-body">
          This certifies successful completion of the<br />
          <strong>JWT Authentication Flow</strong> interactive course
        </p>
        <div className="cert-score">
          <span className="cert-score-num">{score}/{total}</span>
          <span className="cert-score-pct">{pct}%</span>
        </div>
        <div className="cert-divider" />
        <p className="cert-date">{date}</p>
        <p className="cert-hint">📸 Take a screenshot to save your certificate</p>
      </div>
    </div>
  );
}

const questions = [
  {
    q: 'What are the three parts of a JWT?',
    options: ['Username, Password, Token', 'Header, Payload, Signature', 'Client, Server, Database', 'Request, Response, Cookie'],
    answer: 1,
    explanation: 'A JWT consists of a Header (algorithm info), Payload (claims/data), and Signature (verification hash), joined by dots.',
  },
  {
    q: 'Where is the safest place to store a JWT in the browser?',
    options: ['localStorage', 'sessionStorage', 'HttpOnly Cookie', 'URL query string'],
    answer: 2,
    explanation: 'HttpOnly cookies cannot be accessed by JavaScript, making them immune to XSS attacks — the safest client-side option.',
  },
  {
    q: 'What HTTP header is used to send JWTs with requests?',
    options: ['X-Token', 'Cookie', 'Authorization: Bearer <token>', 'Content-Type'],
    answer: 2,
    explanation: 'The Authorization header with the Bearer scheme is the standard way to send JWTs in API requests.',
  },
  {
    q: 'Why do JWTs have an expiration time (exp)?',
    options: ['To save server memory', 'To limit damage if a token is stolen', 'Because browsers require it', 'To force users to pay again'],
    answer: 1,
    explanation: 'Short-lived tokens limit the window of opportunity for attackers if a token is compromised.',
  },
  {
    q: 'What happens when the server receives an invalid JWT?',
    options: ['It creates a new token automatically', 'It returns 200 OK anyway', 'It returns 401 Unauthorized', 'It deletes the user account'],
    answer: 2,
    explanation: 'An invalid or expired JWT means the request is unauthorized. The server responds with 401 Unauthorized.',
  },
  {
    q: 'What does the "exp" claim in a JWT represent?',
    options: ['The export format of the token', 'The expiration timestamp (Unix time)', 'The expected user identifier', 'The extension version number'],
    answer: 1,
    explanation: '"exp" (expiration time) is a Unix timestamp after which the server must reject the token.',
  },
  {
    q: 'Which part(s) of a JWT are used to create the signature?',
    options: ['Only the payload', 'Only the header', 'Neither — the signature is random', 'Both the encoded header and payload'],
    answer: 3,
    explanation: 'The signature is computed over both Base64URL-encoded parts: HMACSHA256(header.payload, secret).',
  },
  {
    q: 'Which algorithm uses asymmetric (public/private) key pairs for JWT signing?',
    options: ['HS256', 'HS512', 'RS256', 'MD5'],
    answer: 2,
    explanation: 'RS256 uses RSA with SHA-256. The server signs with a private key; anyone with the public key can verify — no shared secret needed.',
  },
  {
    q: 'What is the "alg: none" JWT vulnerability?',
    options: ['Using an outdated hashing algorithm', 'Not encrypting the payload', 'Bypassing signature verification entirely', 'Storing tokens in an insecure location'],
    answer: 2,
    explanation: 'Setting alg to "none" and removing the signature tricks some libraries into skipping verification — accepting any tampered token.',
  },
  {
    q: 'What is the primary purpose of a refresh token?',
    options: ['To encrypt the access token', 'To obtain a new access token without re-login', "To validate the user's password", 'To store session preferences'],
    answer: 1,
    explanation: 'Refresh tokens are long-lived credentials that request new short-lived access tokens, avoiding repeated re-authentication.',
  },
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showCert, setShowCert] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    const s = localStorage.getItem('jwt-quiz-best');
    return s !== null ? parseInt(s, 10) : null;
  });

  const q = questions[current];

  const handleSelect = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.answer) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setDone(true);
      setBestScore(prev => {
        const best = Math.max(prev ?? 0, score);
        localStorage.setItem('jwt-quiz-best', best);
        return best;
      });
    }
  };

  const handleReset = () => {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setDone(false);
    setShowCert(false);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const best = Math.max(bestScore ?? 0, score);
    const bestPct = Math.round((best / questions.length) * 100);
    return (
      <>
        {showCert && <Certificate score={score} total={questions.length} onClose={() => setShowCert(false)} />}
        <div className="quiz">
          <div className="quiz__result">
            <div className={`quiz__score-ring ${pct >= 80 ? 'quiz__score-ring--great' : pct >= 60 ? 'quiz__score-ring--good' : 'quiz__score-ring--try'}`}>
              <span className="quiz__score-num">{score}/{questions.length}</span>
            </div>
            <h3 className="quiz__result-title">
              {pct === 100 ? '🏆 Perfect Score!' : pct >= 80 ? '⭐ Great Job!' : pct >= 60 ? '👍 Good Effort!' : '📚 Keep Learning!'}
            </h3>
            <p className="quiz__result-text">
              You got {score} out of {questions.length} questions right ({pct}%)
            </p>
            {best !== null && (
              <div className="quiz__best">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                Personal best: {best}/{questions.length} ({bestPct}%)
              </div>
            )}
            <div className="quiz__result-actions">
              {pct >= 80 && (
                <button className="quiz__btn quiz__btn--cert" onClick={() => setShowCert(true)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                  </svg>
                  View Certificate
                </button>
              )}
              <button className="quiz__btn quiz__btn--reset" onClick={handleReset}>Try Again</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz__header">
        <div className="quiz__header-top">
          <span className="quiz__progress">{current + 1} / {questions.length}</span>
          {bestScore !== null && (
            <span className="quiz__best-inline">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Best: {bestScore}/{questions.length}
            </span>
          )}
        </div>
        <div className="quiz__progress-bar">
          <div className="quiz__progress-fill" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
      </div>
      <h3 className="quiz__question">{q.q}</h3>
      <div className="quiz__options">
        {q.options.map((opt, i) => {
          let cls = 'quiz__option';
          if (answered) {
            if (i === q.answer) cls += ' quiz__option--correct';
            else if (i === selected) cls += ' quiz__option--wrong';
          } else if (i === selected) {
            cls += ' quiz__option--selected';
          }
          return (
            <button key={i} className={cls} onClick={() => handleSelect(i)}>
              <span className="quiz__option-letter">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="quiz__feedback">
          <p className="quiz__explanation">{q.explanation}</p>
          <button className="quiz__btn" onClick={handleNext}>
            {current < questions.length - 1 ? 'Next Question →' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  );
}
