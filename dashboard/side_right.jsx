// Using global React instead of imports for in-browser Babel compatibility
// import React, { useRef, useEffect, useState } from 'react';

// Access React hooks from global React
const { useRef, useEffect, useState } = React;
// Access Chart component from global scope
const Chart = window.ChartComponent;

/**
 * Right side panel component
 * Displays information about the best agent, visualizes its neural network,
 * and shows matches being played by agents
 */
const SideRight = ({ data }) => {
    const neuralNetworkCanvasRef = useRef(null);
    const matchCanvasRef = useRef(null);
    const [activeTab, setActiveTab] = useState('best-agent');
    const [matches, setMatches] = useState([]);
    const [currentMatch, setCurrentMatch] = useState(null);
    
    if (!data || !data.current || !data.best_agent) {
        return <div className="dashboard-side-right">Loading data...</div>;
    }
    
    const { current, best_agent } = data;
    
    // Simulate matches being played by agents
    useEffect(() => {
        // This would be replaced by real match data from the backend
        const simulateMatches = () => {
            // Generate random match data for demonstration
            const newMatch = {
                id: Date.now(),
                agent: `Agent-${Math.floor(Math.random() * current.alive_agents)}`,
                score: Math.floor(Math.random() * 10),
                steps: Math.floor(Math.random() * 100) + 50,
                energy: Math.floor(Math.random() * 50),
                timestamp: new Date().toLocaleTimeString(),
                state: {
                    snake: [
                        { x: 12, y: 12 },
                        { x: 11, y: 12 },
                        { x: 10, y: 12 }
                    ],
                    food: { x: 15, y: 12 },
                    direction: { x: 1, y: 0 }
                }
            };
            
            setCurrentMatch(newMatch);
            setMatches(prev => [newMatch, ...prev].slice(0, 10)); // Keep only the 10 most recent matches
            
            // Update match state (move snake)
            if (currentMatch) {
                const updatedMatch = { ...currentMatch };
                const head = { ...updatedMatch.state.snake[0] };
                const food = updatedMatch.state.food;
                const direction = updatedMatch.state.direction;
                
                // Move head in current direction
                head.x += direction.x;
                head.y += direction.y;
                
                // Check if snake ate food
                if (head.x === food.x && head.y === food.y) {
                    updatedMatch.score++;
                    updatedMatch.energy += 50;
                    
                    // Generate new food
                    updatedMatch.state.food = {
                        x: Math.floor(Math.random() * 25),
                        y: Math.floor(Math.random() * 25)
                    };
                } else {
                    // Remove tail
                    updatedMatch.state.snake.pop();
                    updatedMatch.energy--;
                }
                
                // Add new head
                updatedMatch.state.snake.unshift(head);
                updatedMatch.steps++;
                
                setCurrentMatch(updatedMatch);
            }
            
            // Draw current match
            drawMatch();
        };
        
        // Simulate matches every 1 second
        const interval = setInterval(simulateMatches, 1000);
        
        return () => clearInterval(interval);
    }, [current, currentMatch]);
    
    // Draw the current match on the canvas
    const drawMatch = () => {
        if (!matchCanvasRef.current || !currentMatch) return;
        
        const canvas = matchCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const cellSize = 10; // Smaller cells for the match visualization
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= 25; i++) {
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, 25 * cellSize);
            ctx.stroke();
            
            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(25 * cellSize, i * cellSize);
            ctx.stroke();
        }
        
        // Draw snake
        ctx.fillStyle = '#4CAF50';
        for (let i = 1; i < currentMatch.state.snake.length; i++) {
            ctx.fillRect(
                currentMatch.state.snake[i].x * cellSize,
                currentMatch.state.snake[i].y * cellSize,
                cellSize,
                cellSize
            );
        }
        
        // Draw head
        ctx.fillStyle = '#388E3C';
        ctx.fillRect(
            currentMatch.state.snake[0].x * cellSize,
            currentMatch.state.snake[0].y * cellSize,
            cellSize,
            cellSize
        );
        
        // Draw food
        ctx.fillStyle = '#F44336';
        ctx.beginPath();
        ctx.arc(
            currentMatch.state.food.x * cellSize + cellSize / 2,
            currentMatch.state.food.y * cellSize + cellSize / 2,
            cellSize / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    };
    
    // Draw neural network visualization when component mounts or data changes
    useEffect(() => {
        if (!neuralNetworkCanvasRef.current || !best_agent || !best_agent.weights) return;
        
        const canvas = neuralNetworkCanvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Neural network architecture
        const inputSize = 24;  // 8 directions x 3 inputs (distance, food, danger)
        const hiddenSize = 16;
        const outputSize = 4;  // up, down, left, right
        
        // Calculate positions
        const padding = 30;
        const nodeRadius = 10;
        const layerSpacing = (canvas.width - 2 * padding) / 2;
        const inputSpacing = (canvas.height - 2 * padding) / (inputSize - 1);
        const hiddenSpacing = (canvas.height - 2 * padding) / (hiddenSize - 1);
        const outputSpacing = (canvas.height - 2 * padding) / (outputSize - 1);
        
        // Draw connections first (so they appear behind nodes)
        drawConnections(
            ctx, 
            best_agent.weights, 
            inputSize, 
            hiddenSize, 
            outputSize,
            padding,
            layerSpacing,
            inputSpacing,
            hiddenSpacing,
            outputSpacing,
            nodeRadius
        );
        
        // Draw nodes
        drawNodes(
            ctx, 
            inputSize, 
            hiddenSize, 
            outputSize,
            padding,
            layerSpacing,
            inputSpacing,
            hiddenSpacing,
            outputSpacing,
            nodeRadius
        );
        
        // Draw labels
        drawLabels(
            ctx,
            padding,
            layerSpacing,
            canvas.height
        );
        
    }, [best_agent]);
    
    // Draw neural network connections
    const drawConnections = (
        ctx, 
        weights, 
        inputSize, 
        hiddenSize, 
        outputSize,
        padding,
        layerSpacing,
        inputSpacing,
        hiddenSpacing,
        outputSpacing,
        nodeRadius
    ) => {
        // Reshape weights
        const inputHiddenSize = inputSize * hiddenSize;
        const hiddenBiasSize = hiddenSize;
        const hiddenOutputSize = hiddenSize * outputSize;
        
        // Extract weights for input-hidden connections
        const inputHiddenWeights = weights.slice(0, inputHiddenSize);
        
        // Extract weights for hidden-output connections
        const hiddenOutputWeights = weights.slice(
            inputHiddenSize + hiddenBiasSize, 
            inputHiddenSize + hiddenBiasSize + hiddenOutputSize
        );
        
        // Draw input-hidden connections
        for (let i = 0; i < inputSize; i++) {
            const inputX = padding;
            const inputY = padding + i * inputSpacing;
            
            for (let h = 0; h < hiddenSize; h++) {
                const hiddenX = padding + layerSpacing;
                const hiddenY = padding + h * hiddenSpacing;
                
                const weight = inputHiddenWeights[i * hiddenSize + h];
                const normalizedWeight = Math.max(-1, Math.min(1, weight));
                
                // Set line width based on weight magnitude
                ctx.lineWidth = Math.abs(normalizedWeight) * 3;
                
                // Set color based on weight sign
                if (normalizedWeight > 0) {
                    ctx.strokeStyle = `rgba(0, 128, 0, ${Math.abs(normalizedWeight)})`;
                } else {
                    ctx.strokeStyle = `rgba(255, 0, 0, ${Math.abs(normalizedWeight)})`;
                }
                
                // Draw line
                ctx.beginPath();
                ctx.moveTo(inputX + nodeRadius, inputY);
                ctx.lineTo(hiddenX - nodeRadius, hiddenY);
                ctx.stroke();
            }
        }
        
        // Draw hidden-output connections
        for (let h = 0; h < hiddenSize; h++) {
            const hiddenX = padding + layerSpacing;
            const hiddenY = padding + h * hiddenSpacing;
            
            for (let o = 0; o < outputSize; o++) {
                const outputX = padding + 2 * layerSpacing;
                const outputY = padding + o * outputSpacing;
                
                const weight = hiddenOutputWeights[h * outputSize + o];
                const normalizedWeight = Math.max(-1, Math.min(1, weight));
                
                // Set line width based on weight magnitude
                ctx.lineWidth = Math.abs(normalizedWeight) * 3;
                
                // Set color based on weight sign
                if (normalizedWeight > 0) {
                    ctx.strokeStyle = `rgba(0, 128, 0, ${Math.abs(normalizedWeight)})`;
                } else {
                    ctx.strokeStyle = `rgba(255, 0, 0, ${Math.abs(normalizedWeight)})`;
                }
                
                // Draw line
                ctx.beginPath();
                ctx.moveTo(hiddenX + nodeRadius, hiddenY);
                ctx.lineTo(outputX - nodeRadius, outputY);
                ctx.stroke();
            }
        }
    };
    
    // Draw neural network nodes
    const drawNodes = (
        ctx, 
        inputSize, 
        hiddenSize, 
        outputSize,
        padding,
        layerSpacing,
        inputSpacing,
        hiddenSpacing,
        outputSpacing,
        nodeRadius
    ) => {
        // Draw input nodes
        ctx.fillStyle = '#2196F3';
        for (let i = 0; i < inputSize; i++) {
            const x = padding;
            const y = padding + i * inputSpacing;
            
            ctx.beginPath();
            ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw hidden nodes
        ctx.fillStyle = '#9C27B0';
        for (let h = 0; h < hiddenSize; h++) {
            const x = padding + layerSpacing;
            const y = padding + h * hiddenSpacing;
            
            ctx.beginPath();
            ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw output nodes
        ctx.fillStyle = '#4CAF50';
        for (let o = 0; o < outputSize; o++) {
            const x = padding + 2 * layerSpacing;
            const y = padding + o * outputSpacing;
            
            ctx.beginPath();
            ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Add output labels
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            
            const actions = ['Up', 'Down', 'Left', 'Right'];
            ctx.fillText(actions[o], x + nodeRadius + 5, y);
        }
    };
    
    // Draw layer labels
    const drawLabels = (
        ctx,
        padding,
        layerSpacing,
        canvasHeight
    ) => {
        ctx.fillStyle = '#000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        
        // Input layer label
        ctx.fillText('Input Layer', padding, canvasHeight - 10);
        
        // Hidden layer label
        ctx.fillText('Hidden Layer', padding + layerSpacing, canvasHeight - 10);
        
        // Output layer label
        ctx.fillText('Output Layer', padding + 2 * layerSpacing, canvasHeight - 10);
    };
    
    return (
        <div className="dashboard-side-right">
            <div className="tabs">
                <button 
                    className={activeTab === 'best-agent' ? 'active' : ''} 
                    onClick={() => setActiveTab('best-agent')}
                >
                    Best Agent
                </button>
                <button 
                    className={activeTab === 'matches' ? 'active' : ''} 
                    onClick={() => setActiveTab('matches')}
                >
                    Agent Matches
                </button>
            </div>
            
            {activeTab === 'best-agent' && (
                <div className="tab-content">
                    <h2>Best Agent</h2>
                    
                    <div className="agent-stats">
                        <div className="stat-card">
                            <h3>Fitness</h3>
                            <div className="stat-value">{best_agent.fitness.toFixed(2)}</div>
                        </div>
                        
                        <div className="stat-card">
                            <h3>Food Eaten</h3>
                            <div className="stat-value">{best_agent.food_eaten}</div>
                        </div>
                        
                        <div className="stat-card">
                            <h3>Snake Size</h3>
                            <div className="stat-value">{best_agent.food_eaten + 3}</div>
                        </div>
                        
                        <div className="stat-card">
                            <h3>Steps Taken</h3>
                            <div className="stat-value">{best_agent.steps_taken}</div>
                        </div>
                    </div>
                    
                    <div className="neural-network-container">
                        <h3>Neural Network Visualization</h3>
                        <canvas 
                            ref={neuralNetworkCanvasRef} 
                            width={600} 
                            height={500} 
                            className="neural-network-canvas"
                        />
                        
                        <div className="network-legend">
                            <div className="legend-item">
                                <div className="legend-color" style={{ backgroundColor: '#2196F3' }}></div>
                                <span>Input Neurons (24): 8 directions × 3 inputs (distance, food, danger)</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color" style={{ backgroundColor: '#9C27B0' }}></div>
                                <span>Hidden Neurons (16)</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color" style={{ backgroundColor: '#4CAF50' }}></div>
                                <span>Output Neurons (4): Up, Down, Left, Right</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color" style={{ 
                                    background: 'linear-gradient(to right, rgba(255,0,0,0.7), rgba(0,128,0,0.7))' 
                                }}></div>
                                <span>Connections: Red (negative weight), Green (positive weight)</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="agent-info">
                        <h3>Agent Information</h3>
                        <p>Generation: {best_agent.generation}</p>
                        <p>Total Weights: {best_agent.weights.length}</p>
                        <p>Network Architecture: 24-16-4</p>
                    </div>
                </div>
            )}
            
            {activeTab === 'matches' && (
                <div className="tab-content">
                    <h2>Agent Matches</h2>
                    
                    <div className="matches-container">
                        <div className="current-match">
                            <h3>Current Match</h3>
                            <canvas 
                                ref={matchCanvasRef} 
                                width={250} 
                                height={250} 
                                className="match-canvas"
                            />
                            
                            {currentMatch && (
                                <div className="match-stats">
                                    <p><strong>Agent:</strong> {currentMatch.agent}</p>
                                    <p><strong>Score:</strong> {currentMatch.score}</p>
                                    <p><strong>Steps:</strong> {currentMatch.steps}</p>
                                    <p><strong>Energy:</strong> {currentMatch.energy}</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="match-list">
                            <h3>Recent Matches</h3>
                            <table className="matches-table">
                                <thead>
                                    <tr>
                                        <th>Agent</th>
                                        <th>Score</th>
                                        <th>Steps</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matches.map(match => (
                                        <tr key={match.id}>
                                            <td>{match.agent}</td>
                                            <td>{match.score}</td>
                                            <td>{match.steps}</td>
                                            <td>{match.timestamp}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="match-statistics">
                        <h3>Match Statistics</h3>
                        <div className="stat-cards">
                            <div className="stat-card">
                                <h4>Total Matches</h4>
                                <div className="stat-value">{matches.length}</div>
                            </div>
                            <div className="stat-card">
                                <h4>Avg Score</h4>
                                <div className="stat-value">
                                    {matches.length > 0 
                                        ? (matches.reduce((sum, match) => sum + match.score, 0) / matches.length).toFixed(1) 
                                        : '0.0'}
                                </div>
                            </div>
                            <div className="stat-card">
                                <h4>Avg Steps</h4>
                                <div className="stat-value">
                                    {matches.length > 0 
                                        ? Math.round(matches.reduce((sum, match) => sum + match.steps, 0) / matches.length) 
                                        : '0'}
                                </div>
                            </div>
                            <div className="stat-card">
                                <h4>Best Score</h4>
                                <div className="stat-value">
                                    {matches.length > 0 
                                        ? Math.max(...matches.map(match => match.score)) 
                                        : '0'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Expose SideRight component to global scope
window.SideRightComponent = SideRight;

// Also export as default for module systems
export default SideRight;