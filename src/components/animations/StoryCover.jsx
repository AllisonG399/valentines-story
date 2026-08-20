import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const overlayVariants = {
  closed: {
    opacity: 1,
  },

  open: {
    opacity: 0,
    transition: {
      duration: 0.5,
      delay: 0.1,
      ease: "easeInOut",
    },
  },
};

const messageVariants = {
  closed: {
    opacity: 1,
    scale: 1,
  },

  open: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.4,
      delay: 0.1,
      ease: "easeInOut",
    },
  },
};

const coverVariants = {
  closed: {
    opacity: 1,
  },

  open: {
    opacity: 0,
    transition: {
      duration: 0.8,
    },
  },
};

const heartVariants = {
  exitLeft: {
    closed: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
    },

    open: {
      opacity: 0,
      x: -120,
      y: -30,
      rotate: -35,
      scale: 0.7,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  },

  exitRight: {
    closed: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
    },

    open: {
      opacity: 0,
      x: 120,
      y: -30,
      rotate: 35,
      scale: 0.7,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  },

  exitUp: {
    closed: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
    },

    open: {
      opacity: 0,
      x: 0,
      y: -100,
      rotate: -20,
      scale: 0.7,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  },

  exitDown: {
    closed: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 20,
      scale: 1,
    },

    open: {
      opacity: 0,
      x: 0,
      y: 100,
      rotate: 20,
      scale: 0.7,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  },
};

const emoji = ["💗", "🤍", "💕"];
const variants = ["exitLeft", "exitUp", "exitRight"];

/*
-----------------------------------------
Generate Hearts
-----------------------------------------
*/

function generateHearts() {
  const isMobile = window.innerWidth <= 600;

  /*
  ---------------------------------------
  Responsive layout settings
  ---------------------------------------
  */

  // How far across the screen hearts can be placed
  const maxLeft = isMobile ? 68 : 80;
  const maxTop = isMobile ? 86 : 77;

  // Horizontal spacing between hearts
  const horizontalMin = isMobile ? 5 : 3;
  const horizontalRange = isMobile ? 6 : 7;

  // Vertical spacing between rows
  const verticalMin = isMobile ? 4 : 3;
  const verticalRange = isMobile ? 9 : 10;

  // Starting position
  let left = isMobile ? 5 : 7;
  let top = 7;

  let tempTop = top;
  let tempVariant = "";

  const heart = [];

  /*
  ---------------------------------------
  Generate heart positions
  ---------------------------------------
  */

  while (top <= maxTop) {

    // Check if we reached the right edge
    if (left > maxLeft) {

      // Start a new row
      left = Math.floor(Math.random() * 5) + 2;

      // Move down
      top +=
        Math.floor(Math.random() * verticalRange) +
        verticalMin;

      tempTop = top;

    } else {

      // Move horizontally
      left +=
        Math.floor(Math.random() * horizontalRange) +
        horizontalMin;

      // Slight vertical wiggle
      tempTop =
        top +
        (Math.floor(Math.random() * 4) - 2);
    }

    // Safety check
    if (top > 93) {
      break;
    }

    /*
    ---------------------------------------
    Choose animation direction
    ---------------------------------------
    */

    if (left <= 50) {

      if (top < 40) {
        tempVariant =
          variants[Math.floor(Math.random() * 2)];
      } else {
        tempVariant = "exitLeft";
      }

    } else {

      if (top < 40) {
        tempVariant =
          variants[Math.floor(Math.random() * 2) + 1];
      } else {
        tempVariant = "exitRight";
      }
    }

    /*
    ---------------------------------------
    Add heart
    ---------------------------------------
    */

    heart.push({
      id: heart.length,

      img:
        emoji[
          Math.floor(Math.random() * emoji.length)
        ],

      left: `${left}%`,

      top: `${tempTop}%`,

      // Slightly smaller range on mobile
      size: isMobile
        ? Math.floor(Math.random() * 5) + 2
        : Math.floor(Math.random() * 5) + 2,

      index:
        Math.floor(Math.random() * 10) + 1,

      variant: tempVariant,
    });
  }

  return heart;
}

/*
-----------------------------------------
Story Cover
-----------------------------------------
*/

export default function StoryCover({
  isOpen,
  onComplete,
}) {

  const [heart, setHeart] = useState([]);

  /*
  ---------------------------------------
  Generate initial hearts
  ---------------------------------------
  */

  useEffect(() => {
    setHeart(generateHearts());

    let isMobile = window.innerWidth <= 600;
    let resizeTimer;

    const handleResize = () => {
      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(() => {
        const newIsMobile = window.innerWidth <= 600;

        // Only regenerate if we crossed the mobile breakpoint
        if (newIsMobile !== isMobile) {
          isMobile = newIsMobile;
          setHeart(generateHearts());
        }
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (

    // Outside Container
    <motion.div
      className="story-cover"

      initial={false}

      animate={
        isOpen
          ? "open"
          : "closed"
      }

      variants={coverVariants}

      onAnimationComplete={(definition) => {

        if (definition === "open") {
          onComplete();
        }

      }}
    >

      <div className="story-cover-hearts">

        {heart.map((heart) => (

          <motion.span

            key={heart.id}

            className="story-cover-heart"

            variants={
              heartVariants[
                heart.variant
              ]
            }

            style={{
              left: heart.left,
              top: heart.top,

              "--heart-size":
                `${heart.size}rem`,

              zIndex: heart.index,
            }}

          >

            {heart.img}

          </motion.span>

        ))}

        <motion.div
          className="story-cover-overlay"
          variants={overlayVariants}
        >
          <motion.div
            className="story-cover-message"
            variants={messageVariants}
          >
            <p>Ready to begin your love story?</p>

            <span>
              Press the button above
            </span>
          </motion.div>
        </motion.div>

      </div>
    </motion.div>
  );
}