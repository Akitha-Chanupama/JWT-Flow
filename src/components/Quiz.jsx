import { useState } from 'react';

const questions = [
  {
    q: 'What are the three parts of a JWT?',
    options: [
      'Username, Password, Token',
      'Header, Payload, Signature',
      'Client, Server, Database',
      'Request, Response, Cookie',
    ],
    answer: 1,
    explanation: 'A JWT consists of a Header (algorithm info), Payload (claims/data), and Signature (verification hash), joined by dots.',
  },
  {
    q: 'Where is the safest place to store a JWT in the browser?',
    options: [
      'localStorage',
      'sessionStorage',
      'HttpOnly Cookie',
      'URL query string',
    ],
    answer: 2,
    explanation: 'HttpOnly cookies cannot be accessed by JavaScript, making them immune to XSS attacks — the safest client-side option.',
  },
  {
    q: 'What HTTP header is used to send JWTs with requests?',
    options: [
      'X-Token',
      'Cookie',
      'Authorization: Bearer <token>',
      'Content-Type',
    ],
    answer: 2,
    explanation: 'The Authorization header with the Bearer scheme is the standard way to send JWTs in API requests.',
  },
  {
    q: 'Why do JWTs have an expiration time (exp)?',
    options: [
      'To save server memory',
      'To limit damage if a token is stolen',
      'Because browsers require it',
      'To force users to pay again',
    ],
    answer: 1,
    explanation: 'Short-lived tokens limit the window of opportunity for attackers if a token is compromised.',
  },
  {
    q: 'What happens when the server receives an invalid JWT?',
    options: [
      'It creates a new token automatically',
      'It returns 200 OK anyway',
      'It returns 401 Unauthorized',
      'It deletes the user account',
    ],
    answer: 2,
    explanation: 'An invalid or expired JWT means the request is unauthorized. The server responds with 401 Unauthorized.',
  },
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

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
    }
  };

  const handleReset = () => {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setDone(false);
  };

  const pct = Math.round((score / questions.length) * 100);

  if (done) {
    return (
      <div className="quiz">
        <div className="quiz__result">
          <div className={`quiz__score-ring ${pct >= 80 ? 'quiz__score-ring--great' : pct >= 60 ? 'quiz__score-ring--good' : 'quiz__score-ring--try'}`}>
            <span className="quiz__score-num">{score}/{questions.length}</span>
          </div>
          <h3 className="quiz__result-title">
            {pct === 100 ? 'Perfect Score!' : pct >= 80 ? 'Great Job!' : pct >= 60 ? 'Good Effort!' : 'Keep Learning!'}
          </h3>
          <p className="quiz__result-text">
            You got {score} out of {questions.length} questions right ({pct}%)
          </p>
          <button className="quiz__btn quiz__btn--reset" onClick={handleReset}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz__header">
        <span className="quiz__progress">{current + 1} / {questions.length}</span>
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
