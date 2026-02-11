import { useState } from 'react';
import { encodeData } from '../utils/encode';

export default function CreateMessage() {

  const [to, setTo] = useState('');
  const [message, setMessage] = useState('');
  const [from, setFrom] = useState('');

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