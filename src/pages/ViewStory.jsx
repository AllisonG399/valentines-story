import { useEffect, useState } from "react";
import { decodeData } from "../utils/encode";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

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
  
  const [currentScene, setCurrentScene] = useState(0);
  const [isView, setIsView] = useState(false);

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

  const storyScenes = card
  ? [
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

  return (
    <main className="view-message">

      {/* Hero */}
      <section className="hero view-hero">
        {card && timeLeft && (
            <div className="expiration-banner">
                💌 This message expires in {formatTime(timeLeft)}
            </div>
        )}

        <h2 className="hero-title">Your Love Letter</h2>
        <p className="hero-subtitle">
          Below is the Love Letter Interactive Story written for you. Click the envelope to
          open and read the message!
        </p>

        <div className="divider-heart">
          <div className="divider" />
          <span className="heart">♥</span>
          <div className="divider" />
        </div>

        {/* View Story Button */}
        <button onClick={() => setIsView(!isView)}>
          View Love Story
        </button> 

        {/* Story Preview */}
        <div className={`story-preview ${isView ? "show" : ""}`}>

          {/* Scene Progress Bar */}
          <div className="story-progress">
            {storyScenes.map((_, i) => (
              <div
                key={i}
                className={`progress-bar ${i <= currentScene ? "active" : ""}`}
              />
            ))}
          </div>

          {/* Scene Content */}
          <div className="story-scene">
            {storyScenes.length > 0 && (() => {
              const Scene = storyScenes[currentScene].component;
              const props = storyScenes[currentScene].props;
              return <Scene {...props} />;
            })()}
          </div>

          {/* Navigation */}
          <div className="story-controls">
            <button
              onClick={() =>
                setCurrentScene((prev) =>
                  Math.max(prev - 1, 0)
                )
              }
            >
              ←
            </button>

            <button
              onClick={() =>
                setCurrentScene((prev) =>
                  Math.min(prev + 1, storyScenes.length - 1)
                )
              }
            >
              →
            </button>
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
      </section>
    </main>
  );
}

