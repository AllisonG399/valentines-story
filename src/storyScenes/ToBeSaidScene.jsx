import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sparkles from "../components/animations/Sparkles";

export default function ToBeSaidScene({
    toBeSaid=[""],
    color="#ff6b81",
    sparkle = "hearts",
    onComplete
}) {

    const [isOpened, setIsOpened] = useState(false);
    const [currentNote, setCurrentNote] = useState(0);
    const [visibleNotes, setVisibleNotes] = useState([]);
    const [isComplete, setIsComplete] = useState(false);
    const [showSparkles, setShowSparkles] = useState(false);

     /* Opens envelope for select duration
        adds to be said note to top of stack
        hides envelope when no more notes are left */
    const handleEnvelopeClick = () => {

        if (isOpened) {
            return;
        }

        if (currentNote >= toBeSaid.length) {
            return;
        }

        const nextNote = toBeSaid[currentNote];

        // Add the new note to the stack
        setVisibleNotes((previous) => [
            ...previous,
            nextNote,
        ]);

        setCurrentNote((previous) => previous + 1);

        // Open envelope
        setIsOpened(true);

        // Automatically close envelope
        setTimeout(() => {
            setIsOpened(false);
        }, 1000);
    };

    useEffect(() => {

        if ( toBeSaid.length > 0 && visibleNotes.length === toBeSaid.length) {
            setShowSparkles(true);
            setIsComplete(true);
            onComplete?.(true);
        }
    }, [
        visibleNotes,
        toBeSaid.length,
        onComplete,
    ]);

    return (

        <motion.div
            className="said-scene"
            role="region"
            aria-labelledby="said-heading"
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
            <h2 
                className="said-header"
                id="said-heading"
            >
                Things I Don't Say Enough
            </h2>
            
            {/* Sticky Note Stack */}
            <div 
                className="said-note-stack"
                aria-live="polite"
                aria-atomic="true"
            >

                {visibleNotes.map((note, index) => {

                    const position = visibleNotes.length - 1 - index;

                    return (

                        <motion.div
                            key={`said-note-${index}`}
                            className="said-note"
                            role={position === 0 ? "group" : undefined}
                            aria-label={position === 0 ? "New message" : undefined }
                            style={{
                                backgroundColor: lightenColor(color, 75)
                            }}
                            initial={{
                                opacity: 0,
                                y: 100,
                                scale: 0.85,
                            }}
                            animate={{
                                opacity: 1,
                                x: position === 0
                                    ? 0
                                    : position % 2 === 0
                                        ? -10
                                        : 10,
                                y: position * 2,
                                scale: 1,
                                rotate: position === 0
                                    ? 0
                                    : position % 2 === 0
                                        ? -1.5
                                        : 1.5,
                            }}
                            transition={{
                                duration: 0.7,
                                ease: "easeOut",
                            }}
                        >

                            {/* Darker colored top header */}
                            <div 
                                className="said-note-header"
                                style={{
                                    backgroundColor: lightenColor(color, 70)
                                }}
                                aria-hidden="true"
                            />

                            {/* note content */}
                            <p>
                                {note}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Sparkles */}
            <div 
                className="said-sparkles-container"
                aria-hidden="true"
            >
                {showSparkles && (
                    <Sparkles type={sparkle} />
                )}
            </div>

            {/* Envelope */}
            <AnimatePresence>

                {!isComplete && (

                    <motion.div
                        className="said-envelope-cont"
                        initial={{
                            opacity: 1
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        transition={{
                            duration: 1.2,
                            delay: 1,
                            ease: "easeOut",
                        }}
                    >

                        <button
                            type="button"
                            className="button-wrapper-envelope"
                            onClick={handleEnvelopeClick}
                            aria-label={
                                isOpened
                                    ? "Envelope opening"
                                    : currentNote < toBeSaid.length
                                        ? "Open envelope to reveal the next note"
                                        : "All notes revealed"
                            }
                        >

                            <div className={`said-envelope-wrapper ${isOpened ? "open" : ""}`}>

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
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* Color Helpers */
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