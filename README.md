# JWT Flow — Interactive JWT Authentication Guide

A fully interactive, visually rich single-page application that teaches **JWT (JSON Web Token) authentication** through an 8-step animated walkthrough, a live cryptographic playground, a security attacks section, an interactive quiz with certificates, and more. Built with Vite 8 + React 19, zero external UI libraries, pure CSS animations.

---

## 🌐 Live Demo

**[https://jwtflow.vercel.app](https://jwtflow.vercel.app)**

Or run locally:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## What It Covers

The app walks through the complete JWT authentication lifecycle in 8 interactive steps:

| Step | Topic |
|------|-------|
| 01 | User Enters Credentials — animated typing input + login button simulation |
| 02 | Request Sent to Server — POST request with HTTPS info card |
| 03 | Server Validates Credentials — server → database → verified flow diagram |
| 04 | JWT Token Generated — interactive token breakdown (header, payload, signature) |
| 05 | Token Sent Back to Client — server response with Bearer token |
| 06 | Token Stored in Browser — tabbed localStorage / sessionStorage / HttpOnly Cookie comparison |
| 07 | Making Authenticated Requests — Authorization header usage with valid/invalid branching |
| 08 | Token Expiration & Security — lifecycle bar, refresh tokens, security best practices |

---

## Features

### Interactive Elements
- **Login Button Simulation** — click triggers spinner → checkmark → auto-scroll to Step 2
- **JWT Playground** — two-tab panel:
  - **Build tab** — edit name / email / role / secret key and watch a **cryptographically valid HMAC-SHA256 JWT** update live (signed via the Web Crypto API); hover segments to highlight header/payload/signature; copy with one click; **Verify at jwt.io ↗** link pre-filled
  - **Decode tab** — paste any JWT to see decoded header, payload, signature + expiry status
- **Security Attacks Section** — four interactive vulnerability cards with exploit code and prevention tips:
  - `alg: none` exploit, Weak Secret / Brute Force, Token Theft via XSS, Payload Tampering
- **Storage Tabs** — switch between localStorage, sessionStorage, and HttpOnly Cookie examples
- **Auth Result Branching** — visual 200 OK vs 401 Unauthorized outcomes
- **Token Lifecycle Bar** — animated Created → Active → Expiring → Expired bar
- **RecapFlow** — inline 8-node step explorer with active state, detail card, and Previous/Next navigation
- **Quiz** — 10-question multiple-choice quiz with per-question explanations, personal best score saved to `localStorage`, and a **certificate modal** for scores ≥ 80%

### Navigation & UX
- **Ctrl+K Command Palette** — searchable jump bar to any section or step (14 items), full keyboard navigation
- **Ambient Sound Toggle** — subtle synthesised drone (Web Audio API, no files), with slow breathing LFO; fades in/out smoothly
- **Keyboard Navigation** — Arrow keys move between steps; Escape returns to top
- **Dark / Light Theme** — toggle with smooth transition, persists via `localStorage`
- **Progress Bar** — fixed top reading progress indicator
- **Back to Top** — appears after scrolling, smooth return

### Visual & UX
- **Hero Section** — staggered entrance animations, floating JWT token preview (hover to glow), decorative gradient divider, parallax orbs, radial vignette
- **Syntax Highlighting** — CodeBlock renders JSON/JS with color-coded keys, strings, numbers, booleans, comments, keywords — no external library
- **Glow Cards** — cursor spotlight effect + 3D tilt toward the mouse on hover
- **Glossary Tooltips** — hover on technical terms (Base64URL, HS256, HMAC, Bearer token, claims, HTTPS) for plain-English explanations
- **Animated Step Numbers** — count up from 00 → target when the section scrolls into view
- **Scroll Animations** — IntersectionObserver-driven stagger reveals on every section

### Knowledge Sections
- **Security Attacks** — Common JWT vulnerabilities with interactive cards, exploit vectors, and prevention guidance
- **Quiz** — 10-question quiz with `localStorage` best score, explanations, and a shareable completion certificate
- **JWT vs Session Auth Comparison** — 6-row side-by-side table (state management, storage, scalability, mobile, revocation, request size)

---

## Tech Stack

| | |
|---|---|
| Framework | React 19.2 + Vite 8 |
| Styling | Pure CSS custom properties (no Tailwind, no CSS-in-JS) |
| Fonts | Inter (sans) + Fira Code (mono) via Google Fonts CDN |
| JWT Signing | Web Crypto API — `crypto.subtle` HMAC-SHA256 (no library) |
| Audio | Web Audio API — synthesised drone oscillators (no files) |
| Animations | CSS keyframes + vanilla JS IntersectionObserver |
| Build | Vite 8, React Compiler (babel-plugin-react-compiler) |
| Hosting | Vercel |
| Linting | ESLint 9 with react-hooks + react-refresh plugins |

**No external UI or animation libraries.** Everything — syntax highlighting, tooltips, 3D tilt, token assembly, real JWT signing, quiz, attacks section, command palette, ambient audio, comparison table — is hand-built.

---

## Project Structure

```
src/
├── App.jsx              # Root: all 8 steps, inline components (TypedInput, StorageTabs,
│                        # AuthResult, TokenLifecycle, LoginButton, Glossary)
├── App.css              # All component styles (~3200 lines, organized by section)
├── index.css            # CSS custom properties, dark/light theme, global resets
└── components/
    ├── Hero.jsx            # Hero section with parallax orbs, token preview, stagger entrance
    ├── Navbar.jsx          # Fixed navbar with step tracking, search button, ambient toggle
    ├── ProgressBar.jsx     # Scroll progress indicator
    ├── ThemeToggle.jsx     # Dark/light theme toggle button
    ├── StepSection.jsx     # Reusable step wrapper with IntersectionObserver + counter animation
    ├── CodeBlock.jsx       # Mac-style code block with syntax highlighting and copy button
    ├── FlowDiagram.jsx     # Animated client ↔ server packet diagram
    ├── TokenBreakdown.jsx  # JWT token assembly animation (encode header → payload → signature)
    ├── RecapFlow.jsx       # Interactive 8-step recap explorer
    ├── JwtPlayground.jsx   # Build (real HMAC-SHA256) + Decode tabs for live JWT interaction
    ├── AttacksSection.jsx  # 4 JWT vulnerability cards with exploit code and prevention tips
    ├── CommandPalette.jsx  # Ctrl+K searchable jump bar across all sections
    ├── AmbientSound.jsx    # Web Audio API synthesised ambient drone toggle
    ├── Comparison.jsx      # JWT vs Session Auth comparison table
    ├── Quiz.jsx            # 10-question quiz with best score, explanations, certificate modal
    └── BackToTop.jsx       # Scroll-to-top floating button
```

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server (with HMR)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` or `↓` | Scroll to next step |
| `←` or `↑` | Scroll to previous step |
| `Ctrl+K` | Open command palette / jump bar |
| `Esc` | Close palette / return to top |

---

## CSS Theme Variables

The entire color system is driven by CSS custom properties defined in `index.css`. Switching themes is as simple as toggling `data-theme="light"` on `<html>`.

Key token colors used throughout for the JWT segments:

```css
--token-header:    #fb7185   /* red    — Header    */
--token-payload:   #c084fc   /* purple — Payload   */
--token-signature: #38bdf8   /* blue   — Signature */
```

---

## Author

Built by **Akitha Chanupama**, Full Stack Developer.


---

## What It Covers

The app walks through the complete JWT authentication lifecycle in 8 interactive steps:

| Step | Topic |
|------|-------|
| 01 | User Enters Credentials — animated typing input + login button simulation |
| 02 | Request Sent to Server — POST request with HTTPS info card |
| 03 | Server Validates Credentials — server → database → verified flow diagram |
| 04 | JWT Token Generated — interactive token breakdown (header, payload, signature) |
| 05 | Token Sent Back to Client — server response with Bearer token |
| 06 | Token Stored in Browser — tabbed localStorage / sessionStorage / HttpOnly Cookie comparison |
| 07 | Making Authenticated Requests — Authorization header usage with valid/invalid branching |
| 08 | Token Expiration & Security — lifecycle bar, refresh tokens, security best practices |

---

## Features

### Interactive Elements
- **Login Button Simulation** — click triggers spinner → checkmark → auto-scroll to Step 2
- **JWT Playground** — two-tab panel:
  - **Build tab** — edit name/email/role and watch the token update live; hover segments to highlight header/payload/signature; copy with one click
  - **Decode tab** — paste any JWT to see decoded header, payload, signature + expiry status
- **Storage Tabs** — switch between localStorage, sessionStorage, and HttpOnly Cookie examples
- **Auth Result Branching** — visual 200 OK vs 401 Unauthorized outcomes
- **Token Lifecycle Bar** — animated Created → Active → Expiring → Expired bar
- **RecapFlow** — inline 8-node step explorer with active state, detail card, and Previous/Next navigation

### Visual & UX
- **Hero Section** — staggered entrance animations, floating JWT token preview (hover to glow), blinking cursor on title, pulsing live badge, radial vignette, parallax orbs
- **Syntax Highlighting** — CodeBlock renders JSON/JS with color-coded keys, strings, numbers, booleans, comments, keywords — no external library
- **Glow Cards** — cursor spotlight effect + 3D tilt toward the mouse on hover
- **Glossary Tooltips** — hover on technical terms (Base64URL, HS256, HMAC, Bearer token, claims, HTTPS) for plain-English explanations
- **Animated Step Numbers** — count up from 00 → target when the section scrolls into view
- **Scroll Animations** — IntersectionObserver-driven stagger reveals on every section
- **Progress Bar** — fixed top reading progress indicator
- **Back to Top** — appears after scrolling, smooth return
- **Keyboard Navigation** — Arrow keys move between steps; Escape returns to top
- **Dark / Light Theme** — toggle with smooth transition, persists via CSS `data-theme`

### Knowledge Sections
- **Quiz** — 5-question multiple-choice quiz with per-question explanations and a score ring result screen
- **JWT vs Session Auth Comparison** — 6-row side-by-side table (state management, storage, scalability, mobile, revocation, request size)

---

## Tech Stack

| | |
|---|---|
| Framework | React 19.2 + Vite 8 |
| Styling | Pure CSS custom properties (no Tailwind, no CSS-in-JS) |
| Fonts | Inter (sans) + Fira Code (mono) via Google Fonts CDN |
| Animations | CSS keyframes + vanilla JS IntersectionObserver |
| Build | Vite 8, React Compiler (babel-plugin-react-compiler) |
| Linting | ESLint 9 with react-hooks + react-refresh plugins |

**No external UI or animation libraries.** Everything — syntax highlighting, tooltips, 3D tilt, token assembly, quiz, comparison table — is hand-built.

---

## Project Structure

```
src/
├── App.jsx              # Root: all 8 steps, inline components (TypedInput, StorageTabs,
│                        # AuthResult, TokenLifecycle, LoginButton, Glossary)
├── App.css              # All component styles (~2600 lines, organized by section)
├── index.css            # CSS custom properties, dark/light theme, global resets
└── components/
    ├── Hero.jsx          # Hero section with parallax orbs, token preview, stagger entrance
    ├── Navbar.jsx        # Fixed navbar with visited-step checkmarks and active tracking
    ├── ProgressBar.jsx   # Scroll progress indicator
    ├── ThemeToggle.jsx   # Dark/light theme toggle button
    ├── StepSection.jsx   # Reusable step wrapper with IntersectionObserver + counter animation
    ├── CodeBlock.jsx     # Mac-style code block with syntax highlighting and copy button
    ├── FlowDiagram.jsx   # Animated client ↔ server packet diagram
    ├── TokenBreakdown.jsx # JWT token assembly animation (encode header → payload → signature)
    ├── RecapFlow.jsx     # Interactive 8-step recap explorer
    ├── JwtPlayground.jsx # Build + Decode tabs for live JWT interaction
    ├── Comparison.jsx    # JWT vs Session Auth comparison table
    ├── Quiz.jsx          # 5-question interactive quiz with scoring
    └── BackToTop.jsx     # Scroll-to-top floating button
```

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start dev server (with HMR)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` or `↓` | Scroll to next step |
| `←` or `↑` | Scroll to previous step |
| `Esc` | Return to top |

---

## CSS Theme Variables

The entire color system is driven by CSS custom properties defined in `index.css`. Switching themes is as simple as toggling `data-theme="light"` on `<html>`.

Key token colors used throughout for the JWT segments:

```css
--token-header:    #fb7185   /* red   — Header  */
--token-payload:   #c084fc   /* purple — Payload */
--token-signature: #38bdf8   /* blue  — Signature */
```
