import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function MakeMeFeelScene({
    theWayYou = "",
    makeMeFeel = "",
    color = "#ff6b81",
    onComplete,
}) {

  /*
  --------------------------------
  Scene Stages
  --------------------------------

  0 = Type "The Way You..."
  1 = Show first cover
  2 = Type theWayYou
  3 = Type "Makes Me Feel..."
  4 = Show second cover
  5 = Type makeMeFeel
  6 = Scene complete
  */

  const [stage, setStage] = useState(0);

  const [displayText, setDisplayText] = useState("");

  const [isTyping, setIsTyping] = useState(false);


  /*
  --------------------------------
  Typewriter
  --------------------------------
  */

  useEffect(() => {

    let textToType = "";

    /*
    Determine what text belongs
    to the current stage.
    */

    switch (stage) {

      case 0:
        textToType = "The Way You...";
        break;

      case 2:
        textToType = theWayYou;
        break;

      case 3:
        textToType = "Makes Me Feel...";
        break;

      case 5:
        textToType = makeMeFeel;
        break;

      default:
        return;
    }


    /*
    Reset displayed text
    */

    setDisplayText("");
    setIsTyping(true);


    /*
    Start typewriter
    */

    let index = 0;

    // Delay before typing starts
    const delay = setTimeout(() => {

        const interval = setInterval(() => {

        index++;

        setDisplayText(
            textToType.slice(0, index)
        );

        if (index >= textToType.length) {

            clearInterval(interval);
            setIsTyping(false);

            if (stage === 0) {
            setStage(1);
            }

            if (stage === 2) {
            setStage(3);
            }

            if (stage === 3) {
            setStage(4);
            }

            if (stage === 5) {
            setStage(6);
            }
        }

        }, 60);

        // Store interval so cleanup can clear it
        return () => clearInterval(interval);

    }, 800);

    return () => {
        clearTimeout(delay);
    };

  }, [
    stage,
    theWayYou,
    makeMeFeel,
  ]);


  /*
  --------------------------------
  Reveal Button
  --------------------------------
  */

  const handleReveal = () => {

    /*
    First cover
    */

    if (stage === 1) {
      setStage(2);
      return;
    }


    /*
    Second cover
    */

    if (stage === 4) {
      setStage(5);
      return;
    }

  };


    /*
    --------------------------------
    Scene Complete
    --------------------------------
    */

    useEffect(() => {

        if (stage === 6) {
        onComplete?.(true);
        }

    }, [
        stage,
        onComplete,
    ]);


    /*
    --------------------------------
    Render
    --------------------------------
    */

    return (

        <motion.div
            className="make-me-feel-scene"
            style={{
                "--feel-scene-color": color,
            }}

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


            {/* =================================
                THE WAY YOU
            ================================== */}

            <div className="typing-cont">

                {/* Title / Typewriter */}

                <p className="makes-me-feel-title">

                    {stage <= 1
                        ? displayText
                        : "The Way You..."
                    }

                    {stage === 0 && isTyping && (
                        <span
                        className="typing-cursor"
                        aria-hidden="true"
                        >
                        |
                        </span>
                    )}

                </p>


                {/* ---------------------------------
                    First Hidden Response
                ---------------------------------- */}

                <div className="hidden-cont">

                    {/* Actual response */}

                    <p className="makes-me-feel-text">

                        {stage === 2
                        ? displayText
                        : stage > 2
                            ? theWayYou
                            : ""
                        }

                        {stage === 2 && isTyping && (
                        <span
                            className="typing-cursor"
                            aria-hidden="true"
                        >
                            |
                        </span>
                        )}

                    </p>


                    {/* ---------------------------------
                        First Cover
                    ---------------------------------- */}

                    <AnimatePresence>

                        {stage === 1 && (

                        <motion.button
                            type="button"
                            className="overlay-button"

                            initial={{
                            y: 0,
                            opacity: 1,
                            }}

                            exit={{
                            y: "-100%",
                            opacity: 0,
                            }}

                            transition={{
                            duration: 0.6,
                            ease: "easeInOut",
                            }}

                            onClick={handleReveal}
                        >
                           ✦ Click to Reveal ✦
                        </motion.button>

                        )}

                    </AnimatePresence>

                </div>

            </div>


            {/* =================================
                MAKES ME FEEL
            ================================== */}

            {stage >= 3 && (

                <div className="typing-cont">


                {/* Title */}

                <p className="makes-me-feel-title">

                    {stage === 3
                    ? displayText
                    : "Makes Me Feel..."
                    }

                    {stage === 3 && isTyping && (
                        <span
                            className="typing-cursor"
                            aria-hidden="true"
                        >
                            |
                        </span>
                    )}
                </p>


                {/* ---------------------------------
                    Final Hidden Response
                ---------------------------------- */}

                <div className="hidden-cont">

                    {/* Actual response */}

                    <p className="makes-me-feel-text">

                        {stage === 5
                            ? displayText
                            : stage === 6
                            ? makeMeFeel
                            : ""
                        }

                        {stage === 5 && isTyping && (
                            <span
                            className="typing-cursor"
                            aria-hidden="true"
                            >
                            |
                            </span>
                        )}

                    </p>


                    {/* ---------------------------------
                        Second Cover
                    ---------------------------------- */}

                    <AnimatePresence>

                        {stage === 4 && (

                            <motion.button
                                type="button"
                                className="overlay-button"

                                initial={{
                                    y: 0,
                                    opacity: 1,
                                }}

                                exit={{
                                    y: "-100%",
                                    opacity: 0,
                                }}

                                transition={{
                                    duration: 0.6,
                                    ease: "easeInOut",
                                }}

                                onClick={handleReveal}
                                >
                                ✦ Click to Reveal ✦
                            </motion.button>

                        )}

                    </AnimatePresence>

                </div>

            </div>

            )}

        </motion.div>
    );
}