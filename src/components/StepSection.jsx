import { useEffect, useRef, useState, Children } from 'react';

export default function StepSection({ id, number, title, description, children, className = '', isLast = false }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`step ${visible ? 'step--visible' : ''} ${className}`}
    >
      {/* Vertical connector line */}
      {!isLast && <div className="step__connector" />}

      <div className="step__header" style={{ '--stagger': 0 }}>
        <div className="step__number">
          <span>{number}</span>
        </div>
        <div className="step__title-group">
          <h2 className="step__title">{title}</h2>
          <p className="step__description">{description}</p>
        </div>
      </div>
      <div className="step__content">
        {Children.map(children, (child, i) => (
          <div className="step__child" style={{ '--stagger': i + 1 }} key={i}>
            {child}
          </div>
        ))}
      </div>
    </section>
  );
}
