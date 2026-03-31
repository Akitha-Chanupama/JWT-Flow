export default function FlowDiagram({ direction = 'right', label, animated = true }) {
  const isRight = direction === 'right';

  return (
    <div className={`flow-diagram flow-diagram--${direction}`}>
      {/* Client */}
      <div className="flow-diagram__node flow-diagram__node--client">
        <div className="flow-diagram__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
        <span>Client</span>
      </div>

      {/* Arrow with animated packet */}
      <div className="flow-diagram__arrow">
        <div className="flow-diagram__line" />
        {animated && <div className={`flow-diagram__packet ${isRight ? 'flow-diagram__packet--right' : 'flow-diagram__packet--left'}`} />}
        <div className={`flow-diagram__arrowhead ${isRight ? 'flow-diagram__arrowhead--right' : 'flow-diagram__arrowhead--left'}`} />
        {label && <span className="flow-diagram__label">{label}</span>}
      </div>

      {/* Server */}
      <div className="flow-diagram__node flow-diagram__node--server">
        <div className="flow-diagram__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
            <line x1="6" y1="6" x2="6.01" y2="6"/>
            <line x1="6" y1="18" x2="6.01" y2="18"/>
          </svg>
        </div>
        <span>Server</span>
      </div>
    </div>
  );
}
