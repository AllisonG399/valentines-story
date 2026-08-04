import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

import envelopeIcon from '../assets/icons/valentine_envelope.png';
import storyBookIcon from '../assets/icons/valentine_card.png';

import { FullScreenHearts } from "../components/animations/FullScreenHearts";
import { MainHearts } from "../components/animations/MainHearts";

export default function ValentinesLanding() {
  const [stage, setStage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);

  // Detect user's operating system reduced-motion preference
  const reduceMotion = useReducedMotion();

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

  // Main Page Animation
  const heroContainer = {
    hidden: reduceMotion
      ? { opacity: 1 }
      : { opacity: 0 },
    visible: {
      opacity: 1,

      transition: reduceMotion
        ? { duration: 0 }
        : {
          staggerChildren: 0.15,
          delayChildren: 0.1,
        },
    },
  };

  const heroItem = {
    hidden: reduceMotion 
      ? { opacity: 1 }
      : {
        opacity: 0,
        y: 25,
      },
    visible: {
      opacity: 1,
      y: 0,

      transition: reduceMotion
        ? { duration: 0 }
        : { 
          duration: 0.65,
          ease: "easeOut",
        },
    },
  };

  const cardContainer = {
    hidden: reduceMotion
      ? { opacity: 1 }
      : { opacity: 0 },
    
    visible: {
      opacity: 1,

      transition: reduceMotion
        ? { duration: 0 }
        : {
          delayChildren: 0.15,
          staggerChildren: 0.18,
        },
    }
  };

  const cardItem = {
    hidden: reduceMotion
      ? { opacity: 1 }
      : {
        opacity: 0,
        y: 35,
      },

    visible: {
      opacity: 1,
      y: 0,

      transition: reduceMotion
        ? { duration: 0 }
        : {
          duration: 0.7,
          ease: "easeOut",
        },
    },
  };  

  return (
    <main className={`landing`}>
      
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
          {stage === 2 && <FullScreenHearts />}

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

          {/* Hero */}
          <motion.section 
            className="hero"
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >

            <motion.h2 
              className="hero-title"
              variants={heroItem}
            >
              Send a Love Letter they will actually keep.
            </motion.h2>

            <motion.p 
              className="hero-subtitle"
              variants={heroItem}
            >
              Choose a simple card or an interactive story to share something
              meaningful.
            </motion.p>

            <motion.div 
              className="divider-heart" 
              aria-hidden="true"
              variants={heroItem}
            >
              <div className="divider" />
              <span className="heart">♥</span>
              <div className="divider" />
            </motion.div>
          </motion.section>

          {/* Card Selection */}
          <motion.section 
            className="card-options"
            variants={cardContainer}
            initial="hidden"
            animate="visible"
            aria-label="Choose a Love Letter type"
          >

            {/* Static Card Option */}
            <motion.button 
              type="button"
              className="card-option"
              variants={cardItem}
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
            </motion.button>

            {/* Story Card Option */}
            <motion.button 
              type="button"
              className="card-option featured"
              variants={cardItem}
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
            </motion.button>
          </motion.section>

          {<MainHearts />}

        </>
      )}
    </main>
  );
}