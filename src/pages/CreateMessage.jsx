import { useState, useEffect, useRef } from 'react';
import { encodeData } from '../utils/encode';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
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
  const [showPasscode, setShowPasscode] = useState(false);

  const [isPreviewing, setIsPreviewing] = useState(false);

  const confirmCancelRef = useRef(null);
  const confirmModalRef = useRef(null);
  const wasModalOpenRef = useRef(false);
  const generateButtonRef = useRef(null);
  const copyLinkButtonRef = useRef(null);

  const [error, setError] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [linkCopied, setLinkCopied] = useState(false);
  

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    // The previously generated link no longer represents the current form data.
    setGeneratedLink("");
  };


  // Envelope Colors
  const envelopeColors = [
    { name: "Soft Pink", value: "#F8C8DC" },
    { name: "Blush", value: "#D8A7B1" },
    { name: "Rose", value: "#E75480" }, 
    { name: "Burgundy", value: "#9C1B30" }, 
    { name: "Milano Red", value: "#ac050a" },
    { name: "Moss Green", value: "#c7e4bf"}, 
    { name: "Norway", value: "#97b98d"}, 
    { name: "Woodland", value: "#35552c"}, 
    { name: "Powder Blue", value: "#bcdce8"}, 
    { name: "Glacier", value: "#79b1c7"}, 
    { name: "Elm", value: "#20647e"}, 
    { name: "Nobel", value: "#b6b6b6"}, 
    { name: "Corduroy", value: "#5e5f5e"}, 
    { name: "Heavy Metal", value: "#333432"}, 
  ];

  // Sparkle Options
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

  // Validate form 
  const validateForm = () => {
    setError("");

    const trimmedTo = form.to.trim();
    const trimmedMessage = form.message.trim();
    const trimmedFrom = form.from.trim();
    const trimmedPasscode = form.passcode.trim();

    // Required fields
    if (!trimmedTo || !trimmedMessage || !trimmedFrom || !trimmedPasscode) {
      setError("Please fill out all required fields.");
      return false;
    }

    // Passcode requirements
    if (trimmedPasscode.length < 4) {
      setError("Passcode must be at least 4 characters.");
      return false;
    }

    // Expiration requirements
    if (!["1", "3", "7"].includes(form.expiration)) {
      setError("Please select an expiration time.");
      return false;
    }

    return true;
  };

  // Validate form prior to showing the generate modal
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setShowConfirmModal(true);
  };

  // Handle Generating the Link
  const handleGenerate = () => {
    setError("");

    // Set expiration timer
    const expirationMap = {
      "1": 24 * 60 * 60 * 1000,
      "3": 3 * 24 * 60 * 60 * 1000,
      "7": 7 * 24 * 60 * 60 * 1000,
    };

    const expiresAt = Date.now() + expirationMap[form.expiration];

    const payload = {
      to: form.to.trim(),
      message: form.message.trim(),
      from: form.from.trim(),
      passcode: form.passcode.trim(),
      color: form.color,
      sparkle: form.sparkle,
      expiresAt,
    };

    // Encode and create link
    const encoded = encodeData(payload);

    const link = `${window.location.origin}/#/vm/${encoded}`;

    setGeneratedLink(link);

    // Reset form after successful generation
    setForm(initialForm);

    // Reset copy status
    setLinkCopied(false);

    // Generation was successful
    setHasUnsavedChanges(false);
    setShowConfirmModal(false);
  };

  // Set Modal focus
  useEffect(() => {

    // Modal is opening
    if (showConfirmModal) {
      wasModalOpenRef.current = true;

      // Move focus into the modal
      confirmCancelRef.current?.focus();

      const originalOverflow = document.body.style.overflow;

      // Prevent background scrolling
      document.body.style.overflow = "hidden";

      const handleKeyDown = (event) => {
        // Escape closes modal
        if (event.key === "Escape") {
          event.preventDefault();
          setShowConfirmModal(false);
          return;
        }

        // Trap Tab inside modal
        if (event.key === "Tab") {
          const modal = confirmModalRef.current;

          if (!modal) {
            return;
          }

          const focusableElements = modal.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
          );

          if (focusableElements.length === 0) {
            event.preventDefault();
            return;
          }

          const firstElement = focusableElements[0];
          const lastElement =
            focusableElements[focusableElements.length - 1];

          if (
            event.shiftKey &&
            document.activeElement === firstElement
          ) {
            event.preventDefault();
            lastElement.focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === lastElement
          ) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        document.removeEventListener("keydown", handleKeyDown);
      };
    }

    // Modal has just closed
    if (wasModalOpenRef.current) {
      wasModalOpenRef.current = false;

      // Return focus to the button that opened the modal
      generateButtonRef.current?.focus();
    }
  }, [showConfirmModal]);

  // Copy Link Verification
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);

      setLinkCopied(true);

      setTimeout(() => {
        setLinkCopied(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  // Focus Copy Link after successful generation
  useEffect(() => {
    if (!generatedLink) {
      return;
    }

    copyLinkButtonRef.current?.focus();
  }, [generatedLink]);


  return (
    <main className="create-message">

      {/* Hero */}
      <section className="hero">

        <h1 className="hero-title">
          Write a Message to Your Loved One
        </h1>

        <p className="hero-subtitle">
          Fill in the fields below to create a personalized Love Letter card. 
          Preview your card and animation, then generate a shareable link when you're ready.
          Share the link and passcode with your recipient so they can view the card.
        </p>

        <div 
          className="divider-heart-card"
          aria-hidden="true"
        >
          <div className="divider-card" />
          <span className="card-heart">♥</span>
          <div className="divider-card" />
        </div>
      </section>

      <section className="message-container">

        {/* Form */}
        <form 
          className="form-container" 
          onSubmit={handleSubmit}
          aria-labelledby="static-card-title"
        >

          <h2 
            id="static-card-title"
            className="static-card"
          >
            Static Card
          </h2>

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
            placeholder="Recipient's Name"
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

          <div className="passcode-input-wrapper">
            <input 
              id="passcode"
              type={showPasscode ? "text" : "password"}
              value={form.passcode}
              onChange={(e) => 
                updateForm(
                  "passcode",
                  e.target.value
                )
              }
              placeholder="Passcode for recipient to view card"
              required
              minLength={4}
            />

            <button
              type="button"
              className="passcode-toggle"
              onClick={() => setShowPasscode((previous) => !previous)}
              aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
              aria-pressed={showPasscode}
            >
              <FontAwesomeIcon
                icon={showPasscode ? faEyeSlash : faEye}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* Expiration */}
          <fieldset className="expiration-fieldset">

            <legend className="expiration-label">
              Expiration:
            </legend>

            <div className="expiration-group">
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
            </div>
          </fieldset>

          {/* Envelope Color */}
          <fieldset className="expiration-fieldset">

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
                  aria-label={`Choose ${color.name} envelope`}
                  aria-pressed={form.color === color.value}
                />
              ))}
            </div>
          </fieldset>
          
          {/* Sparkle Animation */}
          <fieldset className="expiration-fieldset">

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

          <div className="divider" aria-hidden="true"/>

          {/* Generate Button */}
          <div className="generate-button-cont">
            
            <button
              ref={generateButtonRef}
              className="generate-button"
              type="submit"
            >
              Generate Card
            </button>
          </div>

          {/* Error */}
          {error && 
            <div 
              id="form-error"
              className="form-error" 
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          }

          {/* Generated Link */}
          {generatedLink && (

            <div className="generated-link-container">

              <h3 className="generated-link-title">
                Your Love Letter link is ready 💌
              </h3>

              <p className="generated-link-description">
                Share the link and passcode with your recipient to view the card.
              </p>

              <label 
                className="generated-link-label"
                htmlFor="generated-link"
              >
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
                  ref={copyLinkButtonRef}
                  type="button"
                  onClick={handleCopyLink}
                  aria-label={linkCopied ? "Link copied" : "Copy card link"}
                >
                  {linkCopied ? "Copied! ✓" : "Copy Link"}
                </button>

                {/* Open Card */}
                <button
                  type="button"
                  onClick={() => {
                    window.open(generatedLink, "_blank", "noopener,noreferrer");
                  }}
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
                ref={confirmModalRef}
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

                <h2 id="generate-title">
                  Ready to generate your Love Letter?
                </h2>

                <p id="generate-description">
                  Once generated, you'll receive a special link to share with your
                  loved one.
                </p>

                <div className="confirm-actions">

                  {/* Back Button */}
                  <button
                    ref={confirmCancelRef}
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
                    onClick={handleGenerate}
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

          {/* Preview Header */}
          <h2 className="static-card">
            Card Preview
          </h2>

          <div className="divider" aria-hidden="true"/>

          {/* Preview Animation */}
          <CardPreview
            to={form.to}
            from={form.from}
            message={form.message}
            color={form.color}
            sparkle={form.sparkle}
            isPreviewing={isPreviewing}
          />

          {/* Preview Animation Button */}
          <div className="animation-btn-cont">
            <div className="divider animation-btn-divider" aria-hidden="true"/>

            <button 
              className="generate-button"
              type="button"
              onClick={() => setIsPreviewing(!isPreviewing)}
            >
              {isPreviewing ? "Close Preview" : "Preview Animation"}
            </button>
          </div>
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

        <div 
          className="envelope-flap" 
          style={{ backgroundColor: lightenColor(color, 5) }}
          aria-hidden="true" 
        />

        <div 
          className="envelope-flap-back" 
          style={{ backgroundColor: darkenColor(color, 5) }} 
          aria-hidden="true"
        />

        <div 
          className="envelope-body" 
          style={{ backgroundColor: color }} 
          aria-hidden="true"
        />

        {/* Sparkle Emojis */}
        {isPreviewing && sparkle && (
          <div aria-hidden="true">
            <Sparkles type={sparkle} />
          </div>
        )}

        <div className={`letter ${isPreviewing ? "show-letter" : ""}`}>
          <p>Dear {to || "Significant Other"},</p>
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