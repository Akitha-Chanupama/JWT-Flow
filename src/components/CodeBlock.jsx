export default function CodeBlock({ title, code, language = 'json' }) {
  return (
    <div className="code-block">
      <div className="code-block__header">
        <div className="code-block__dots">
          <span className="code-block__dot code-block__dot--red" />
          <span className="code-block__dot code-block__dot--yellow" />
          <span className="code-block__dot code-block__dot--green" />
        </div>
        <span className="code-block__title">{title || language}</span>
      </div>
      <pre className="code-block__body">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
