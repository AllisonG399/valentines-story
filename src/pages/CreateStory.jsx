import { useState, useEffect, useRef } from 'react';
import { encodeData } from '../utils/encode';
import Sparkles from "../components/animations/Sparkles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const initialForm = {
  to: "",
  message: "",
  from: "",
  passcode: "",
  color: "#F8C8DC",
  sparkle: "hearts",
  expiration: "1",
  memories: [
    {
      description: "",
      date: "",
      location: "",
      image: null,
    }
  ],
  theWayYou: "",
  makeMeFeel: "",
  favoriteThingYouDo: "",
  favoritePhysicalThingAboutYou: "",
  favoriteThingYouSay: "",
  favoriteThingWeDoTogether: "",
  toBeSaid: [""],
};

export default function CreateStory({
  setHasUnsavedChanges
}) {

  const [form, setForm] = useState(initialForm);
  const [showPasscode, setShowPasscode] = useState(false);

  const [isPreviewing, setIsPreviewing] = useState(false);

  const confirmCancelRef = useRef(null);
  const confirmModalRef = useRef(null);
  const wasModalOpenRef = useRef(null);
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

  // -------------------------
  // Memory Management
  // -------------------------
  const MAX_MEMORIES = 10;

  const handleAddMemory = () => {
    if (form.memories.length >= MAX_MEMORIES) return;

    updateForm("memories", [
      ...form.memories,
      {
        description: "",
        date: "",
        location: "",
        image: null,
      },
    ]);
  };

  const handleMemoryChange = (index, field, value) => {
    const updatedMemories = form.memories.map((memory, memoryIndex) =>
      memoryIndex === index
        ? { ...memory, [field]: value }
        : memory
    );

    updateForm("memories", updatedMemories);
  };

  const handleRemoveMemory = (index) => {
    const updatedMemories = form.memories.filter(
      (_, memoryIndex) => memoryIndex !== index
    );

    updateForm("memories", updatedMemories);
  };

  const theWayYouTemplate = "The way you... ";
  const makesMeFeelTemplate = "Makes me feel... ";

  // -------------------------
  // Things I Don't Say Enough
  // -------------------------
  const MAX_TO_BE_SAID = 10;

  const handleToBeSaidAdd = () => {
    if (form.toBeSaid.length >= MAX_TO_BE_SAID) return;

    updateForm("toBeSaid", [
      ...form.toBeSaid,
      "",
    ]);
  };

  const handleToBeSaidChange = (index, value) => {
    const updated = form.toBeSaid.map((item, itemIndex) =>
      itemIndex === index
        ? value
        : item
    );

    updateForm("toBeSaid", updated);
  };

  const handleToBeSaidRemove = (index) => {
    const updated = form.toBeSaid.filter(
      (_, itemIndex) => itemIndex !== index
    );

    updateForm("toBeSaid", updated);
  };
  
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

  // Validate Form
  const validateForm = () => {
    setError("");

    const trimmedTo = form.to.trim();
    const trimmedMessage = form.message.trim();
    const trimmedFrom = form.from.trim();
    const trimmedPasscode = form.passcode.trim();

    const trimmedTheWayYou = form.theWayYou.trim();
    const trimmedMakeMeFeel = form.makeMeFeel.trim();
    const trimmedFavoriteThingYouDo = form.favoriteThingYouDo.trim();
    const trimmedFavoritePhysicalThingAboutYou = form.favoritePhysicalThingAboutYou.trim();
    const trimmedFavoriteThingYouSay = form.favoriteThingYouSay.trim();
    const trimmedFavoriteThingWeDoTogether = form.favoriteThingWeDoTogether.trim();

    // Required fields
    if (
      !trimmedTo ||
      !trimmedMessage ||
      !trimmedFrom ||
      !trimmedPasscode ||
      !trimmedTheWayYou ||
      !trimmedMakeMeFeel ||
      !trimmedFavoriteThingYouDo ||
      !trimmedFavoritePhysicalThingAboutYou ||
      !trimmedFavoriteThingYouSay ||
      !trimmedFavoriteThingWeDoTogether
    ) {
      setError("Please fill out all required fields.");
      return false;
    }

    // Passcode Requirements
    if (trimmedPasscode.length < 4) {
      setError("Passcode must be at least 4 characters.");
      return false;
    }

    // Expiration requirements
    if (!["1", "3", "7"].includes(form.expiration)) {
      setError("Please select an expiration time.");
      return false;
    }

    // Memories -> Description is required; date, location, and image are optional.
    const hasIncompleteMemory = form.memories.some(
      (memory) => !memory.description.trim()
    );

    if (hasIncompleteMemory) {
      setError("Please add a description for each memory.");
      return false;
    }

    // "To Be Said" entries are required
    const hasEmptyToBeSaid = form.toBeSaid.some(
      (item) => !item.trim()
    );

    if (hasEmptyToBeSaid) {
      setError("Please complete all of your message prompts.");
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

      memories: form.memories.map((memory) => ({
        description: memory.description.trim(),
        date: memory.date,
        location: memory.location.trim(),
        image: memory.image,
      })),

      theWayYou: form.theWayYou.trim(),
      makeMeFeel: form.makeMeFeel.trim(),

      favoriteThingYouDo: form.favoriteThingYouDo.trim(),
      favoritePhysicalThingAboutYou: form.favoritePhysicalThingAboutYou.trim(),
      favoriteThingYouSay: form.favoriteThingYouSay.trim(),
      favoriteThingWeDoTogether: form.favoriteThingWeDoTogether.trim(),

      toBeSaid: form.toBeSaid.map((item) => item.trim()),

      expiresAt,
    };

    // Encode and create link
    const encoded = encodeData(payload);

    const link = `${window.location.origin}/#/vs/${encoded}`;

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
          Create your Love Letter Story Card
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
          aria-labelledby="story-card-title"
        >

          <h2 
            id="story-card-title"
            className="static-card"
          >
            Story Card
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
            placeholder="Write a heartfelt message here... they will view this first"
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

          {/* Favorite Memories */}
          <h3 className="sub-section">Favorite Memories</h3>
          <div className="divider" aria-hidden="true" />

          {form.memories.map((memory, index) => (
            <div key={index} className="memory-block">

              {index > 0 && (
                <button
                  type="button"
                  className="memory-remove-btn"
                  onClick={() => handleRemoveMemory(index)}
                  aria-label={`Remove memory ${index + 1}`}
                >
                  <span aria-hidden="true">✕</span>
                </button>
              )}

              <h4 className="memory-label">
                {index === 0
                  ? "Most Favorite Memory"
                  : `Memory ${index + 1}`}
              </h4>

              {/* Description */}
              <label htmlFor={`memory-description-${index}`}>
                Memory description:
              </label>

              <textarea
                id={`memory-description-${index}`}
                className="memory-input"
                value={memory.description}
                onChange={(e) =>
                  handleMemoryChange(
                    index,
                    "description",
                    e.target.value
                  )
                }
                placeholder="Describe this memory"
                required
                aria-required="true"
              />

              {/* Date */}
              <label htmlFor={`memory-date-${index}`}>
                Date <span>(optional)</span>:
              </label>

              <input
                id={`memory-date-${index}`}
                className="memory-input"
                type="month"
                value={memory.date}
                onChange={(e) =>
                  handleMemoryChange(
                    index,
                    "date",
                    e.target.value
                  )
                }
              />

              {/* Location */}
              <label htmlFor={`memory-location-${index}`}>
                Location <span>(optional)</span>:
              </label>

              <input
                id={`memory-location-${index}`}
                className="memory-input"
                type="text"
                value={memory.location}
                onChange={(e) =>
                  handleMemoryChange(
                    index,
                    "location",
                    e.target.value
                  )
                }
                placeholder="Where did this memory happen?"
              />

              {/* Image */}
              <label htmlFor={`memory-image-${index}`}>
                Image <span>(optional)</span>:
              </label>

              <input
                id={`memory-image-${index}`}
                className="memory-input"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleMemoryChange(
                    index,
                    "image",
                    e.target.files?.[0] || null
                  )
                }
              />

            </div>
          ))}

          <button
            type="button"
            className="add-memory-btn"
            onClick={handleAddMemory}
          >
            Add Another Memory
          </button>

          {/* How You Make Me Feel Section */}
          <h3 
            className="sub-section"
          >
            How You Make Me Feel
          </h3>

          <div className="divider" aria-hidden="true"/>

          {/* The Way You... */}
          <label htmlFor="the-way-you">
            The Way You...
          </label>

          <textarea
            id="the-way-you"
            className="memory-input"
            value={`${theWayYouTemplate}${form.theWayYou}`}
            onChange={(e) => {
              const fullText = e.target.value;

              if (!fullText.startsWith(theWayYouTemplate)) {
                return;
              }

              const userText = fullText.slice(theWayYouTemplate.length);

              updateForm("theWayYou", userText);
            }}
            rows={2}
            required
          />

          {/* Makes Me Feel... */}
          <label htmlFor="make-me-feel">
            Makes Me Feel...
          </label>

          <textarea
            id="make-me-feel"
            className="memory-input"
            value={`${makesMeFeelTemplate}${form.makeMeFeel}`}
            onChange={(e) => {
              const fullText = e.target.value;

              if (!fullText.startsWith(makesMeFeelTemplate)) {
                return;
              }

              const userText = fullText.slice(makesMeFeelTemplate.length);

              updateForm("makeMeFeel", userText);
            }}
            rows={2}
            required
          />


          {/* Favorite Things About You Section */}
          <h3 className="sub-section">Favorite Things About You</h3>
          <div className="divider" aria-hidden="true"/>

          {/* Favorite Thing You Do */ }
          <label htmlFor="favorite-thing-you-do">
            Favorite Thing You Do:
          </label>

          <textarea
            id="favorite-thing-you-do"
            className="memory-input"
            value={form.favoriteThingYouDo}
            onChange={(e) =>
              updateForm("favoriteThingYouDo", e.target.value)
            }
            placeholder="What is something they do that you love the most?"
          />

          {/* Favorite Physical Thing About You */}
          <label htmlFor="favorite-physical-thing">
            Favorite Physical Thing About You:
          </label>

          <textarea
            id="favorite-physical-thing"
            className="memory-input"
            value={form.favoritePhysicalThingAboutYou}
            onChange={(e) =>
              updateForm("favoritePhysicalThingAboutYou", e.target.value)
            }
            placeholder="What is your favorite physical feature about them?"
          />

          {/* Favorite Thing You Say */}
          <label htmlFor="favorite-thing-you-say">
            Favorite Thing You Say:
          </label>

          <textarea
            id="favorite-thing-you-say"
            className="memory-input"
            value={form.favoriteThingYouSay}
            onChange={(e) =>
              updateForm("favoriteThingYouSay", e.target.value)
            }
            placeholder="What is your favorite thing they say to you?"
          />

          {/* Favorite Thing We Do Together */}
          <label htmlFor="favorite-thing-we-do">
            Favorite Thing We Do Together:
          </label>

          <textarea
            id="favorite-thing-we-do"
            className="memory-input"
            value={form.favoriteThingWeDoTogether}
            onChange={(e) =>
              updateForm("favoriteThingWeDoTogether", e.target.value)
            }
            placeholder="What is your favorite thing you do together?"
          />


          {/* Things I Don't Say Enough Section*/}
          <h3 className="sub-section">Things I Don't Say Enough</h3>
          <div className="divider" aria-hidden="true"/>

          {form.toBeSaid.map((item, index) => (
            <div key={index} className="memory-block">

              {index > 0 && (
                <button
                  type="button"
                  className="memory-remove-btn"
                  onClick={() => handleToBeSaidRemove(index)}
                  aria-label={`Remove item ${index + 1}`}
                >
                  <span aria-hidden="true">✕</span>
                </button>
              )}

              <label
                htmlFor={`to-be-said-${index}`}
                className="memory-label"
              >
                {index === 0
                  ? "Most Important Thing I Don't Say Enough:"
                  : `Item ${index + 1}:`}
              </label>

              <textarea
                id={`to-be-said-${index}`}
                className="memory-input"
                value={item}
                onChange={(e) =>
                  handleToBeSaidChange(index, e.target.value)
                }
                placeholder="What is something you don't say enough?"
                required
              />

            </div>
          ))}

          {/* Add another item */}
          <button
            type="button"
            className="add-memory-btn"
            onClick={handleToBeSaidAdd}
          >
            Add Another
          </button>

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

          <div className="divider" aria-hidden="false"/>

          {/* Preview Animation */}


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

