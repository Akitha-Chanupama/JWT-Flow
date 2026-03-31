import { useEffect, useRef, useState, Children } from 'react';

export default function StepSection({ id, number, title, description, children, className = '', isLast = false }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [displayNum, setDisplayNum] = useState('00');

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

  /* Animate from 00 → target number when visible */
  useEffect(() => {
    if (!visible) return;
    const target = parseInt(number, 10);
    if (isNaN(target) || target <= 0) { setDisplayNum(number); return; }
    let frame = 0;
    const totalFrames = 18;
    const timer = setInterval(() => {
      frame++;
      const current = Math.round((frame / totalFrames) * target);
      setDisplayNum(String(Math.min(current, target)).padStart(2, '0'));
      if (frame >= totalFrames) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [visible, number]);

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
          <span>{displayNum}</span>
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
