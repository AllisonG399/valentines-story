import { useState } from 'react';


export default function ViewMessage() {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <main className="view-message">
            {/* Header */}
            <header className="header">
                <h1 className="site-title">Valentines Story</h1>
                <div className="divider" />
            </header>

            {/* Hero */}
            <section className="hero view-hero">
                <h2 className="hero-title">
                    Your Valentine Message
                </h2>
                <p className="hero-subtitle">
                    Below is the message you created for your Valentine. You can share this page with them so they can see your heartfelt message.
                </p>
                <div className="divider-heart">
                    <div className="divider" />
                    <span className="heart">♥</span>
                    <div className="divider" />
                </div>
            </section>

            <section className="message-display">
                {/* This is where the message content will be displayed */}
                <div className="envelope-wrapper" onClick={() => setIsOpen(!isOpen)}>
                    <div className={`envelope ${isOpen ? "open" : ""}`}>
                        <div className="envelope-flap"></div>
                        <div className="envelope-body"></div>

                        <div className={`letter ${isOpen ? "show-letter" : ""}`}>
                            <p>Happy Valentine’s Day 💖</p>
                        </div>
                    </div>
                </div>  

            </section>
        </main>
    );
}