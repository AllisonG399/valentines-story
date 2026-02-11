import { useState } from 'react';
import { encodeData } from '../utils/encode';
import Sparkles from "../components/animations/Sparkles";

export default function CreateMessage() {

  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [from, setFrom] = useState('');
  const [passcode, setPasscode] = useState('');
  const [selectedColor, setSelectedColor] = useState("#F8C8DC");
  const [selectedSparkle, setSelectedSparkle] = useState("hearts");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [selectedExpiration, setSelectedExpiration] = useState("1");

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

  const handleGenerate = () => {
    const payload = { to, message, from };
    console.log(payload); // temporary
    const encoded = encodeData(payload);
    window.location.hash = `#/v/${encoded}`;
  };

  return (
    <main className="create-message">
        {/* Header */}
        <header className="header">
          <h1 className="site-title">Valentines Story</h1>
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
            <div className="divider-heart">
                <div className="divider" />
                <span className="heart">♥</span>
                <div className="divider" />
            </div>
          </section>

        <section className="message-container">
          {/* Form */}
          <div className="form-container">
            <h3 className="static-card">Static Card</h3>
            <div className="divider" />

            <label>To:</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Your Valentine's Name"
            />
            <label>Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your heartfelt message here..."
            />
            <label>From:</label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Your Name"
            />
            <label>Passcode:</label>
            <input 
              type="text"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode to view card"
            />

            <label className="expiration-label">Expiration:</label>
            <div className="expiration-group">
              {["1","3","7"].map((val) => (
                <label key={val} className="expiration-option">
                  <span className="expiration-text">{val === "1" ? "24 Hours" : val === "3" ? "3 Days" : "7 Days"}</span>
                  <input type="radio" name="expirationTime" value={val} checked={selectedExpiration === val} onChange={(e) => setSelectedExpiration(e.target.value)} />
                  <span className="custom-radio"></span>
                </label>
              ))}
            </div>

            <label className="expiration-label">Envelope Color:</label>
            <div className="color-picker">
              {envelopeColors.map((color) => (
                <button
                  key={color.value}
                  className={`color-swatch ${selectedColor === color.value ? "selected" : ""}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.name}
                />
              ))}
            </div>

            <label className="expiration-label">Sparkle Animation:</label>
            <div className="sparkle-picker">
              {sparkleOptions.map((option) => (
                <button
                  key={option.value}
                  className={`sparkle-swatch ${selectedSparkle === option.value ? "selected" : ""}`}
                  onClick={() => setSelectedSparkle(option.value)}
                  title={option.name}
                >
                  {option.icon}
                </button>
              ))}
            </div>

            {/* Generate Button */}
            <button onClick={handleGenerate}>Generate Card</button>
          </div>


          {/* Preview */}
          <div className="preview-container">
            <h3 className="static-card">Card Preview</h3>
            <div className="divider" />

            <CardPreview
              to={to}
              from={from}
              message={message}
              color={selectedColor}
              sparkle={selectedSparkle}
              isPreviewing={isPreviewing}
            />

            <button onClick={() => setIsPreviewing(!isPreviewing)}>Preview Animation</button>
          </div>
        </section>

        {/* Accessibility */}
        <footer className="accessibility">
          <button
            className="accessibility-btn"
            onClick={() => setReduceMotion(!reduceMotion)}
          >
            ⚙ Accessibility Options
          </button>
        </footer>
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