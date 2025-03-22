/**
 * Service for fetching genetic algorithm data
 * 
 * This module provides functions to fetch training data from the genetic algorithm,
 * either from local JSON files or via a WebSocket/REST API.
 */

/**
 * Fetch the list of available training sessions
 * @returns {Promise<Array>} List of training sessions
 */
async function fetchTrainingSessions() {
    try {
        const response = await fetch('../data/sessions.json');
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
        const response = await fetch(`../data/session_${sessionId}/dashboard_data.json`);
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
        const response = await fetch(`../data/session_${sessionId}/latest_best_agent.json`);
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
        const response = await fetch(`../data/session_${sessionId}/generation_data.json`);
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
        const response = await fetch(`../data/session_${sessionId}/status.json`);
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
window.fetchTrainingSessions = fetchTrainingSessions;
window.fetchSessionData = fetchSessionData;
window.fetchBestAgent = fetchBestAgent;
window.fetchGenerationData = fetchGenerationData;
window.isSessionActive = isSessionActive;
window.connectWebSocket = connectWebSocket;
window.loadMockData = loadMockData;