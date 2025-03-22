// Using global React instead of imports for in-browser Babel compatibility
// import React from 'react';

// Access React hooks from global React
const { useState, useEffect } = React;

/**
 * Footer component
 * Displays credits, links to the project, and training controls
 */
const Footer = () => {
    // State for training controls
    const [isTraining, setIsTraining] = useState(false);
    const [showTrainingForm, setShowTrainingForm] = useState(false);
    const [trainingParams, setTrainingParams] = useState({
        epochs: 100,
        population_size: 100,
        mutation_rate: 0.1,
        crossover_rate: 0.7,
        elitism: 0.1,
        games_per_agent: 3
    });
    const [statusMessage, setStatusMessage] = useState('');

    // Check if training is active on component mount
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const status = await window.checkTrainingStatus();
                setIsTraining(status.active);
                
                if (status.active) {
                    setStatusMessage('Training is active');
                    // Start polling for updates
                    window.startPolling((data) => {
                        // This callback will be called with the latest data
                        console.log('Training update:', data);
                        // You could dispatch an event or call a function to update the dashboard
                        const event = new CustomEvent('training-update', { detail: data });
                        window.dispatchEvent(event);
                    });
                }
            } catch (error) {
                console.error('Error checking training status:', error);
            }
        };
        
        checkStatus();
        
        // Clean up polling on unmount
        return () => {
            window.stopPolling();
        };
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTrainingParams({
            ...trainingParams,
            [name]: name === 'epochs' || name === 'population_size' || name === 'games_per_agent' 
                ? parseInt(value, 10) 
                : parseFloat(value)
        });
    };

    // Handle start training button click
    const handleStartTraining = async () => {
        try {
            setStatusMessage('Starting training...');
            const response = await window.startTraining(trainingParams);
            
            if (response.status === 'success') {
                setIsTraining(true);
                setShowTrainingForm(false);
                setStatusMessage('Training started successfully');
                
                // Start polling for updates
                window.startPolling((data) => {
                    // This callback will be called with the latest data
                    console.log('Training update:', data);
                    // Dispatch an event that the dashboard can listen for
                    const event = new CustomEvent('training-update', { detail: data });
                    window.dispatchEvent(event);
                });
            } else {
                setStatusMessage(`Error: ${response.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error starting training:', error);
            setStatusMessage(`Error: ${error.message || 'Unknown error'}`);
        }
    };

    // Handle stop training button click
    const handleStopTraining = async () => {
        try {
            setStatusMessage('Stopping training...');
            const response = await window.stopTraining();
            
            if (response.status === 'success') {
                setIsTraining(false);
                setStatusMessage('Training stopped successfully');
                window.stopPolling();
            } else {
                setStatusMessage(`Error: ${response.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error stopping training:', error);
            setStatusMessage(`Error: ${error.message || 'Unknown error'}`);
        }
    };

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
                
                <div className="footer-section training-controls">
                    <h3>Training Controls</h3>
                    
                    {statusMessage && (
                        <div className="status-message">
                            {statusMessage}
                        </div>
                    )}
                    
                    <div className="training-buttons">
                        {!isTraining ? (
                            <>
                                <button 
                                    className="start-training-btn"
                                    onClick={() => setShowTrainingForm(!showTrainingForm)}
                                >
                                    {showTrainingForm ? 'Hide Form' : 'Start Training'}
                                </button>
                                
                                {showTrainingForm && (
                                    <div className="training-form">
                                        <h4>Training Parameters</h4>
                                        <div className="form-group">
                                            <label htmlFor="epochs">Generations:</label>
                                            <input 
                                                type="number" 
                                                id="epochs" 
                                                name="epochs"
                                                value={trainingParams.epochs}
                                                onChange={handleInputChange}
                                                min="1"
                                                max="10000"
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="population_size">Population Size:</label>
                                            <input 
                                                type="number" 
                                                id="population_size" 
                                                name="population_size"
                                                value={trainingParams.population_size}
                                                onChange={handleInputChange}
                                                min="10"
                                                max="1000"
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="mutation_rate">Mutation Rate:</label>
                                            <input 
                                                type="number" 
                                                id="mutation_rate" 
                                                name="mutation_rate"
                                                value={trainingParams.mutation_rate}
                                                onChange={handleInputChange}
                                                min="0"
                                                max="1"
                                                step="0.01"
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="crossover_rate">Crossover Rate:</label>
                                            <input 
                                                type="number" 
                                                id="crossover_rate" 
                                                name="crossover_rate"
                                                value={trainingParams.crossover_rate}
                                                onChange={handleInputChange}
                                                min="0"
                                                max="1"
                                                step="0.01"
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="elitism">Elitism:</label>
                                            <input 
                                                type="number" 
                                                id="elitism" 
                                                name="elitism"
                                                value={trainingParams.elitism}
                                                onChange={handleInputChange}
                                                min="0"
                                                max="1"
                                                step="0.01"
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="games_per_agent">Games per Agent:</label>
                                            <input 
                                                type="number" 
                                                id="games_per_agent" 
                                                name="games_per_agent"
                                                value={trainingParams.games_per_agent}
                                                onChange={handleInputChange}
                                                min="1"
                                                max="10"
                                            />
                                        </div>
                                        
                                        <button 
                                            className="confirm-training-btn"
                                            onClick={handleStartTraining}
                                        >
                                            Start Training
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <button 
                                className="stop-training-btn"
                                onClick={handleStopTraining}
                            >
                                Stop Training
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Snake Game Genetic Algorithm POC. Licensed under the MIT License.</p>
            </div>
        </footer>
    );
};

// Expose Footer component to global scope
window.FooterComponent = Footer;

// Also export as default for module systems
export default Footer;