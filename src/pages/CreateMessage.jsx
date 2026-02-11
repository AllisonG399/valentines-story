import { useState } from 'react';
import { encodeData } from '../utils/encode';

export default function CreateMessage() {

  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [from, setFrom] = useState('');
  const [selected, setSelected] = useState("1");

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
const [selectedColor, setSelectedColor] = useState(envelopeColors[0].value);

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
const [selectedSparkle, setSelectedSparkle] = useState(sparkleOptions[0].value);

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
              Fill in the fields below to create a personalized Valentines card. Once completed, you will get a customized link to share with your Valentine for them to view the card.
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

            <label className="expiration-label">Expiration:</label>
            {/* Radio Button Options for expiration*/}
            <div className="expiration-group">
              <label className="expiration-option">
                <span className="expiration-text">24 Hours</span>

                <input
                  type="radio"
                  name="expirationTime"
                  value="1"
                  checked={selected === "1"}
                  onChange={(e) => setSelected(e.target.value)}
                />

                <span className="custom-radio"></span>
              </label>

              <label className="expiration-option">
                <span className="expiration-text">3 Days</span>

                <input
                  type="radio"
                  name="expirationTime"
                  value="3"
                  checked={selected === "3"}
                  onChange={(e) => setSelected(e.target.value)}
                />

                <span className="custom-radio"></span>
              </label>

              <label className="expiration-option">
                <span className="expiration-text">7 Days</span>

                <input
                  type="radio"
                  name="expirationTime"
                  value="7"
                  checked={selected === "7"}
                  onChange={(e) => setSelected(e.target.value)}
                />

                <span className="custom-radio"></span>
              </label>
            </div>
            
            <label className="expiration-label">Envelope Color:</label>
            <div className="color-picker">
              {envelopeColors.map((color) => (
                <button
                  key={color.value}
                  className={`color-swatch ${selectedColor === color.value ? "selected" : ""}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.name} // optional tooltip
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
                  title={option.name} // tooltip
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