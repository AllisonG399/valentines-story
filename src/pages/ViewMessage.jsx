import { useState } from 'react';


export default function ViewMessage() {

    const [isOpen, setIsOpen] = useState(false);
    const [to, setTo] = useState('');
    const [from, setFrom] = useState('');
    const [message, setMessage] = useState('');


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
                    Below is the valentine card written for you, from your special someone. Click on the envelope to open and read the message!
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
                            <p>Dear {to},</p>
                            <p>{message}</p>
                            <p>Sincerely, {from}</p>
                        </div>
                    </div>
                </div>  

            </section>
        </main>
    );
}