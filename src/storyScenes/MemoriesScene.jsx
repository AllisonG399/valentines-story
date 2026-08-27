import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faArrowRight, faLocationDot, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MemoriesScene({
  memories = [],
  onComplete,
}) {
    const [currentMemory, setCurrentMemory] = useState(0); 
    const [isAnimating, setIsAnimating] = useState(false);

    /*-----------------
    Current Memory
    ------------------*/
    
    const memory = memories[currentMemory];
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {

        if (!memory?.image) {
        setImageSrc(null);
        return;
        }

        // File Object
        if (memory.image instanceof File) {

            const url = URL.createObjectURL(memory.image);
            setImageSrc(url);

            // Clean up the object URL when the memory changes/unmounts
            return () => {
                URL.revokeObjectURL(url);
            };
        }

        // URL / base64
        setImageSrc(memory.image);
    }, [memory]);


    // Has Image?
    const hasImage = Boolean(memory?.image);


    /*----------------
    Advance Memory
    -----------------*/

    const advanceMemory = () => {

        if (isAnimating) {
            return;
        }

        setIsAnimating(true);

        if (currentMemory < memories.length - 1) {
            setCurrentMemory((previous) => + 1);

            setTimeout(() => {
                setIsAnimated(false);
            }, 600);

            return;
        }

        // Last memory
        setTimeout(() => {
            setIsAnimating(false);
            onComplete?.(true);
        }, 500);
    };


    /*--------------
    Swipe Handler
    ---------------*/

    const handleDragEnd = (event, info) => {

        const swipeDistance = Math.abs(info.offset.x);
        const swipeVelocity = Math.abs(info.velocity.x);

        if (swipeDistance > 100 || swipeVelocity > 500) {
            advanceMemory();
        }
    };

    /*----------
    Card Stack
    -----------*/
    const visibleMemories = memories
        .slice(currentMemory, currentMemory + 3)
        .map((memory, index) => ({
            memory,
            index: currentMemory + index,
        }));    


    /*----------------
    Card Variants
    ----------------*/

    const cardVariants = {
        initial: {
            opacity: 0,
            y: 80,
            scale: 0.92,
        },

        visible: (position) => ({
            opacity: position === 0 ? 1 : 0.75,
            y: position * 14,
            x: position === 0
                ? 0
                : position === 1
                ? 18
                : -18,
            scale: 1 - position * 0.04,
            rotate:
                position === 0
                    ? -2
                    : position === 1
                    ? 3
                    : -4,
            transition: {
                duration: 0.45, 
                ease: "easeOut",
            },
        }),

        exit: {
            x: 600,
            y: -100,
            roate: 18,
            opacity: 0,

            transition: {
                duration: 0.6,
                ease: "easeIn",
            },
        },
    };


    /*-------
    Render
    --------*/
    if (!memory) {
        return null;
    }

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

            {/* Header */}
            <h2>
                Our Memories - Little moments worth remembering
            </h2>


            {/* Memory Stack */}

            <div className="memory-stack">

                <AnimatePresence>
                    {visibleMemories
                        .slice()
                        .reverse()
                        .map(({memory: stackMemory, index }) => {
                            const position = index - currentMemory;
                            const isTopCard = position === 0;
                            const stackHasImage = Boolean(stackMemory?.image);

                            return (
                                <MemoryCard
                                    key={`memory-${index}`}
                                    memory={stackMemory}
                                    index={index}
                                    position={position}
                                    isTopCard={isTopCard}
                                    hasImage={stackHasImage}
                                    imageSrc={
                                        isTopCard && index === currentMemory 
                                            ? imageSrc 
                                            : stackMemory.image
                                    }
                                    variants={cardVariants}
                                    onSwipe={handleDragEnd}
                                    onAdvance={advanceMemory}
                                    disabled={!isTopCard || isAnimating}
                                />
                            );
                        })
                    }
                </AnimatePresence>
            </div>

            {/* Swipe Hint */}
            <p className="memory-swipe-hint">
                Swipe to uncover the next memory
            </p>

            {/* Progress */}
            <div
                className="memories-progress"
                aria-label={`Memory ${currentMemory + 1} of ${memories.length}`}
            >

                <div className="memories-progress-track">

                    <motion.div
                        className="memories-progress-fill"
                        animate={{
                            width: `${((currentMemory + 1) / memories.length) * 100}%`,
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

/*-------------
Memory Card
-------------*/

function MemoryCard({
    memory,
    index,
    position,
    isTopCard,
    hasImage,
    imageSrc,
    variants,
    onSwipe,
    onAdvance,
    disabled,
}) {

    {/* Image Memory - Polaroid */}

    if (hasImage) {
        return (
            <motion.button
                key={`polaroid-${index}`}
                type="button"
                className={`memory-card memory-polaroid
                    ${isTopCard ? "memory-card-top" : ""}
                `}
                custom={position}
                variants={variants}
                initial="initial"
                animate="visible"
                exit="exit"
                drag={isTopCard ? "x" : false}
                dragConstraints={{
                    left: 0,
                    right: 0,
                }}
                dragElastic={0.8}
                onDragEnd={isTopCard ? onSwipe : undefined}
                onClick={isTopCard ? onAdvance : undefined}
                disabled={disabled}
                style={{
                    zIndex: 10 - position,
                }}
                aria-label={isTopCard ? "Swipe to next memory" : undefined}
            >

                <div className="polaroid">

                    <img
                        className="polaroid-image"
                        src={imageSrc}
                        alt={memory.description ? `Memory: ${memory.description}` : "Memory"}
                    />
                </div>

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

            </motion.button>
        );
    }

    {/* No Image - Postcard */}

    return (
        <motion.button
            key={`postcard-${index}`}
            type="button"
            className={`memory-card memory-postcard 
                ${isTopCard ? "memory-card-top" : ""}
            `}
            custom={position}
            variants={variants}
            initial="initial"
            animate="visible"
            exit="exit"
            drag={isTopCard ? "x" : false}
            dragConstraitns={{
                left: 0, right: 0,
            }}
            dragElastic={0.8}
            onDragEnd={isTopCard ? onSwipe : undefined}
            onClick={isTopCard ? onAdvance : undefined}
            disabled={disabled}
            style={{
                zIndex: 10 - position,
            }}
            aria-label={isTopCard ? "Swipe to next memory" : undefined}
        >

            {/* Postcard Stamp */}
            <div
                className="postcard-stamp"
                aria-hidden="true"
            >
                Heart
            </div>

            <div className="postcard-content">

                <p className="postcard-label">
                    A Memory
                </p>

                {memory.location && (
                    <div className="postcard-location">

                        <FontAwesomeIcon
                            icon={faLocationDot}
                            aria-hidden="true"
                        />

                        <span>
                            {memory.location}
                        </span>
                    </div>
                )}
            </div>

            <div className="postcard-footer">

                <span>
                    Swipe for next memory
                </span>

                <FontAwesomeIcon
                    icon={faArrowRight}
                    aria-hidden="true"
                />
            </div>

        </motion.button>
    );
}