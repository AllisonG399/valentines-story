import { useState, useEffect } from "react";
import envelopeIcon from '../assets/icons/valentine_envelope.png';
import storyBookIcon from '../assets/icons/valentine_card.png';
import { FullScreenHearts } from "../components/animations/FullScreenHearts";
import { MainHearts } from "../components/animations/MainHearts";

export default function ValentinesLanding() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [stage, setStage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);

    useEffect(() => {
  const timers = [];

  timers.push(setTimeout(() => setStage(1), 2000));  // show subtitle
  timers.push(setTimeout(() => setStage(2), 3000));  // show hearts

  // Start fade out at 9s
  timers.push(setTimeout(() => setFadeOut(true), 9000)); 

  // After fade-out duration (1s), remove intro and show main page
  timers.push(setTimeout(() => {
    setStage(3);
    setIntroVisible(false);
  }, 10000)); 

  return () => timers.forEach(t => clearTimeout(t));
}, []);

  return (
    <main className={`landing ${reduceMotion ? "reduce-motion" : ""}`}>
      
        {/* --- Intro Animation --- */}
            {introVisible && (
            <div className={`intro ${stage === 2 ? "hearts" : ""} ${fadeOut ? "fade-out" : ""}`}>
                <h1 className={`title ${stage > 0 ? "small" : ""}`}>Valentines Story</h1>

                {stage >= 1 && <h2 className="subtitle">Send a Valentine they’ll actually keep</h2>}

                {stage === 2 && !reduceMotion && <FullScreenHearts />}
            </div>
        )}

      {/* --- Main Page --- */}
      {stage === 3 && (
        <>
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
            <div className="divider-heart">
                <div className="divider" />
                <span className="heart">♥</span>
                <div className="divider" />
            </div>
          </section>

          {/* Card Selection */}
          <section className="card-options">
            <button className="card-option"
                onClick={() => window.location.hash = '#/create/message'}
            >
                <img
                    src={envelopeIcon}
                    alt="Envelope with heart icon"
                    className="icon"
                />    
                <h3>Static Card</h3>
                <p>A beautiful message, simply delivered.</p>
            </button>

            <button className="card-option featured"
                onClick={() => window.location.hash = '#/create/story'}
            >
                <img
                    src={storyBookIcon}
                    alt="Open story book with stars icon"
                    className="icon"
                />
              <h3>Story Card</h3>
              <p>A guided, interactive love story.</p>
            </button>
          </section>

            {!reduceMotion && <MainHearts />}

          
        </>
      )}
    </main>
  );
}