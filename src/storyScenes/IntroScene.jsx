import { useState } from "react";
import Sparkles from "../components/animations/Sparkles";

export default function Intro({
  to = "My Love",
  from = "Someone Who Adores You",
  message = "This is where your love letter will appear.",
  sparkle = "hearts",
  color = "#ff6b81"
}) {

  const [stage, setStage] = useState(0);

  const handleClick = () => {
    if (stage < 5) {
      setStage(stage + 1);
    }
  };

  return (
    <div className="story-scene">

      <div
        className={`story-stage stage-${stage}`}
        onClick={handleClick}
      >

        {/* BOX */}
        <div className="box">

          <div className="box-front"></div>
          <div className="box-side"></div>
          <div className="box-inside"></div>

          <div className="box-flap-left"></div>
          <div className="box-flap-right"></div>

        </div>

        {/* BOOK */}
        {stage >= 2 && (
          <div className="book">

            <div
              className="book-cover"
              style={{ backgroundColor: color }}
            />

            <div className="book-page">

              {stage >= 4 && (
                <div className="letter">

                  {sparkle && <Sparkles type={sparkle} />}

                  <p>Dear {to},</p>
                  <p>{message}</p>
                  <p>Sincerely, {from}</p>

                </div>
              )}

            </div>

          </div>
        )}

      </div>

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
    