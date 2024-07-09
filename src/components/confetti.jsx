import React, { useEffect } from 'react';

const Confetti = () => {
    useEffect(() => {
        // Function to create a random confetti element
        function createRandomConfetti() {
            const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"];
            const confetti = document.createElement("div");
            confetti.className = "confetti";
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.animationDuration = (Math.random() * 2 + 1) + "s";
            return confetti;
        }

        // Create and append multiple random confetti elements
        const numConfetti = 50; // Adjust the number of confetti pieces
        const confettiContainer = document.getElementById('confetti-container');

        for (let i = 0; i < numConfetti; i++) {
            const confetti = createRandomConfetti();
            confettiContainer.appendChild(confetti);
        }
    }, []);

    return (
        <div id="confetti-container" style={{ position: 'relative', top: -40, left: 0, height: '380px', overflow: 'hidden', zIndex: 1 }}>
        </div>
    );
};

export default Confetti;
