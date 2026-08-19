import { motion } from "framer-motion";

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
      rotate: 0,
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

const hearts = [
    { id: 1, img: "💗", left: "10%", top: "15%", size: 5, index: 5, variant: "exitLeft" },
    { id: 2, img: "🤍", left: "50%", top: "40%", size: 3, index: 3, variant: "exitUp" },
    { id: 3, img: "💕", left: "80%", top: "70%", size: 4, index: 6, variant: "exitRight" },
];

const emoji = ["💗", "🤍", "💕"];
let left = 7;
let top = 7;
let tempTop = top;
const variant = ["exitLeft", "exitUp", "exitRight"];
let tempVariant = "";
let heart = [];

// Loop runs until we run out of vertical space (top hits the bottom)
while (top <= 83) {
  
  // Check if we reached the right edge of the row
  if (left > 85) { 
    left = Math.floor(Math.random() * 5) + 1;       // Reset left to the start of a new row
    top += Math.floor(Math.random() * 10) + 1;      // Move 'top' down to the next row
    tempTop = top;                                  // Sync tempTop to the new row baseline
  } else {
    left += Math.floor(Math.random() * 5) + 1;     // Move horizontally across the row
    tempTop = top + (Math.floor(Math.random() * 5) - 2); // Wiggle slightly up/down
  }

  // Safety check: break immediately if the new row push put us past the bottom edge
  if (top > 95) break;

  // Variant checking logic
  if (left <= 50) {
    if (top < 40) {
      tempVariant = variant[Math.floor(Math.random() * 2)];
    } else {
      tempVariant = "exitLeft";
    }
  } else if (left > 50) {
    if (top < 40) {
      tempVariant = variant[Math.floor(Math.random() * 2) + 1];
    } else {
      tempVariant = "exitRight";
    }
  }

  heart.push({
    id: heart.length,
    img: emoji[Math.floor(Math.random() * emoji.length)],
    left: `${left}%`,
    top: `${tempTop}%`,
    size: Math.floor(Math.random() * 5) + 1,
    index: Math.floor(Math.random() * 10) + 1,
    variant: tempVariant
  });
}

export default function StoryCover({ isOpen, onComplete }) {
    return (

        // Outside Container - fixed
        <motion.div
            className="story-cover"
            initial={false}
            animate={isOpen ? "open" : "closed"}
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
                        variants={heartVariants[heart.variant]}
                        style={{
                            left: heart.left,
                            top: heart.top,
                            fontSize: `${heart.size}rem`,
                            zIndex: heart.index,
                        }}
                    >
                        {heart.img}
                    </motion.span>
                ))}
                
            </div>
        </motion.div>
    );
}