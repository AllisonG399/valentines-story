import { useState } from "react";

export default function ValentinesLanding() {
  const [reduceMotion, setReduceMotion] = useState(false);

  return (
    <main className={`landing ${reduceMotion ? "reduce-motion" : ""}`}>
      {/* Header */}
      <header className="header">
        <h1 className="site-title">Valentines Story</h1>
        <div className="divider" />
      </header>

      {/* Hero */}
      <section className="hero">
        <h2 className="hero-title">
          Send a Valentine they’ll actually keep.
        </h2>
        <p className="hero-subtitle">
          Choose a simple card or an interactive story to share something
          meaningful.
        </p>
        <span className="heart">♥</span>
      </section>

      {/* Card Selection */}
      <section className="card-options">
        <button className="card-option">
          <div className="icon envelope" />
          <h3>Static Card</h3>
          <p>A beautiful message, simply delivered.</p>
        </button>

        <button className="card-option featured">
          <div className="icon book" />
          <h3>Story Card</h3>
          <p>A guided, interactive love story.</p>
        </button>
      </section>

      {/* Floating Hearts */}
      {!reduceMotion && (
        <div className="floating-hearts">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="floating-heart">♥</span>
          ))}
        </div>
      )}

      {/* Accessibility */}
      <footer className="accessibility">
        <button
          className="accessibility-btn"
          onClick={() => setReduceMotion(!reduceMotion)}
        >
          ⚙ Accessibility Options
        </button>
      </footer>
    </main>
  );
}