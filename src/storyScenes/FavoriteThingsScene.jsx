import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function FavoriteThingsScene({
    favoriteThingYouDo = "",
    favoritePhysicalThingAboutYou = "",
    favoriteThingYouSay = "",
    favoriteThingWeDoTogether = "",
    onComplete
}) {

    const favoriteThings = [
        {
            id: "thing-you-do",
            title: "Something you do",
            message: favoriteThingYouDo,
            point: 7,
        },
        {
            id: "physical",
            title: "Something about you",
            message: favoritePhysicalThingAboutYou,
            point: 5,
        },
        {
            id: "say",
            title: "Something you say",
            message: favoriteThingYouSay,
            point: 9,
        },
        {
            id: "together",
            title: "Something we do together",
            message: favoriteThingWeDoTogether,
            point: 15,
        },
    ];

    const [revealedThings, setRevealedThings] = useState([]);
    const [activeThing, setActiveThing] = useState(null);

    {/* Reveal  favorite thing */}
    const revealThing = (thing) => {

        setActiveThing(thing);

        setRevealedThings((previous) => {

            if (previous.includes(thing.id)) {
                return previous;
            }

            return [
                ...previous,
                thing.id,
            ];
        });
    };

    {/* Scene Complete */}
    useEffect(() => {

        if (revealedThings.length === 4) {
            onComplete?.(true);
        }

    }, [
        revealedThings,
        onComplete,
    ]);

    const allRevealed = revealedThings.length === favoriteThings.length;

    {/* Constellation Points */}
    const constellationPoints = [
        { id: 2, x: 32, y: 15 },
        { id: 3, x: 70, y: 15 },
        { id: 4, x: 22, y: 28 },
        { id: 5, x: 50, y: 28 },
        { id: 6, x: 78, y: 28 },
        { id: 7, x: 15, y: 43 },
        { id: 8, x: 50, y: 42 },
        { id: 9, x: 85, y: 43 },
        { id: 10, x: 22, y: 58 },
        { id: 11, x: 50, y: 62 },
        { id: 12, x: 78, y: 58 },
        { id: 13, x: 32, y: 72 },
        { id: 14, x: 68, y: 72 },
        { id: 15, x: 50, y: 86 },
    ];

    {/* Connections */}
    const connections = [
        [2, 4],
        [2, 5],

        [3, 5],
        [3, 6],

        [4, 7],
        [5, 8],
        [6, 9],

        [7, 10],
        [8, 10],
        [8, 11],
        [8, 12],
        [9, 12],

        [10, 13],
        [11, 13],
        [11, 14],
        [12, 14],

        [13, 15],
        [14, 15],
    ];

    return (
        <motion.div
            className="favorites-scene"
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: 1
            }}
            transition={{
                duration: 0.6,
            }}
        >
            
            {/* Header */}
            <motion.h2
                className="favorites-header"
                initial={{
                    opacity: 0,
                    y: -15,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.7,
                }}
            >
                The Little Things I Love About You
            </motion.h2>

            {/* Constellation */}
            <motion.div
                className={`favorite-constellation ${
                    allRevealed
                        ? "constellation-complete"
                        : ""
                }`}
            >

                {/* Connecting Lines */}

                <svg
                    className="constellation-lines"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >

                    {connections.map(
                        ([from, to]) => {

                            const start =
                                constellationPoints.find(
                                    (point) =>
                                        point.id === from
                                );

                            const end =
                                constellationPoints.find(
                                    (point) =>
                                        point.id === to
                                );

                            return (
                                <motion.line
                                    key={`${from}-${to}`}

                                    x1={start.x}
                                    y1={start.y}

                                    x2={end.x}
                                    y2={end.y}

                                    initial={{
                                        opacity: 0,
                                    }}

                                    animate={{
                                        opacity:
                                            allRevealed
                                                ? 0.7
                                                : 0.25,
                                    }}

                                    transition={{
                                        duration: 0.8,
                                    }}
                                />
                            );
                        }
                    )}

                </svg>


                {/* Decorative Stars */}

                {constellationPoints.map(
                    (point) => (

                        <motion.div
                            key={point.id}

                            className="constellation-star"

                            style={{
                                left: `${point.x}%`,
                                top: `${point.y}%`,
                            }}

                            initial={{
                                opacity: 0,
                                scale: 0,
                            }}

                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}

                            transition={{
                                duration: 0.5,
                                delay: point.id * 0.05,
                            }}
                        >
                            ✦
                        </motion.div>

                    )
                )}


                {/* Interactive Hearts */}

                {favoriteThings.map((thing) => {

                    const point = constellationPoints.find(
                        (point) => point.id === thing.point
                    );

                    const isRevealed =
                        revealedThings.includes(thing.id);

                    return (
                        <motion.button
                            key={thing.id}

                            type="button"

                            className={`
                                favorite-heart
                                ${
                                    isRevealed
                                        ? "favorite-heart-revealed"
                                        : ""
                                }
                            `}

                            style={{
                                left: `${point.x}%`,
                                top: `${point.y}%`,
                            }}

                            onClick={() =>
                                revealThing(thing)
                            }

                            whileHover={{
                                scale: 1.2,
                            }}

                            whileTap={{
                                scale: 0.9,
                            }}

                            animate={
                                isRevealed
                                    ? {
                                        scale: [1, 1.2, 1],
                                    }
                                    : {
                                        scale: 1,
                                    }
                            }

                            transition={{
                                duration: 0.4,
                            }}

                            aria-label={`Reveal ${thing.title}`}
                        >
                            {isRevealed ? "♥" : "♡"}
                        </motion.button>
                    );
                })}

            </motion.div>


            {/* Revealed Message */}

            <div className="favorite-reveal-area">

                <AnimatePresence mode="wait">

                    {activeThing && (

                        <motion.div
                            key={activeThing.id}

                            className="favorite-message"

                            initial={{
                                opacity: 0,
                                y: 15,
                                scale: 0.95,
                            }}

                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}

                            exit={{
                                opacity: 0,
                                y: -10,
                                scale: 0.95,
                            }}

                            transition={{
                                duration: 0.4,
                            }}
                        >

                            <p className="favorite-message-title">
                                {activeThing.title}
                            </p>

                            <p className="favorite-message-text">
                                {activeThing.message}
                            </p>

                        </motion.div>

                    )}

                </AnimatePresence>

            </div>

            

        </motion.div>
    );
}