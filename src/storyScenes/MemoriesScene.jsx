import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faArrowRight, faLocationDot, faCalendar, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import stamp1 from "../assets/icons/stamp_1.png";
import stamp2 from "../assets/icons/stamp_2.png";
import stamp3 from "../assets/icons/stamp_3.png";

export default function MemoriesScene({
  memories = [],
  onComplete,
}) {

    const stamps = [
        stamp1,
        stamp2,
        stamp3,
    ];

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
            setCurrentMemory((previous) => previous + 1);

            setTimeout(() => {
                setIsAnimating(false);
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

        if (swipeDistance > 60 || swipeVelocity > 400) {
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

    /*-----------
    Scene Complete
    ------------*/
    useEffect(() => {

        if (
            memories.length > 0 &&
            currentMemory === memories.length - 1
        ) {
            onComplete?.(true);
        }

    }, [
        currentMemory,
        memories.length,
        onComplete,
    ]);


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
            rotate: 18,
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
            <h2 className="memories-header">
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
                                    isLastMemory={index === memories.length - 1}
                                    hasImage={stackHasImage}
                                    imageSrc={
                                        isTopCard && index === currentMemory 
                                            ? imageSrc 
                                            : stackMemory.image
                                    }
                                    variants={cardVariants}
                                    stamps={stamps}
                                    onSwipe={handleDragEnd}
                                    onAdvance={advanceMemory}
                                    disabled={!isTopCard || isAnimating}
                                />
                            );
                        })
                    }
                </AnimatePresence>
            </div>

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
    isLastMemory,
    hasImage,
    imageSrc,
    variants,
    stamps,
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
                drag={isTopCard && !isLastMemory ? "x" : false}
                dragConstraints={{
                    left: 0,
                    right: 0,
                }}
                dragElastic={0.6}
                onDragEnd={isTopCard ? onSwipe : undefined}
                onClick={isTopCard ? onAdvance : undefined}
                disabled={disabled}
                style={{
                    zIndex: 10 - position,
                }}
                aria-label={isTopCard ? "Swipe to next memory" : undefined}
            >
                <div className="polaroid-date">

                    <span>
                        {memory.date}
                    </span>

                    <FontAwesomeIcon
                        icon={faHeart}
                        aria-hidden="true"
                    />

                    <span>
                        {memory.location}
                    </span>
                </div>

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
            drag={isTopCard && !isLastMemory ? "x" : false}
            dragConstraints={{
                left: 0, right: 0,
            }}
            dragElastic={0.2}
            onDragEnd={isTopCard ? onSwipe : undefined}
            onClick={isTopCard ? onAdvance : undefined}
            disabled={disabled}
            style={{
                zIndex: 10 - position,
            }}
            stamps={stamps}
            aria-label={isTopCard ? "Swipe to next memory" : undefined}
        >

            <div className="postcard-content-left">

                <p className="postcard-label">
                    A Memory
                </p>

                <div className="postcard-description">
                    <p>
                        {memory.description}
                    </p>
                </div>

                
            </div>

            <div className="vertical-divider-cont" aria-hidden="true">
                <div className="vertical-divider-line"/>
            </div>

            {/* Post Card Content - Right Side */}
            <div className="postcard-content-right">

                {/* Postcard Stamp */}
                <div
                    className="postcard-stamp"
                    aria-hidden="true"
                >
                    <p className="postcard-date">
                        {memory.date || 
                            (index % 2 === 0
                                ? "Feels like yesterday"
                                : "Seems like forever ago"
                            )
                        }
                    </p>

                    <img
                        src={stamps[index % stamps.length]}
                        alt=""
                    />
                </div>

                {/* Memory Location */}
                <div className="postcard-location">
                    <p>
                        {memory.location || 
                            (index % 2 === 0 
                                ? "My favorite place with you"
                                : "My favorite place by your side"
                            )
                        }
                    </p>
                </div>
            </div>

        

        </motion.button>
    );
}