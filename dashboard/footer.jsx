// Using global React instead of imports for in-browser Babel compatibility
// import React from 'react';

/**
 * Footer component
 * Displays credits and links to the project
 */
const Footer = () => {
    return (
        <footer className="dashboard-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Snake Game Genetic Algorithm POC</h3>
                    <p>
                        A proof of concept for studying genetic algorithms applied to training AI agents
                        to play games, inspired by the video 
                        <a 
                            href="https://youtu.be/awz1ghokP3k?si=eEdP3qjcGEfEMdqY" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            Rede Neural aprendendo a jogar o jogo da cobrinha (SNAKE)
                        </a>
                    </p>
                </div>
                
                <div className="footer-section">
                    <h3>Project Links</h3>
                    <ul>
                        <li>
                            <a 
                                href="https://github.com/seu-usuario/poc_genetic_algorithms" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                GitHub Repository
                            </a>
                        </li>
                        <li>
                            <a 
                                href="/game/snake_game.html" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Play Snake Game
                            </a>
                        </li>
                    </ul>
                </div>
                
                <div className="footer-section">
                    <h3>Technologies</h3>
                    <ul>
                        <li>JavaScript/HTML5 Canvas (Game)</li>
                        <li>Python (Genetic Algorithm)</li>
                        <li>React (Dashboard)</li>
                        <li>Chart.js (Data Visualization)</li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Snake Game Genetic Algorithm POC. Licensed under the MIT License.</p>
            </div>
        </footer>
    );
};

// Expose Footer component to global scope
window.Footer = Footer;

// Also export as default for module systems
export default Footer;