import { useEffect, useState } from "react";
import { decodeData } from "../utils/encode";
import Sparkles from "../components/animations/Sparkles";

export default function ViewMessage() {
  const [isOpen, setIsOpen] = useState(false);
  const [card, setCard] = useState(null);
  const [expired, setExpired] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const [enteredPasscode, setEnteredPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  const [timeLeft, setTimeLeft] = useState(null);

  const [showReveal, setShowReveal] = useState(false);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    try {
        const hash = window.location.hash;
        if (!hash.startsWith("#/vm/")) {
            setInvalid(true);
            return;
            }

            const encoded = hash.replace("#/vm/", "");

        if (!encoded) {
        setInvalid(true);
        return;
        }

        const decoded = decodeData(encoded);

        if (Date.now() > decoded.expiresAt) {
        setExpired(true);
        return;
        }

        setCard(decoded);

        // Start countdown
        const interval = setInterval(() => {
        const remaining = decoded.expiresAt - Date.now();

        if (remaining <= 0) {
            clearInterval(interval);
            setExpired(true);
        } else {
            setTimeLeft(remaining);
        }
        }, 1000);

        return () => clearInterval(interval);

    } catch (err) {
        console.error("Invalid card data", err);
        setInvalid(true);
    }
    }, []);

  // -------------------------
  // Invalid URL
  // -------------------------
  if (invalid) {
    return (
      <main className="view-message">
        <h2>Invalid Valentine Link 💔</h2>
        <p>This link appears to be corrupted or incomplete.</p>
      </main>
    );
  }

  // -------------------------
  // Expired Message
  // -------------------------
  if (expired) {
    return (
      <main className="view-message">
        <h2>This Valentine Has Expired 💔</h2>
        <p>The message is no longer available.</p>
      </main>
    );
  }

  // -------------------------
  // Passcode Gate
  // -------------------------
  if (card && card.passcode && !unlocked) {
    return (
      <main className="view-message">
        <header className="header">
          <h1 className="site-title">Valentines Story</h1>
          <div className="divider" />
        </header>

        <section className="hero view-hero passcode-hero">
          <h2 className="hero-title">This Card Is Locked 🔒</h2>
          <p className="hero-subtitle">
            Enter the passcode to reveal your Valentine.
          </p>
        </section>

        <div className="passcode-container">
          <input
            type="password"
            placeholder="Enter passcode"
            value={enteredPasscode}
            onChange={(e) => setEnteredPasscode(e.target.value)}
          />
          <button
            onClick={() => {
              if (enteredPasscode === card.passcode) {
                setUnlocked(true);
                
                // Start reveal sequence
                setShowReveal(true);
                
                setTimeout(() => {
                    setShowReveal(false); // remove overlay
                }, 6000); // 6 seconds for reveal animation
              }
            }}
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
      {/* Header */}
      <header className="header">
        <h1 className="site-title">Valentines Story</h1>
        <div className="divider" />
      </header>

      {/* Hero */}
      <section className="hero view-hero">
        {card && timeLeft && (
            <div className="expiration-banner">
                💌 This message expires in {formatTime(timeLeft)}
            </div>
        )}

        <h2 className="hero-title">Your Valentine Message</h2>
        <p className="hero-subtitle">
          Below is the valentine card written for you. Click the envelope to
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
                <p>You have a Valentine!</p>
            </div>
            <div className="envelope-back" 
                style={{ backgroundColor: card.color,
                    color: getContrastTextColor(card.color)
                }}> 
                <p className="envelope-back-from"><strong>From:</strong> {card.from}</p>
                <div className="envelope-back-stamp"/>
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
            >Send a Valentine Back!</button>
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