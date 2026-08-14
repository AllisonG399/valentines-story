import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { decodeData } from "../utils/encode";

import Sparkles from "../components/animations/Sparkles";
import StoryCover from "../components/animations/StoryCover";
import stampImage from '../assets/icons/stamp.png';

import Intro from "../storyScenes/IntroScene";

export default function ViewStory() {
  const [card, setCard] = useState(null);

  const [expired, setExpired] = useState(false); // Card URL expired
  const [invalid, setInvalid] = useState(false); // Card URL does not exist

  // Password
  const [enteredPasscode, setEnteredPasscode] = useState(""); // Entered password
  const [showPasscode, setShowPasscode] = useState(false);    // Toggling passcode field visibility
  const [passcodeError, setPasscodeError] = useState("");     // Wrong password alert
  const [unlocked, setUnlocked] = useState(false);            // Toggling unlocking card

  const [timeLeft, setTimeLeft] = useState(null);
  const [expirationAnnouncement, setExpirationAnnouncement] = useState("");

  const [showReveal, setShowReveal] = useState(false);
  const [showCard, setShowCard] = useState(false);
  
  const [currentScene, setCurrentScene] = useState(0);
  const [isView, setIsView] = useState(false);
  const [isCoverAnimating, setIsCoverAnimating] = useState(false);

  useEffect(() => {
    try {
      const hash = window.location.hash;

      // Make sure the URL contains a message card route
      if (!hash.startsWith("#/vs/")) {
        setInvalid(true);
        return;
      }

      // Extract the encoded card data
      const encoded = hash.replace("#/vs/", "");

      if (!encoded) {
      setInvalid(true);
      return;
      }

      // Decode the card data
      const decoded = decodeData(encoded);

      // Make sure decoded data is valid
      if (!decoded || typeof decoded !== "object") {
        setInvalid(true);
        return;
      }

      // Make sure required card fields are valid
      if (
        typeof decoded.to !== "string" ||
        typeof decoded.message !== "string" ||
        typeof decoded.from !== "string" ||
        typeof decoded.passcode !== "string" ||
        typeof decoded.color !== "string" ||
        typeof decoded.sparkle !== "string"
      ) {
        setInvalid(true);
        return;
      }

      // Make sure the expiration timestamp is valid
      if (
        typeof decoded.expiresAt !== "number" ||
        !Number.isFinite(decoded.expiresAt)
      ) {
        setInvalid(true);
        return;
      }

      // Check whether the card has already expired
      if (Date.now() >= decoded.expiresAt) {
        setExpired(true);
        return;
      }

      // Store the decoded card
      setCard(decoded);

      // Set the initial countdown immediately
      const initialTimeLeft = decoded.expiresAt - Date.now();

      setTimeLeft(initialTimeLeft);
      setExpirationAnnouncement(
        `This Love Letter expires in ${formatTime(initialTimeLeft)}.`
      );

      // Update countdown every second
      const interval = setInterval(() => {
        const remaining = decoded.expiresAt - Date.now();

        if (remaining <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
          setExpired(true);
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      // Clean up interval when component unmounts
      return () => clearInterval(interval);

    } catch (err) {
        console.error("Invalid card data", err);
        setInvalid(true);
    }
  }, []);

  const handleUnlock = () => {
    if (enteredPasscode === card.passcode) {
      setPasscodeError("");
      setUnlocked(true);

      // Start reveal sequence
      setShowReveal(true);

      setTimeout(() => {
        setShowReveal(false);
      }, 6000);

      return;
    }

    setPasscodeError("Incorrect passcode. Please try again.");
  };

  // -------------------------
  // Invalid URL
  // -------------------------
  if (invalid) {
    return (
      <main className="view-message">
        <h1>
          Invalid Love Letter Link <span aria-hidden="true">💔</span>
        </h1>
        <p>
          This link appears to be corrupted, incomplete, or no longer valid.
          Please check that you have the complete link and try again.
        </p>
      </main>
    );
  }

  // -------------------------
  // Expired Message
  // -------------------------
  if (expired) {
    return (
      <main className="view-message">
        <h1>
          This Love Letter Has Expired <span aria-hidden="true">💔</span>
        </h1>
        <p>The message is no longer available because its expiration time has passed.</p>
      </main>
    );
  }

  // -------------------------
  // Passcode Gate
  // -------------------------
  if (card && card.passcode && !unlocked) {

    return (
      <main className="view-message">

        <section className="hero view-hero passcode-hero">

          <h1 className="hero-title">
            This Card Is Locked <span aria-hidden="true">🔒</span>
          </h1>

          <p className="hero-subtitle">
            Enter the passcode to reveal your Love Letter
          </p>
        </section>

        
        <form
          className="passcode-container"
          onSubmit={(event) => {
            event.preventDefault();
            handleUnlock();
          }}
        >
          

          <div className="passcode-input-wrapper">

            <label htmlFor="card-passcode" className="sr-only">
              Passcode
            </label>

            <input
              id="card-passcode"
              type={showPasscode ? "text" : "password"}
              placeholder="Enter passcode"
              value={enteredPasscode}
              onChange={(e) => {
                setEnteredPasscode(e.target.value);
                setPasscodeError("");
              }}
              aria-invalid={!!passcodeError}
              aria-describedby={passcodeError ? "passcode-error" : undefined}
              autoComplete="off"
            />

            <button
                type="button"
                className="passcode-toggle"
                onClick={() => setShowPasscode((previous) => !previous)}
                aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
              >
                <FontAwesomeIcon
                  icon={showPasscode ? faEyeSlash : faEye}
                  aria-hidden="true"
                />
              </button>
          </div>

          {passcodeError && (
            <p
              id="passcode-error"
              className="form-error"
              role="alert"
            >
              {passcodeError}
            </p>
          )}

          <button
            type="submit"
            className="generate-button"
          >
            Unlock
          </button>
        </form>
      </main>
    );
  }

  {/* Story Scenes to be displayed */}
  const storyScenes = card
  ? [
      {
        id: "reveal",
        component: StoryCover,
        props: {
          isOpen: isView,
          onComplete: () => setCurrentScene(1),
        },
      },
      {
        id: "intro",
        component: Intro,
        props: {
          to: card.to,
          from: card.from,
          message: card.message,
          sparkle: card.sparkle,
          color: card.color
        }
      }
    ]
  : [];

  {/* Handle love story navigation */}
  const handleStoryToggle = () => {
    if (isView) {
      // Reset
      setCurrentScene(0);
      setIsView(false);
      return;
    }

    // Begin
    setCurrentScene(0);
    setIsView(true);
  };

  return (
    <main className="view-message">

      {/* Hero */}
      <section className="hero view-hero">

        {/* Expiration Timer */}
        {card && timeLeft && (
          <>
            <div 
              className="expiration-banner"
              aria-hidden="true"
            >
              <span style={{ fontStyle: "normal" }}>💌</span> This message expires in {formatTime(timeLeft)}
            </div>

            {/* Screen reader announcement */}
            <p 
              className="sr-only"
              role="status"
            >
              {expirationAnnouncement}
            </p>
          </>
        )}

        {/* Header */}
        <h1 className="hero-title">
          Your Love Letter Message
        </h1>

        <p className="hero-subtitle">
          Below is the Love Letter Story Card written for you. Click the Begin button to
          start viewing your message!
        </p>

        <div 
          className="divider-heart"
          aria-hidden="true"
        >
          <div className="divider" />
          <span className="heart">♥</span>
          <div className="divider" />
        </div>
      </section>

      {/* Reveal Overlay */}
      {showReveal && card && (
        <div className="reveal-overlay">
          <div className="reveal-content">

            {/* Announcement */}
            <div className="reveal-message">
              <p role="status">
                You have a Love Letter!
              </p>
            </div>

            <div
              className="envelope-back"
              style={{
                backgroundColor: card.color,
                color: getContrastTextColor(card.color)
              }}
            >

              {/* From */}
              <p className="envelope-back-from">
                <strong>From:</strong> {card.from}
              </p>

              {/* Stamp */}
              <div
                className="envelope-back-stamp"
                style={{ backgroundImage: `url(${stampImage})` }}
                aria-hidden="true"
              />

              <p className="envelope-back-to">
                <strong>To:</strong> {card.to}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="story-nav-cont">

        {/* Back Arrow */}
        <button
          type="button"
          onClick={() =>
            setCurrentScene((prev) =>
              Math.max(prev - 1, 1)
            )
          }
          aria-label="Previous story scene"
          disabled={currentScene <= 1}
        >
          <span aria-hidden="true">←</span>
        </button>

        {/* View Story Button */}
        <button
          type="button"
          onClick={handleStoryToggle}
        >
          {isView ? "Reset" : "Begin Love Story"}
        </button>

        {/* Forward Arrow */}
        <button
          type="button"
          onClick={() =>
            setCurrentScene((prev) =>
              Math.min(prev + 1, storyScenes.length - 1)
            )
          }
          aria-label="Next story scene"
          disabled={
            currentScene === 0 ||
            currentScene === storyScenes.length - 1
          }
        >
          <span aria-hidden="true">→</span>
        </button>

      </div>

      {/* Scene Progress Bar */}
      <div 
        className="story-progress"
        aria-hidden="true"
      >
        {storyScenes.map((_, i) => (
          <div
            key={i}
            className={`progress-bar ${i <= currentScene ? "active" : ""}`}
          />
        ))}
      </div>

      {/* Screen Reader Status */}
      <p className="sr-only" role="status">
        Story scene {currentScene + 1} of {storyScenes.length}
      </p>

      {/* Story Preview */}
      <div
        className={`story-preview-view ${isView ? "show" : ""}`}
      >
        {/* Story */}
        <div
          className={`story-content ${
            isView ? "story-content-open" : ""
          }`}
        >
          <div
            className="story-scene"
            aria-label={`Story scene ${currentScene + 1}`}
            aria-hidden={!isView}
          >
            {storyScenes.length > 0 && (() => {
              const Scene = storyScenes[currentScene].component;
              const props = storyScenes[currentScene].props;

              return <Scene {...props} />;
            })()}
          </div>
        </div>

      </div>

      {/* Send a Card Back Button */}
      <div className="send-back-container">
          <button 
              type="button"
              className="send-back-btn"
              onClick={() => window.location.hash = '#/'}
          >Send a Love Letter Back!</button>
      </div>
      
    </main>
  );
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
}

function getContrastTextColor(hex) {
  const cleaned = hex.replace("#", "");

  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);

  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 155
    ? "var(--text-primary)"   // dark text
    : "var(--white-linen)";   // light text
};