import { useEffect, useState } from "react";
import { decodeData } from "../utils/encode";

export default function ViewStory() {
  const [expired, setExpired] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  
  const [enteredPasscode, setEnteredPasscode] = useState("");
  const [unlocked, setUnlocked] = useState(false)

  const [currentScene, setCurrentScene] = useState(0);
  const [isView, setIsView] = useState(false);
  const storyScenes = [
    { id: "intro"},
    { id: "memories"},
    { id: "feelings"},
    { id: "favorite-thing"},
    { id: "not-said"}
  ];

  useEffect(() => {
    try {
        const hash = window.location.hash;
        if (!hash.startsWith("#/vs/")) {
            setInvalid(true);
            return;
            }

            const encoded = hash.replace("#/vs/", "");

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
        <h2>Invalid Love Letter Link 💔</h2>
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
        <h2>This Love Letter Has Expired 💔</h2>
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
          <h1 className="site-title">Love Letter</h1>
          <div className="divider" />
        </header>

        <section className="hero view-hero passcode-hero">
          <h2 className="hero-title">This Card Is Locked 🔒</h2>
          <p className="hero-subtitle">
            Enter the passcode to reveal your Love Letter.
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

  return (
    <main className="view-message">
      {/* Header */}
      <header className="header">
        <h1 className="site-title">Love Letter</h1>
        <div className="divider"/>
      </header>

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
            {currentScene === 0 && <IntroScene />}
            {currentScene === 1 && <MemoryScene />}
            {currentScene === 2 && <FeelScene />}
            {currentScene === 3 && <ThingsIDontSayScene />}
            {currentScene === 4 && <EndingScene />}
          </div>

          {/* Navigation */}
          <div className="story-controls">
            <button onClick={() => setCurrentScene(prev => prev - 1)}>←</button>
            <button onClick={() => setCurrentScene(prev => prev + 1)}>→</button>
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

