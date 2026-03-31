export default function RecapFlow() {
  const steps = [
    { num: '1', label: 'Enter\nCredentials', icon: '👤' },
    { num: '2', label: 'Send\nRequest', icon: '📤' },
    { num: '3', label: 'Validate\nCredentials', icon: '🔍' },
    { num: '4', label: 'Generate\nJWT', icon: '🔑' },
    { num: '5', label: 'Return\nToken', icon: '📥' },
    { num: '6', label: 'Store\nToken', icon: '💾' },
    { num: '7', label: 'Auth\nRequests', icon: '🔓' },
    { num: '8', label: 'Expiry &\nRefresh', icon: '⏱' },
  ];

  return (
    <div className="recap">
      <h2 className="recap__title">
        The Complete <span className="text-gradient">JWT Flow</span>
      </h2>
      <p className="recap__subtitle">A bird's-eye view of the entire authentication journey</p>
      <div className="recap__flow">
        {steps.map((step, i) => (
          <div key={step.num} className="recap__item">
            <div className="recap__node">
              <span className="recap__icon">{step.icon}</span>
              <span className="recap__num">{step.num}</span>
            </div>
            <span className="recap__label">{step.label}</span>
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
    </div>
  );
}
