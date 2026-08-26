import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faArrowRight, faLocationDot, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MemoriesScene({
  memories = [],
  onComplete,
}) {

  // Which memory are we currently viewing?
  const [currentMemory, setCurrentMemory] = useState(0);

  // Determines whether we're showing the postcard or the associated polaroid.
  const [showPolaroid, setShowPolaroid] = useState(false);

  // Prevents accidental interaction while an animation is taking place.
  const [isAnimating, setIsAnimating] = useState(false);

  const [imageSrc, setImageSrc] = useState(null);


  /*
  --------------------------------
  Current Memory
  --------------------------------
  */

  const memory = memories[currentMemory];


  
useEffect(() => {

    if (!memory?.image) {
    setImageSrc(null);
    return;
    }

    // If the image is a File object
    if (memory.image instanceof File) {

    const url = URL.createObjectURL(memory.image);

    setImageSrc(url);

    // Clean up the object URL when
    // the memory changes/unmounts
    return () => {
        URL.revokeObjectURL(url);
    };
    }

    // If it's already a URL/base64 string
    setImageSrc(memory.image);

}, [memory]);


  /*
  --------------------------------
  Has Image
  --------------------------------
  */

  const hasImage = Boolean(memory?.image);


  /*
  --------------------------------
  Advance Memory
  --------------------------------
  */

  const advanceMemory = () => {

    if (isAnimating) {
      return;
    }

    setIsAnimating(true);

    /*
    If this memory has an image and we're
    currently looking at the postcard,
    reveal the polaroid underneath instead
    of moving to the next memory.
    */

    if (hasImage && !showPolaroid) {

      setShowPolaroid(true);

      setTimeout(() => {
        setIsAnimating(false);
      }, 600);

      return;
    }


    /*
    Otherwise, move to the next memory.
    */

    if (currentMemory < memories.length - 1) {

      setCurrentMemory((previous) => previous + 1);

      setShowPolaroid(false);

      setTimeout(() => {
        setIsAnimating(false);
      }, 600);

      return;
    }


    /*
    No memories remaining.
    */

    setIsAnimating(false);

    onComplete?.(true);
  };


  /*
  --------------------------------
  Swipe Handler
  --------------------------------
  */

  const handleDragEnd = (
    event,
    info
  ) => {

    const swipeDistance = Math.abs(info.offset.x);

    const swipeVelocity = Math.abs(info.velocity.x);

    /*
    Either a large enough swipe OR
    a fast enough swipe counts.
    */

    if (
      swipeDistance > 100 ||
      swipeVelocity > 500
    ) {
      advanceMemory();
    }
  };


  /*
  --------------------------------
  Card Variants
  --------------------------------
  */

  const postcardVariants = {

    initial: {
      y: 100,
      opacity: 0,
      rotate: -2,
    },

    visible: {
      y: 0,
      opacity: 1,
      rotate: -2,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },

    exit: {
      x: 500,
      y: -80,
      rotate: 15,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeIn",
      },
    },
  };


  const polaroidVariants = {

    initial: {
      y: 100,
      opacity: 0,
      rotate: 3,
    },

    visible: {
      y: 0,
      opacity: 1,
      rotate: 3,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },

    exit: {
      x: -500,
      y: -80,
      rotate: -15,
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeIn",
      },
    },
  };


  /*
  --------------------------------
  Render
  --------------------------------
  */

  return (

    <motion.div
      className="memories-scene"

      initial={{
        opacity: 0,
      }}

      animate={{
        opacity: 1,
      }}

      transition={{
        duration: 0.6,
      }}
    >

      {/* --------------------------------
          Header
      -------------------------------- */}

      <div className="memories-header">

        <p className="memories-eyebrow">
          Our Memories
        </p>

        <h2>
          Little moments worth remembering
        </h2>

      </div>


      {/* --------------------------------
          Card Stack
      -------------------------------- */}

      <div className="memory-stack">

        {/* Decorative cards underneath */}

        <div
          className="memory-stack-card stack-card-one"
          aria-hidden="true"
        />

        <div
          className="memory-stack-card stack-card-two"
          aria-hidden="true"
        />


        <AnimatePresence
          mode="wait"
        >

          {/* --------------------------------
              POSTCARD
          -------------------------------- */}

          {!showPolaroid && (

            <motion.button

              key={`postcard-${currentMemory}`}

              type="button"

              className="memory-postcard"

              variants={postcardVariants}

              initial="initial"

              animate="visible"

              exit="exit"

              drag="x"

              dragConstraints={{
                left: 0,
                right: 0,
              }}

              dragElastic={0.8}

              onDragEnd={handleDragEnd}

              onClick={advanceMemory}

              disabled={isAnimating}

              aria-label={
                hasImage
                  ? "View memory photo"
                  : "View next memory"
              }
            >

              {/* Postcard decoration */}

              <div
                className="postcard-stamp"
                aria-hidden="true"
              >
                ♡
              </div>


              <div className="postcard-content">

                <p className="postcard-label">
                  A Memory
                </p>

                <p className="postcard-description">
                  {memory.description}
                </p>


                <div className="postcard-location">

                  <FontAwesomeIcon
                    icon={faLocationDot}
                    aria-hidden="true"
                  />

                  <span>
                    {memory.location}
                  </span>

                </div>

              </div>


              <div className="postcard-footer">

                <span>
                  {hasImage
                    ? "Swipe or click to reveal"
                    : "Swipe or click for next memory"
                  }
                </span>

                <FontAwesomeIcon
                  icon={faArrowRight}
                  aria-hidden="true"
                />

              </div>

            </motion.button>

          )}


          {/* --------------------------------
              POLAROID
          -------------------------------- */}

          {showPolaroid && hasImage && (

            <motion.button

              key={`polaroid-${currentMemory}`}

              type="button"

              className="memory-polaroid"

              variants={polaroidVariants}

              initial="initial"

              animate="visible"

              exit="exit"

              drag="x"

              dragConstraints={{
                left: 0,
                right: 0,
              }}

              dragElastic={0.8}

              onDragEnd={handleDragEnd}

              onClick={advanceMemory}

              disabled={isAnimating}

              aria-label="Continue to next memory"
            >

              {/* Image */}

              <div className="polaroid">

                <img
                    className="polaroid-image"
                    src={imageSrc}
                    alt={
                        memory.description
                        ? `Memory: ${memory.description}`
                        : "Memory"
                    }
                />

              </div>


              {/* Caption */}

              <div className="polaroid-caption">

                <p className="polaroid-description">
                  {memory.description}
                </p>


                <div className="polaroid-date">

                  <FontAwesomeIcon
                    icon={faCalendar}
                    aria-hidden="true"
                  />

                  <span>
                    {memory.date}
                  </span>

                </div>

              </div>


              <div className="polaroid-hint">
                Swipe or click for next memory
              </div>

            </motion.button>

          )}

        </AnimatePresence>

      </div>


      {/* --------------------------------
          Progress
      -------------------------------- */}

      <div
        className="memories-progress"
        aria-label={`Memory ${
          currentMemory + 1
        } of ${memories.length}`}
      >

        <div className="memories-progress-track">

          <motion.div
            className="memories-progress-fill"

            animate={{
              width: `${
                ((currentMemory + 1) /
                  memories.length) *
                100
              }%`,
            }}

            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          />

        </div>


        <p>
          {currentMemory + 1} / {memories.length}
        </p>

      </div>

    </motion.div>
  );
}