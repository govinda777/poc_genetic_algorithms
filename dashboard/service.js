/**
 * Service for fetching genetic algorithm data
 * 
 * This module provides functions to fetch training data from the genetic algorithm,
 * either from local JSON files or via a WebSocket/REST API, and control the training process.
 */

/**
 * Start a new training session
 * @param {Object} params - Training parameters
 * @param {number} [params.epochs=100] - Number of generations to train
 * @param {number} [params.population_size=100] - Size of the population
 * @param {number} [params.mutation_rate=0.1] - Mutation rate
 * @param {number} [params.crossover_rate=0.7] - Crossover rate
 * @param {number} [params.elitism=0.1] - Elitism rate
 * @param {number} [params.games_per_agent=3] - Number of games per agent
 * @returns {Promise<Object>} Response from the server
 */
async function startTraining(params = {}) {
    try {
        const response = await fetch('/api/train', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error starting training:', error);
        throw error;
    }
}

/**
 * Stop the current training session
 * @returns {Promise<Object>} Response from the server
 */
async function stopTraining() {
    try {
        const response = await fetch('/api/train/stop', {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error stopping training:', error);
        throw error;
    }
}

/**
 * Check the status of the current training session
 * @returns {Promise<Object>} Training status and data
 */
async function checkTrainingStatus() {
    try {
        const response = await fetch('/api/train/status');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error checking training status:', error);
        return { active: false, data: null };
    }
}

/**
 * Fetch the list of available training sessions
 * @returns {Promise<Array>} List of training sessions
 */
async function fetchTrainingSessions() {
    try {
        const response = await fetch('/api/sessions');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching training sessions:', error);
        console.log('Using mock session data instead');
        // Return mock session data if fetch fails
        return [
            {
                session_id: 'mock_session',
                start_time: 'Mock Session',
                generations: 42,
                best_fitness: 789.5
            }
        ];
    }
}

/**
 * Fetch data for a specific training session
 * @param {string} sessionId - ID of the session to fetch
 * @returns {Promise<Object>} Session data
 */
async function fetchSessionData(sessionId) {
    try {
        const response = await fetch(`/api/data?session_id=${sessionId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching session data for ${sessionId}:`, error);
        console.log('Using mock data instead');
        // Return mock data if fetch fails
        return loadMockData();
    }
}

/**
 * Fetch the best agent for a specific training session
 * @param {string} sessionId - ID of the session
 * @returns {Promise<Object>} Best agent data
 */
async function fetchBestAgent(sessionId) {
    try {
        // First try to get the data from the session data
        const sessionData = await fetchSessionData(sessionId);
        if (sessionData && sessionData.best_agent) {
            return sessionData.best_agent;
        }
        
        // If not available in session data, try direct fetch
        const response = await fetch(`/api/data/best_agent?session_id=${sessionId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching best agent for ${sessionId}:`, error);
        return null;
    }
}

/**
 * Fetch generation data for a specific training session
 * @param {string} sessionId - ID of the session
 * @returns {Promise<Array>} Generation data
 */
async function fetchGenerationData(sessionId) {
    try {
        const response = await fetch(`/api/data/generations?session_id=${sessionId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching generation data for ${sessionId}:`, error);
        return [];
    }
}

/**
 * Check if a training session is active
 * @param {string} sessionId - ID of the session to check
 * @returns {Promise<boolean>} True if session is active, false otherwise
 */
async function isSessionActive(sessionId) {
    try {
        const response = await fetch(`/api/train/status?session_id=${sessionId}`);
        if (!response.ok) {
            return false;
        }
        const data = await response.json();
        return data.active === true;
    } catch (error) {
        return false;
    }
}

/**
 * Start a WebSocket connection to receive real-time updates
 * @param {string} sessionId - ID of the session to connect to
 * @param {Function} onMessage - Callback function for received messages
 * @returns {WebSocket} WebSocket connection
 */
function connectWebSocket(sessionId, onMessage) {
    // This is a placeholder for WebSocket implementation
    // In a real implementation, this would connect to a WebSocket server
    console.log(`Connecting to WebSocket for session ${sessionId}`);
    
    // Mock WebSocket for development
    const mockWs = {
        send: (data) => console.log('WebSocket send:', data),
        close: () => console.log('WebSocket closed'),
        isConnected: true
    };
    
    // Simulate receiving messages
    const interval = setInterval(() => {
        if (mockWs.isConnected) {
            onMessage({
                type: 'update',
                data: {
                    generation: Math.floor(Math.random() * 100),
                    best_fitness: Math.random() * 1000,
                    diversity: Math.random()
                }
            });
        } else {
            clearInterval(interval);
        }
    }, 5000);
    
    // Add close method to stop the interval
    mockWs.close = () => {
        mockWs.isConnected = false;
        clearInterval(interval);
        console.log('WebSocket closed');
    };
    
    return mockWs;
}

/**
 * Load mock data for development
 * @returns {Object} Mock dashboard data
 */
function loadMockData() {
    return {
        session_id: 'mock_session',
        current: {
            generation: 42,
            best_fitness: 789.5,
            avg_fitness: 456.2,
            max_size: 15,
            diversity: 0.75,
            alive_agents: 87,
            training_time: '1h 23m 45s'
        },
        charts: {
            generations: Array.from({ length: 42 }, (_, i) => i + 1),
            best_fitness: Array.from({ length: 42 }, () => Math.random() * 1000),
            avg_fitness: Array.from({ length: 42 }, () => Math.random() * 500),
            diversity: Array.from({ length: 42 }, () => Math.random()),
            max_size: Array.from({ length: 42 }, () => Math.floor(Math.random() * 20) + 3)
        },
        best_agent: {
            generation: 42,
            fitness: 789.5,
            food_eaten: 12,
            steps_taken: 567,
            weights: Array.from({ length: 500 }, () => Math.random() * 2 - 1)
        }
    };
}

// Expose service functions to global scope
window.startTraining = startTraining;
window.stopTraining = stopTraining;
window.checkTrainingStatus = checkTrainingStatus;
window.fetchTrainingSessions = fetchTrainingSessions;
window.fetchSessionData = fetchSessionData;
window.fetchBestAgent = fetchBestAgent;
window.fetchGenerationData = fetchGenerationData;
window.isSessionActive = isSessionActive;
window.connectWebSocket = connectWebSocket;
window.loadMockData = loadMockData;

// Poll for updates if training is active
let pollingInterval = null;

function startPolling(callback, interval = 2000) {
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }
    
    pollingInterval = setInterval(async () => {
        try {
            const status = await checkTrainingStatus();
            if (status.active && status.data) {
                callback(status.data);
            } else if (!status.active) {
                stopPolling();
            }
        } catch (error) {
            console.error('Error polling for updates:', error);
        }
    }, interval);
    
    return pollingInterval;
}

function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
}

window.startPolling = startPolling;
window.stopPolling = stopPolling;