import { useState, useCallback, useMemo } from 'react';

/* ── Lightweight syntax highlighter ── */
function highlightCode(code, language) {
  if (language === 'json') {
    return code
      .replace(/("(?:[^"\\]|\\.)*")\s*:/g, '<span class="syn-key">$1</span>:')
      .replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="syn-str">$1</span>')
      .replace(/:\s*(\d+)/g, ': <span class="syn-num">$1</span>')
      .replace(/:\s*(true|false|null)/g, ': <span class="syn-bool">$1</span>');
  }
  if (language === 'javascript' || language === 'js') {
    return code
      .replace(/(\/\/.*)/gm, '<span class="syn-comment">$1</span>')
      .replace(/\b(const|let|var|function|async|await|return|if|else|new|import|export|from|class|this)\b/g, '<span class="syn-keyword">$1</span>')
      .replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span class="syn-str">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="syn-num">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="syn-bool">$1</span>');
  }
  return code;
}

export default function CodeBlock({ title, code, language = 'json' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const highlighted = useMemo(() => highlightCode(
    code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    language
  ), [code, language]);

  return (
    <div className="code-block">
      <div className="code-block__header">
        <div className="code-block__dots">
          <span className="code-block__dot code-block__dot--red" />
          <span className="code-block__dot code-block__dot--yellow" />
          <span className="code-block__dot code-block__dot--green" />
        </div>
        <span className="code-block__title">{title || language}</span>
        <button className={`code-block__copy ${copied ? 'code-block__copy--copied' : ''}`} onClick={handleCopy} aria-label="Copy code">
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          )}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="code-block__body">
        <code className={`language-${language}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  );
}
