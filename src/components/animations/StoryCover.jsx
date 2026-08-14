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
]

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

                {hearts.map((heart) => (
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