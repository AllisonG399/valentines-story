import { useState, useEffect } from 'react';
import { encodeData } from '../utils/encode';
import Sparkles from "../components/animations/Sparkles";

const initialForm = {
  to: "",
  message: "",
  from: "",
  passcode: "",
  color: "#F8C8DC",
  sparkle: "hearts",
  expiration: "1",
};

export default function CreateMessage({
  setHasUnsavedChanges,
}) {

  const [form, setForm] = useState(initialForm);

  const [isPreviewing, setIsPreviewing] = useState(false);
  const [error, setError] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const updateForm = (field, value) => {
    setForm((previous) => ({
        ...previous,
        [field]: value,
    }));

    // The previously generated link no longer represents
    // the current form data.
    setGeneratedLink("");
  };


  const envelopeColors = [
    { name: "Soft Pink", value: "#F8C8DC" }, // light
    { name: "Blush", value: "#D8A7B1" }, // light
    { name: "Rose", value: "#E75480" }, // light
    { name: "Burgundy", value: "#9C1B30" }, // dark
    { name: "Milano Red", value: "#ac050a" }, // dark
    { name: "Moss Green", value: "#c7e4bf"}, // light
    { name: "Norway", value: "#97b98d"}, // light
    { name: "Woodland", value: "#35552c"}, // dark
    { name: "Powder Blue", value: "#bcdce8"}, // light
    { name: "Glacier", value: "#79b1c7"}, // light
    { name: "Elm", value: "#20647e"}, // dark
    { name: "Nobel", value: "#b6b6b6"}, // light
    { name: "Corduroy", value: "#5e5f5e"}, // dark
    { name: "Heavy Metal", value: "#333432"}, // dark
  ];

  const sparkleOptions = [
    { name: "Hearts", value: "hearts", icon: "❤️" },
    { name: "Black Heart", value: "black-heart", icon: "🖤" },
    { name: "Heart Emoji", value: "heart-emoji", icon: "😍" },
    { name: "Kiss Emoji", value: "kiss-emoji", icon: "😘" },
    { name: "Skulls", value: "skulls", icon: "💀" },
    { name: "Taco", value: "taco", icon: "🌮" },
    { name: "Pizza", value: "pizza", icon: "🍕" },
    { name: "Sushi", value: "sushi", icon: "🍣" },
    { name: "Cookie", value: "cookie", icon: "🍪" },
    { name: "Book", value: "book", icon: "📖" },
    { name: "Heart Envelope", value: "heart-envelope", icon: "💌" },
    { name: "Flowers", value: "flowers", icon: "🌹" },
    { name: "Stars", value: "stars", icon: "✨" },
  ];

  // Determine whether the current form differs from the untouched form
  const hasChanges = JSON.stringify(form) !== JSON.stringify(initialForm);

  // Tell APP whether this page currently has unsaved work
  useEffect(() => {
    setHasUnsavedChanges(hasChanges);

    return () => {
      setHasUnsavedChanges(false);
    };
  }, [
    hasChanges,
    setHasUnsavedChanges,
  ]);

  // Generate Card
  const handleGenerate = (e) => {
    e.preventDefault(); // prevent page refresh

    if (!to.trim() || !message.trim() || !from.trim() || !passcode.trim()) {
      setError("Please fill out all required fields.");
      e.preventDefault(); // prevent page refresh
      return;
    }

    if (passcode.length < 4) {
      setError("Passcode must be at least 4 characters.");
      e.preventDefault(); // prevent page refresh
      return;
    }

    setError("");  

    const now = Date.now();

    const expirationMap = {
      "1": 24 * 60 * 60 * 1000,
      "3": 3 * 24 * 60 * 60 * 1000,
      "7": 7 * 24 * 60 * 60 * 1000,
    };

    const expiresAt = now + expirationMap[form.expiration];

    const payload = {
      to: form.to,
      message: form.message,
      from: form.from,
      passcode: form.passcode,
      color: form.color,
      sparkle: form.sparkle,
      expiresAt,
    };

    const encoded = encodeData(payload);

    const link = `${window.location.origin}/#/vm/${encoded}`;
    setGeneratedLink(link);

    // Card has been successfully generated, so leaving the page does not count as losing unsaved work
    setHasUnsavedChanges(false);
    setShowConfirmModal(false);
  };



  return (
    <main className="create-message">

        {/* Header */}
        <header className="header">

          <h1 className="site-title">
            Valentines Story
          </h1>

          <div className="divider" />
        </header>

        {/* Hero */}
          <section className="hero">

            <h2 className="hero-title">
              Write a Message to Your Valentine
            </h2>

            <p className="hero-subtitle">
              Fill in the fields below to create a personalized Valentines card. 
              Once completed, click the button "Generate Card" to receive your customized card link to share with your Valentine.
              Preview the card and animation by clicking the "Preview Animation" button below.
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

        <section className="message-container">

          {/* Form */}
          <form 
            className="form-container" 
            onSubmit={(e) => {
              e.preventDefault();
              setShowConfirmModal(true);
            }}
          >

            <h3 className="static-card">
              Static Card
            </h3>

            <div className="divider" aria-hidden="true"/>

            {/* To */}
            <label htmlFor="recipient">
              To:
            </label>

            <input
              id="recipient"
              type="text"
              value={form.to}
              onChange={(e) => 
                updateForm(
                  "to",
                  e.target.value
                )
              }
              placeholder="Your Valentine's Name"
              required
            />

            {/* Message */}
            <label htmlFor="message">
              Message:
            </label>

            <textarea
              id="message"
              value={form.message}
              onChange={(e) => 
                updateForm(
                  "message",
                  e.target.value
                )
              }
              placeholder="Write your heartfelt message here..."
              required
            />

            {/* From */}
            <label htmlFor="sender">
              From:
            </label>

            <input
              id="sender"
              type="text"
              value={form.from}
              onChange={(e) => 
                updateForm(
                  "from",
                  e.target.value
                )
              }
              placeholder="Your Name"
              required
            />

            {/* Passcode */}
            <label htmlFor="passcode">
              Passcode:
            </label>

            <input 
              id="passcode"
              type="text"
              value={form.passcode}
              onChange={(e) => 
                updateForm(
                  "passcode",
                  e.target.value
                )
              }
              placeholder="Passcode to view card"
              required
            />

            {/* Expiration */}
            <fieldset className="expiration-group">

              <legend className="expiration-label">
                Expiration:
              </legend>

              {["1","3","7"].map((val) => (

                <label 
                  key={val} 
                  className="expiration-option"
                >

                  <span className="expiration-text">
                    {val === "1" ? "24 Hours" : val === "3" ? "3 Days" : "7 Days"}
                  </span>

                  <input 
                    type="radio" 
                    name="expirationTime" 
                    value={val} 
                    checked={form.expiration === val} 
                    onChange={(e) => 
                      updateForm(
                        "expiration",
                        e.target.value
                      )
                    } 
                  />

                  <span className="custom-radio" aria-hidden="true"/>
                </label>
              ))}
            </fieldset>

            {/* Envelope Color */}
            <fieldset>

              <legend className="expiration-label">
                Envelope Color:
              </legend>

              <div className="color-picker">
                {envelopeColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`color-swatch ${form.color === color.value ? "selected" : ""}`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => 
                      updateForm(
                        "color",
                        color.value
                      )
                    }
                    title={color.name}
                    aria-label={`Choose ${color.name} envelope`}
                    aria-pressed={form.color === color.value}
                  />
                ))}
              </div>
            </fieldset>
            
            {/* Sparkle Animation */}
            <fieldset>

              <legend className="expiration-label">
                Sparkle Animation:
              </legend>

              <div className="sparkle-picker">

                {sparkleOptions.map((option) => (

                  <button
                    key={option.value}
                    type="button"
                    className={`sparkle-swatch ${form.sparkle === option.value ? "selected" : ""}`}
                    onClick={() => 
                      updateForm(
                        "sparkle",
                        option.value
                      )
                    }
                    title={option.name}
                    aria-label={`Choose ${option.name} animation`}
                    aria-pressed={form.sparkle === option.value}
                  >
                    {option.icon}
                  </button>
                ))}                  
              </div>
            </fieldset>

            {/* Generate Button */}
            <button
              type="submit"
              onClick={() => setShowConfirmModal(true)}
            >
              Generate Card
            </button>

            {/* Error */}
            {error && 
              <div 
                className="form-error" 
                role="alert"
              >
                {error}
              </div>
            }

            {/* Generated Link */}
            {generatedLink && (
              <div className="generated-link-container">
                <p>
                  Your Valentine link is ready 💌
                </p>

                <label htmlFor="generated-link">
                  Your card link
                </label>

                <input
                  id="generated-link"
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="generated-link"
                />

                <div className="link-actions">

                  {/* Copy Link */}
                  <button
                    type="button"
                    onClick={() => 
                      navigator.clipboard.writeText(
                        generatedLink
                      )
                    }
                  >
                    Copy Link
                  </button>

                  {/* Open Card */}
                  <button
                    type="button"
                    onClick={() => 
                      window.location.href = generatedLink
                    }
                  >
                    Open Card
                  </button>
                </div>
              </div>
            )}

            {/* Generate Confirmation */}
            {showConfirmModal && (

              <div 
                className="confirm-overlay"
                role="presentation"
              >

                <div 
                  className="confirm-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="generate-title"
                  aria-describedby="generate-description"
                >

                  <div
                    className="confirm-heart"
                    aria-hidden="true"
                  >
                    💌
                  </div>

                  <h3 id="generate-title">
                    Ready to generate your Love Letter?
                  </h3>

                  <p id="generate-description">
                    Once generated, you'll receive a special link to share with your
                    Valentine.
                  </p>

                  <div className="confirm-actions">

                    {/* Back Button */}
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setShowConfirmModal(false)}
                    >
                      Go Back
                    </button>

                    {/* Generate Card Button */}
                    <button
                      type="button"
                      className="confirm-btn"
                      onClick={(e) => {
                        setShowConfirmModal(false);
                        handleGenerate(e);
                      }}
                    >
                      Generate Card
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Preview */}
          <div className="preview-container">

            <h3 className="static-card">
              Card Preview
            </h3>

            <div className="divider" aria-hidden="true"/>

            <CardPreview
              to={form.to}
              from={form.from}
              message={form.message}
              color={form.color}
              sparkle={form.sparkle}
              isPreviewing={isPreviewing}
            />

            {/* Preview Animation Button */}
            <button 
              type="button"
              onClick={() => setIsPreviewing(!isPreviewing)}
            >
              Preview Animation
            </button>
          </div>
        </section>

        
    </main>
  );
}

// ------------------------
// Card Preview Component
// ------------------------
function CardPreview({ to, from, message, color, sparkle, isPreviewing }) {
  return (
    <div className={`envelope-wrapper-view ${isPreviewing ? "open" : ""}`}>
      <div className={`envelope-view ${isPreviewing ? "open" : ""}`}>

        <div className="envelope-flap" style={{ backgroundColor: lightenColor(color, 5) }} />
        <div className="envelope-flap-back" style={{ backgroundColor: darkenColor(color, 5) }} />
        <div className="envelope-body" style={{ backgroundColor: color }} />

        {/* Sparkles go here */}
        {isPreviewing && sparkle && <Sparkles type={sparkle} />}

        <div className={`letter ${isPreviewing ? "show-letter" : ""}`}>
          <p>Dear {to || "Valentine"},</p>
          <p>{message || "Write your message here..."}</p>
          <p>Sincerely, {from || "You"}</p>
        </div>
      </div>
    </div>
  );
}

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