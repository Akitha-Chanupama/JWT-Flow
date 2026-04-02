import { useState, useEffect, useRef, useCallback } from "react";

const ITEMS = [
  { label: "Hero — Introduction", id: "hero", icon: "🏠", category: "Section" },
  { label: "Step 1 — User Enters Credentials", id: "step-1", icon: "👤", category: "Step" },
  { label: "Step 2 — Request Sent to Server", id: "step-2", icon: "📤", category: "Step" },
  { label: "Step 3 — Server Validates Credentials", id: "step-3", icon: "🔍", category: "Step" },
  { label: "Step 4 — JWT Token Generated", id: "step-4", icon: "🔑", category: "Step" },
  { label: "Step 5 — Token Sent Back to Client", id: "step-5", icon: "📥", category: "Step" },
  { label: "Step 6 — Token Stored in Browser", id: "step-6", icon: "💾", category: "Step" },
  { label: "Step 7 — Authenticated Requests", id: "step-7", icon: "🔓", category: "Step" },
  { label: "Step 8 — Token Expiration & Security", id: "step-8", icon: "⏱", category: "Step" },
  { label: "Security Attacks — Common Vulnerabilities", id: "attacks-section", icon: "⚠️", category: "Section" },
  { label: "Recap — Full JWT Flow", id: "recap-section", icon: "🔄", category: "Section" },
  { label: "Playground — Build & Decode JWTs", id: "playground-section", icon: "🧪", category: "Section" },
  { label: "Comparison — JWT vs Session Auth", id: "comparison-section", icon: "⚖️", category: "Section" },
  { label: "Quiz — Test Your Knowledge", id: "quiz-section", icon: "🎯", category: "Section" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = ITEMS.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  // Open on Ctrl+K or custom event from Navbar
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    const handleCustom = () => setOpen(true);
    window.addEventListener("keydown", handleKey);
    window.addEventListener("openCmd", handleCustom);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("openCmd", handleCustom);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => { setCursor(0); }, [query]);

  const close = useCallback(() => setOpen(false), []);

  const navigate = useCallback((item) => {
    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
    close();
  }, [close]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(".cmd-item--active");
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  useEffect(() => {
    if (!open) return;
    const handleNav = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setCursor(c => Math.min(c + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
      if (e.key === "Enter" && filtered[cursor]) navigate(filtered[cursor]);
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleNav);
    return () => window.removeEventListener("keydown", handleNav);
  }, [open, cursor, filtered, navigate, close]);

  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={close}>
      <div className="cmd-palette" onClick={e => e.stopPropagation()}>
        <div className="cmd-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            className="cmd-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Jump to any section or concept..."
            autoComplete="off"
          />
          <kbd className="cmd-esc" onClick={close}>Esc</kbd>
        </div>
        <div className="cmd-list" ref={listRef}>
          {filtered.length === 0 ? (
            <div className="cmd-empty">No results for &quot;{query}&quot;</div>
          ) : filtered.map((item, i) => (
            <button
              key={item.id}
              className={`cmd-item ${i === cursor ? "cmd-item--active" : ""}`}
              onClick={() => navigate(item)}
              onMouseEnter={() => setCursor(i)}
            >
              <span className="cmd-item-icon">{item.icon}</span>
              <span className="cmd-item-label">{item.label}</span>
              <span className="cmd-item-cat">{item.category}</span>
            </button>
          ))}
        </div>
        <div className="cmd-footer">
          <kbd>↑↓</kbd> navigate &nbsp;·&nbsp; <kbd>↵</kbd> jump &nbsp;·&nbsp; <kbd>Esc</kbd> close &nbsp;·&nbsp; <kbd>Ctrl K</kbd> toggle
        </div>
      </div>
    </div>
  );
}
