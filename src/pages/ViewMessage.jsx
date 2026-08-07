import { useEffect, useState } from "react";
import { decodeData } from "../utils/encode";
import Sparkles from "../components/animations/Sparkles";
import stampImage from '../assets/icons/stamp.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function ViewMessage() {
  const [isOpen, setIsOpen] = useState(false);
  const [card, setCard] = useState(null);

  const [expired, setExpired] = useState(false);  // Card URL expired
  const [invalid, setInvalid] = useState(false);  // Card URL does not exist

  // Password
  const [enteredPasscode, setEnteredPasscode] = useState(""); // Entered password
  const [showPasscode, setShowPasscode] = useState(false);    // Toggling passcode field visibility
  const [passcodeError, setPasscodeError] = useState("");     // Wrong password alert
  const [unlocked, setUnlocked] = useState(false);            // Toggling unlocking card

  const [timeLeft, setTimeLeft] = useState(null);

  const [showReveal, setShowReveal] = useState(false);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    try {
      const hash = window.location.hash;

      // Make sure the URL contains a message card route
      if (!hash.startsWith("#/vm/")) {
        setInvalid(true);
        return;
      }

      // Extract the encoded card data
      const encoded = hash.replace("#/vm/", "");

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
      setTimeLeft(decoded.expiresAt - Date.now());

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
      console.error("Invalid card data:", err);
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
        <h2>
          Invalid Love Letter Link 💔
        </h2>
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
        <h2>This Love Letter Has Expired 💔</h2>
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

          <h2 className="hero-title">
            This Card Is Locked 🔒
          </h2>

          <p className="hero-subtitle">
            Enter the passcode to reveal your Love Letter
          </p>
        </section>

        <div className="passcode-container">

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
            type="button"
            className="generate-button"
            onClick={handleUnlock}
          >
            Unlock
          </button>
        </div>
      </main>
    );
  }

  // -------------------------
  // Main Card View
  // -------------------------
  return (

    <main className="view-message">

      {/* Hero */}
      <section className="hero view-hero">
        {card && timeLeft && (
            <div className="expiration-banner">
                💌 This message expires in {formatTime(timeLeft)}
            </div>
        )}

        <h2 className="hero-title">Your Love Letter Message</h2>
        <p className="hero-subtitle">
          Below is the Love Letter written for you. Click the envelope to
          open and read the message!
        </p>

        <div className="divider-heart">
          <div className="divider" />
          <span className="heart">♥</span>
          <div className="divider" />
        </div>
      </section>

      {/* Reveal Overlay */}
      {showReveal && card && (
        <div className="reveal-overlay">
            <div className="reveal-message">
                <p>You have a Love Letter!</p>
            </div>
            <div className="envelope-back" 
                style={{ backgroundColor: card.color,
                    color: getContrastTextColor(card.color)
                }}> 
                <p className="envelope-back-from"><strong>From:</strong> {card.from}</p>
                <div
                  className="envelope-back-stamp"
                  style={{ backgroundImage: `url(${stampImage})` }}
                ></div>
                <p className="envelope-back-to"><strong>To:</strong> {card.to}</p>
            </div>
        </div>
      )}

      {/* Envelope */}
      {card && (
        <section className="message-display">
          <div
            className="envelope-wrapper"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className={`envelope ${isOpen ? "open" : ""}`}>

              <div
                className="envelope-flap"
                style={{ backgroundColor: lightenColor(card.color, 5) }}
              />
              <div
                className="envelope-flap-back"
                style={{ backgroundColor: darkenColor(card.color, 5) }}
              />
              <div
                className="envelope-body"
                style={{ backgroundColor: card.color }}
              />

              {/* Sparkles */}
              {isOpen && card.sparkle && (
                <Sparkles type={card.sparkle} />
              )}

              <div className={`letter ${isOpen ? "show-letter" : ""}`}>
                <p>Dear {card.to},</p>
                <p>{card.message}</p>
                <p>Sincerely, {card.from}</p>
              </div>
            </div>
          </div>
        </section>
        )}

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


// ------------------------------------
// Color Helpers (same as Create page)
// ------------------------------------

function lightenColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);

  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

function darkenColor(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);

  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 0 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
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