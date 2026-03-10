import { useState } from 'react';
import { encodeData } from '../utils/encode';
import Sparkles from "../components/animations/Sparkles";

export default function CreateStory() {
  
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [passcode, setPasscode] = useState('');
  const [selectedColor, setSelectedColor] = useState("#F8C8DC");
  const [selectedSparkle, setSelectedSparkle] = useState("hearts");
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [selectedExpiration, setSelectedExpiration] = useState("1");
  const [error, setError] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [memories, setMemories] = useState([
    {
      description: "",
      date: "",
      location: "",
      image: null
    }
  ]);
  const [theWayYouText, setTheWayYouText] = useState("");
  const [makesMeFeelText, setMakesMeFeelText] = useState("");
  const [message, setMessage] = useState("");
  const [favoriteThingYouDo, setFavoriteThingYouDo] = useState("");
  const [favoritePhysicalThingAboutYou, setFavoritePhysicalThingAboutYou] = useState("");
  const [favoriteThingYouSay, setFavoriteThingYouSay] = useState("");
  const [favoriteThingWeDoTogether, setFavoriteThingWeDoTogether] = useState("");
  const [toBeSaid, setToBeSaid] = useState([""]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
  
  {/* Form submission handler */ }
  const handleGenerate = (e) => {
    e.preventDefault(); // prevent page refresh

    if (!to.trim() || !from.trim() || !passcode.trim()) {
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

    const expiresAt = now + expirationMap[selectedExpiration];

    const payload = {
      to,
      from,
      message,
      passcode,
      color: selectedColor,
      sparkle: selectedSparkle,
      expiresAt,
      memories,
      theWayYouText,
      makesMeFeelText,
      favoriteThingYouDo,
      favoritePhysicalThingAboutYou,
      favoriteThingYouSay,
      favoriteThingWeDoTogether,
      toBeSaid
    };

    const encoded = encodeData(payload);

    const link = `${window.location.origin}/#/vm/${encoded}`;
    setGeneratedLink(link);
  };

  {/* Memory Management */ }
  const MAX_MEMORIES = 10;

  const handleAddMemory = () => {
    if (memories.length >= MAX_MEMORIES) return;

    setMemories([
      ...memories,
      {
        description: "",
        date: "",
        location: "",
        image: null
      }
    ]);
  };
  
  {/* Update memory field */}
  const handleMemoryChange = (index, field, value) => {
    const updatedMemories = [...memories];
    updatedMemories[index][field] = value;
    setMemories(updatedMemories);
  };

  {/* Remove memory block */}
  const handleRemoveMemory = (index) => {
    const updatedMemories = memories.filter((_, i) => i !== index);
    setMemories(updatedMemories);
  };

  const theWayYouTemplate = "The way you... ";
  const makesMeFeelTemplate = "Makes me feel... ";

  {/* Things I Don't Say Enough Management */ }
  const MAX_TO_BE_SAID = 10;

  const handleToBeSaidAdd = () => {
    if (toBeSaid.length >= MAX_TO_BE_SAID) return;
    setToBeSaid([...toBeSaid, ""]);
  };

  const handleToBeSaidChange = (index, value) => {
    const updated = [...toBeSaid];
    updated[index] = value;
    setToBeSaid(updated);
  };

  const handleToBeSaidRemove = (index) => {
    const updated = toBeSaid.filter((_, i) => i !== index);
    setToBeSaid(updated);
  }

  return (
    <main className="create-message">
        {/* Header */}
        <header className="header">
          <h1 className="site-title">Love Letter</h1>
          <div className="divider" />
        </header>

        {/* Hero */}
          <section className="hero">
            <h2 className="hero-title">
              Create your Love Letter Story Card.
            </h2>
            <p className="hero-subtitle">
              Fill in the fields below to create a personalized love story card. 
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
          <form className="form-container" onSubmit={handleGenerate}>
            <h3 className="static-card">Story Card</h3>
            <div className="divider" />

            {/* To */}
            <label>To:</label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Recipient's Name"
              required
            />

            {/* From */}
            <label>From:</label>
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Your Name"
              required
            />

            {/* Message */}
            <label>Message:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a heartfelt message here... they will view this first"
              required
            />

            {/* Passcode */}
            <label>Passcode:</label>
            <input 
              type="text"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode to view card"
              required
            />

            {/* Expiration */}
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

            {/* Envelope Color */}
            <label className="expiration-label">Envelope Color:</label>
            <div className="color-picker">
              {envelopeColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`color-swatch ${selectedColor === color.value ? "selected" : ""}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setSelectedColor(color.value)}
                  title={color.name}
                />
              ))}
            </div>

            {/* Sparkle Animation */}
            <label className="expiration-label">Sparkle Animation:</label>
            <div className="sparkle-picker">
              {sparkleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`sparkle-swatch ${selectedSparkle === option.value ? "selected" : ""}`}
                  onClick={() => setSelectedSparkle(option.value)}
                  title={option.name}
                >
                  {option.icon}
                </button>
              ))}
            </div>

            {/* Favorite Memories */}
            <h4 className="sub-section">Favorite Memories</h4>
            <div className="divider" />

            {memories.map((memory, index) => (
              <div key={index} className="memory-block">

                {index > 0 && (
                  <button
                    type="button"
                    className="memory-remove-btn"
                    onClick={() => handleRemoveMemory(index)}
                  >
                    ✕
                  </button>
                )}

                <label className="memory-label">{index === 0 ? "Most Favorite Memory:" : `Memory ${index + 1}`}</label>

      


                {/* Memory Description */}
                <textarea
                  className="memory-input"
                  value={memory.description}
                  onChange={(e) =>
                    handleMemoryChange(index, "description", e.target.value)
                  }
                  placeholder="Describe this memory"
                  required={index === 0}
                />

                <label className="memory-label">Optional:</label>
                {/* Memory Date */}
                <input
                  className="memory-input"
                  type="month"
                  value={memory.date}
                  onChange={(e) =>
                    handleMemoryChange(index, "date", e.target.value)
                  }
                />

                {/* Memory Location */}
                <input
                  className="memory-input"
                  type="text"
                  value={memory.location}
                  onChange={(e) =>
                    handleMemoryChange(index, "location", e.target.value)
                  }
                  placeholder="Location"
                />

                {/* Memory Image */}
                <input
                  className="memory-input"
                  type="file"
                  onChange={(e) =>
                    handleMemoryChange(index, "image", e.target.files[0] || null)
                  }
                />


              </div>
            ))}

            {/* Add another memory */}
            <button type="button" className="add-memory-btn" onClick={handleAddMemory}>Add Another Memory</button>


            {/* How You Make Me Feel Section */}
            <h4 className="sub-section">How You Make Me Feel</h4>
            <div className="divider" />

            {/* The Way You... */ }
            <textarea
              className="memory-input"
              value={theWayYouTemplate + theWayYouText} // combine fixed + user text
              onChange={(e) => {
                const fullText = e.target.value;
                // Only allow typing after the template
                if (!fullText.startsWith(theWayYouTemplate)) return;

                // Only keep the user-added part after the template
                const userText = fullText.slice(theWayYouTemplate.length);
                setTheWayYouText(userText);
              }}
              rows={2}
            />

            {/* Makes Me Feel... */ }
            <textarea
              className="memory-input"
              value={makesMeFeelTemplate + makesMeFeelText} // combine fixed + user text
              onChange={(e) => {
                const fullText = e.target.value;
                // Only allow typing after the template
                if (!fullText.startsWith(makesMeFeelTemplate)) return;
                // Only keep the user-added part after the template
                const userText = fullText.slice(makesMeFeelTemplate.length);
                setMakesMeFeelText(userText);
              }}
              rows={2}
            />


            {/* Favorite Things About You Section */}
            <h4 className="sub-section">Favorite Things About You</h4>
            <div className="divider" />

            {/* Favorite Thing You Do */ }
            <label>Favorite Thing You Do:</label>
            <textarea
              className="memory-input"
              type="text"
              value={favoriteThingYouDo}
              onChange={(e) => setFavoriteThingYouDo(e.target.value)}
              placeholder="What is something they do that you love the most?"
            />

            {/* Favorite Physical Thing About You */}
            <label>Favorite Physical Thing About You:</label>
            <textarea
              className="memory-input"
              type="text"
              value={favoritePhysicalThingAboutYou}
              onChange={(e) => setFavoritePhysicalThingAboutYou(e.target.value)}
              placeholder="What is your favorite physical feature about them?"
            />

            {/* Favorite Thing You Say */}
            <label>Favorite Thing You Say:</label>
            <textarea
              className="memory-input"
              type="text"
              value={favoriteThingYouSay}
              onChange={(e) => setFavoriteThingYouSay(e.target.value)}
              placeholder="What is your favorite thing they say to you?"
            />

            {/* Favorite Thing We Do Together */}
            <label>Favorite Thing We Do Together:</label>
            <textarea
              className="memory-input"
              type="text"
              value={favoriteThingWeDoTogether}
              onChange={(e) => setFavoriteThingWeDoTogether(e.target.value)}
              placeholder="What is your favorite thing you do together?"
            />


            {/* Things I Don't Say Enough Section*/}
            <h4 className="sub-section">Things I Don't Say Enough</h4>
            <div className="divider" />

            {toBeSaid.map((item, index) => (
              <div key={index} className="memory-block">

                {index > 0 && (
                  <button
                    type="button"
                    className="memory-remove-btn"
                    onClick={() => handleToBeSaidRemove(index)}
                    >
                      ✕
                    </button>
                )}

                <label className="memory-label">{index === 0 ? "Most Important Thing I Don't Say Enough:" : `Item ${index + 1}`}</label>

                {/* To Be Said Description */}
                <textarea
                  className="memory-input"
                  value={item}
                  onChange={(e) => handleToBeSaidChange(index, e.target.value)}
                  placeholder="What is something you don't say enough?"
                />
             </div>
            ))}

            {/* Add another item */}
            <button type="button" className="add-memory-btn" onClick={handleToBeSaidAdd}>
              Add Another
            </button>

            {/* Generate Button */}
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
            >
              Generate Card
            </button>
            {error && <div className="form-error">{error}</div>}

            {generatedLink && (
              <div className="generated-link-container">
                <p>Your Valentine link is ready 💌</p>

                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="generated-link"
                />

                <div className="link-actions">
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedLink)}
                  >
                    Copy Link
                  </button>

                  <button
                    onClick={() => window.location.href = generatedLink}
                  >
                    Open Card
                  </button>
                </div>
              </div>
            )}

            {showConfirmModal && (
              <div className="confirm-overlay">
                <div className="confirm-modal">
                  <h3>💌 Ready to generate your Love Letter?</h3>
                  <p>
                    Once generated, you'll receive a special link to share with your
                    Valentine.
                  </p>

                  <div className="confirm-actions">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setShowConfirmModal(false)}
                    >
                      Go Back
                    </button>

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
            <h3 className="static-card">Card Preview</h3>
            <div className="divider" />

            <CardPreview
              to={to}
              from={from}
              color={selectedColor}
              sparkle={selectedSparkle}
              isPreviewing={isPreviewing}
            />

            <button onClick={() => setIsPreviewing(!isPreviewing)}>Preview Animation</button>
          </div>
        </section>

        
    </main>
  );
}

// ------------------------
// Card Preview Component
// ------------------------
function CardPreview({ to, from, color, sparkle, isPreviewing }) {
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