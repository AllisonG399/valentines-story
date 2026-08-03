import { useState, useRef, useEffect } from "react";
import envelopeIcon from '../assets/icons/valentine_envelope.png';
import storyBookIcon from '../assets/icons/valentine_card.png';
import { FullScreenHearts } from "../components/animations/FullScreenHearts";
import { MainHearts } from "../components/animations/MainHearts";

export default function ValentinesLanding() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [stage, setStage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);

  // Intro Animation
  const timersRef = useRef([]);
  useEffect(() => {
    timersRef.current = [
      setTimeout(() => setStage(1), 2000), // show subtitle
      setTimeout(() => setStage(2), 3000), // show hearts

      // Start fade out at 9s
      setTimeout(() => setFadeOut(true), 9000),

      // After fade-out duration (1s), remove intro and show main page
      setTimeout(() => {
        setStage(3);
        setIntroVisible(false);
      }, 10000)
    ];

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Intro Animation Click Handler
  const skipIntro = () => {
    timersRef.current.forEach(clearTimeout);

    setFadeOut(true);

    setTimeout(() => {
      setStage(3);
      setIntroVisible(false);
    }, 1000);
  };

  return (
    <main className={`landing ${reduceMotion ? "reduce-motion" : ""}`}>
      
      {/* --- Intro Animation --- */}
      {introVisible && (
        <div
          className={`intro ${stage === 2 ? "hearts" : ""} ${fadeOut ? "fade-out" : ""}`}
        >
          {/* Intro Title */}
          <h1 className={`title ${stage > 0 ? "small" : ""}`}>
            Love Letter
          </h1>

          {stage >= 1 && (
            <p className="subtitle">
              Send a Love Letter they'll actually keep
            </p>
          )}

          {/* Heart Animation */}
          {stage === 2 && !reduceMotion && <FullScreenHearts />}

          {/* Skip Animation Button */}
          <button
            type="button"
            className="skip-intro"
            onClick={skipIntro}
            aria-label="Skip animation introduction and continue to Love Letter"
          >
            Skip Intro
          </button>

        </div>
      )}

      {/* --- Main Page --- */}
      {stage === 3 && (
        <>
          {/* Header */}
          <header className="header">
            <h1 className="site-title">Love Letter</h1>
            <div className="divider" />
          </header>

          {/* Hero */}
          <section className="hero">

            <h2 className="hero-title">
              Send a Love Letter they will actually keep.
            </h2>

            <p className="hero-subtitle">
              Choose a simple card or an interactive story to share something
              meaningful.
            </p>

            <div className="divider-heart" aria-hidden="true">
              <div className="divider" />
              <span className="heart">♥</span>
              <div className="divider" />
            </div>
          </section>

          {/* Card Selection */}
          <section className="card-options">

            {/* Static Card Option */}
            <button 
              type="button"
              className="card-option"
              onClick={() => window.location.hash = '#/create/message'}
              aria-label="Create a Static Card: A beautiful message, simply delivered"
            >
              <img
                src={envelopeIcon}
                alt=""
                className="icon"
                aria-hidden="true"
              /> 

              <h3>Static Card</h3>

              <p>A beautiful message, simply delivered.</p>
            </button>

            {/* Story Card Option */}
            <button 
              type="button"
              className="card-option featured"
              onClick={() => window.location.hash = '#/create/story'}
              aria-label="Create a Story Card: A guided, interactive love story"
            >
              <img
                src={storyBookIcon}
                alt=""
                className="icon"
                aria-hidden="true"
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