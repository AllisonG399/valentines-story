import { useState } from "react";

export default function ToBeSaidScene({
    toBeSaid=[""],
    color="#ff6b81",
    onComplete
}) {

    const [isOpened, setIsOpened] = useState(false); // Track if the envelope gets opened
    const [isNotesLeft, setIsNotesLeft] = useState(true); // Track if there is any notes left to be said

    const handleEnvelopeClick = () => {
        setIsOpened(true);
    }

    return (
        <div
            className="said-scene"
        >

            
            {/* Sticky Note */}
            {isOpened && (
                <div
                    id="said-content"
                >


                </div>
            )}

            {/* Envelope */}
            <button
                type="button"
                className="button-wrapper-envelope"
                onClick={handleEnvelopeClick}
                aria-expanded={isOpened}
                aria-label={
                    isOpened
                        ? "Envelope is closing soon"
                        : "Open envelope to view next note"
                }
                aria-controls="said-content"
            >

                <div className={`said-envelope-wrapper`}>

                    {/* Envelope Front Flap */}
                    <div
                        className="front-flap-envelope"
                        style={{
                            backgroundColor: lightenColor(color, 5)
                        }}
                        aria-hidden="true"
                    />

                    {/* Envelope Back Flap */}
                    <div
                        className="back-flap-envelope"
                        style={{
                            backgroundColor: darkenColor(color, 5)
                        }}
                        aria-hidden="true"
                    />

                    {/* Envelope Body */}
                    <div
                        className="body-envelope"
                        style={{
                            backgroundColor: color
                        }}
                        aria-hidden="true"
                    />
                </div>

            </button>

        </div>
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