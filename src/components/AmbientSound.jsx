import { useState, useRef, useCallback } from "react";

export default function AmbientSound() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef(null);
  const nodesRef = useRef(null);

  const start = useCallback(() => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!ctxRef.current) ctxRef.current = new AudioCtx();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.06, now + 2.5);
    master.connect(ctx.destination);

    // Sub drone at A1
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 55;
    const g1 = ctx.createGain(); g1.gain.value = 1;
    osc1.connect(g1); g1.connect(master);

    // Octave up A2
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 110;
    const g2 = ctx.createGain(); g2.gain.value = 0.45;
    osc2.connect(g2); g2.connect(master);

    // Perfect fifth E3
    const osc3 = ctx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.value = 165;
    const g3 = ctx.createGain(); g3.gain.value = 0.18;
    osc3.connect(g3); g3.connect(master);

    // Very slow breathing LFO
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.025;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);

    osc1.start(now); osc2.start(now); osc3.start(now); lfo.start(now);
    nodesRef.current = { master, osc1, osc2, osc3, lfo };
    setPlaying(true);
  }, []);

  const stop = useCallback(() => {
    if (!nodesRef.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const { master, osc1, osc2, osc3, lfo } = nodesRef.current;
    const now = ctx.currentTime;
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + 1.5);
    setTimeout(() => {
      try { osc1.stop(); osc2.stop(); osc3.stop(); lfo.stop(); } catch (_) {}
      nodesRef.current = null;
    }, 1700);
    setPlaying(false);
  }, []);

  return (
    <button
      className={`ambient-btn ${playing ? "ambient-btn--on" : ""}`}
      onClick={playing ? stop : start}
      title={playing ? "Mute ambient sound" : "Enable ambient drone"}
      aria-label={playing ? "Mute ambient sound" : "Enable ambient sound"}
    >
      {playing ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      )}
    </button>
  );
}
