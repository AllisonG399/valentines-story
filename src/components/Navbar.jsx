import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function Navbar({
    currentRoute,
    hasUnsavedChanges,
}) {

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);

    const reduceMotion = useReducedMotion();

    // Reference to the Cancel button to move keyboard focus into the modal when it opens
    const cancelButtonRef = useRef(null);

    /*  Handle Navigation
     *  If there are no unsaved changes, navigate immediately
     *  
     *  If there are unsaved changes, save the destination and show the confirmation modal instead.
     */
    const handleNavigation = (event, destination) => {
        event.preventDefault();

        const normalizedCurrentRoute = currentRoute || "#/";

        // Don't do anything if already on this page
        if (
            destination === normalizedCurrentRoute ||
            (
                destination === "/" &&
                normalizedCurrentRoute === "#/"
            )
        ) {
            return;
        }

        // No unsaved changes --> navigate immediately
        if (!hasUnsavedChanges) {
            navigate(destination);
            return;
        }

        // Unsaved changes --> save where the user wanted to go and show confirmation
        setPendingNavigation(destination);
        setShowConfirmModal(true);
    };

    // Perform navigation
    const navigate = (destination) => {

        if (destination === "/") {
            window.location.href = "/?skipIntro=true";
            return;
        }

        window.location.hash = destination;
    };

    // When modal opens, move focus to the Cancel button
    useEffect(() => {
        if (showConfirmModal) {
            cancelButtonRef.current?.focus();
        }
    }, [showConfirmModal]);

    // Allow Escape to close the modal
    useEffect(() => {
        if (!showConfirmModal) {
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setShowConfirmModal(false);
                setPendingNavigation(null);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [showConfirmModal]);

    // Cancel navigation
    const handleCancel = () => {
        setShowConfirmModal(false);
        setPendingNavigation(null);
    };

    // Confirm navigation
    const handleConfirm = () => {
        setShowConfirmModal(false);

        if (pendingNavigation) {
            navigate(pendingNavigation);
        }

        setPendingNavigation(null);
    };


    return (
        <>
            <nav>
                <div className="navbar">

                    {/* Logo */}
                    <a 
                        href="/?skipIntro=true"
                        className="logo"
                        onClick={(event) => handleNavigation(event, "/")}
                    >
                        Love Letter
                    </a>

                    <div className="nav-links">

                        {/* Home */}
                        <a
                            href="/?skipIntro=true"
                            className={currentRoute === "#/" ? "active" : ""}
                            onClick={(event) => handleNavigation(event, "/")}
                        >
                            Home
                        </a>

                        {/* Static Card */}
                        <a
                            href="#/create/message"
                            className={currentRoute === "#/create/message" ? "active" : ""}
                            onClick={(event) => handleNavigation(event, "#/create/message")}
                        >
                            Static Card
                        </a>

                        {/* Story Card */}
                        <a
                            href="#/create/story"
                            className={currentRoute === "#/create/story" ? "active" : ""}
                            onClick={(event) => handleNavigation(event, "#/create/story")}
                        >
                            Story Card
                        </a>

                    </div>
                </div>
            </nav>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirmModal && (
                    <motion.div
                        className="confirm-overlay"
                        role="presentation"
                        initial={reduceMotion ? false : {opacity: 0 }}
                        animate={{ opacity: 1}}
                        exit={reduceMotion ? undefined : {opacity: 0}}
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) {
                                handleCancel();
                            }
                        }}
                    >

                        <motion.div
                            className="confirm-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="confirm-title"
                            aria-describedby="confirm-description"
                            initial={
                                reduceMotion ? false : {
                                    opacity: 0,
                                    y: 20,
                                    scale: 0.96,
                                }
                            }
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            exit={
                                reduceMotion ? undefined : {
                                    opacity: 0,
                                    y: 10,
                                    scale: 0.98,
                                }
                            }
                            transition={{
                                duration: 0.25,
                                ease: "easeOut",
                            }}
                        >

                            <div
                                className="confirm-heart"
                                aria-hidden="true"
                            >
                                ♥
                            </div>

                            <h2
                                id="confirm-title"
                            >
                                Leave your Love Letter?
                            </h2>

                            <p
                                id="confirm-description"
                            >
                                Your current progress will be lost if you leave this page. Are you sure you want to continue?
                            </p>

                            <div className="confirm-actions">

                                {/* Cancel Button --> stay */}
                                <button
                                    ref={cancelButtonRef}
                                    type="button"
                                    className="cancel-btn"
                                    onClick={handleCancel}
                                >
                                    Keep Editing
                                </button>

                                {/* Confirm Button --> leave */}
                                <button
                                    type="button"
                                    className="confirm-btn"
                                    onClick={handleConfirm}
                                >
                                    Leave Page
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}