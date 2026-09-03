import { useState } from "react";
import { motion } from "framer-motion";
import Sparkles from "../components/animations/Sparkles";

export default function Intro({
  	to = "My Love",
  	from = "Someone Who Adores You",
  	message = "This is where your love letter will appear.",
  	sparkle = "hearts",
  	color = "#ff6b81",
  	onComplete,
}) {

  	const [isOpen, setIsOpen] = useState(false);

  	const handleEnvelopeClick = () => {
    	const newIsOpen = !isOpen;

    	setIsOpen(newIsOpen);
    	onComplete?.(newIsOpen);
  	};

  	return (
    	<motion.div
			className="intro-scene"
			initial={{
				opacity: 0,
				y: 15,
			}}
			animate={{
				opacity: 1,
				y: 0,
			}}
			transition={{
				duration: 0.6,
				ease: "easeOut",
			}}
    	>

			{/* Envelope */}
			<section className="message-display">

				<button
					type="button"
					className="envelope-wrapper no-hover"
					onClick={handleEnvelopeClick}
					aria-expanded={isOpen}
					aria-label={
						isOpen
						? "Close Love Letter"
						: "Open Love Letter"
					}
					aria-controls="love-letter-content"
				>

				<div 
					className={`envelope ${isOpen ? "open" : ""}`}
				>

            		{/* Envelope Front Flap */}
					<div
					className="envelope-flap"
					style={{
						backgroundColor: lightenColor(color, 5)
					}}
					aria-hidden="true"
					/>

					{/* Envelope Back Flap */}
					<div
					className="envelope-flap-back"
					style={{
						backgroundColor: darkenColor(color, 5)
					}}
					aria-hidden="true"
					/>

					{/* Envelope Body */}
					<div
					className="envelope-body"
					style={{
						backgroundColor: color
					}}
					aria-hidden="true"
					/>

					{/* Sparkles */}
					<div aria-hidden="true">
						{isOpen && sparkle && (
							<Sparkles type={sparkle} />
						)}
					</div>

					{/* Letter Content */}
					{isOpen && (
						<div
							id="love-letter-content"
							className="letter"
							role="region"
							aria-live="polite"
							aria-label="Love Letter"
						>
							<p>
								Dear {to},
							</p>

							<p>
								{message}
							</p>

							<p>
								Sincerely, {from}
							</p>
						</div>
					)}
          		</div>
        	</button>
      	</section>
    </motion.div>
  );
}

// --------------
// Color Helpers
// --------------

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