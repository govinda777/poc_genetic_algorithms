// Using global React instead of imports for in-browser Babel compatibility
// import React, { useState, useEffect } from 'react';
// import { fetchTrainingSessions, fetchSessionData, connectWebSocket, loadMockData } from './service';
// import SideLeft from './side_left';
// import SideRight from './side_right';
// import Footer from './footer';

// Destructure React hooks from global React
const { useState, useEffect, useCallback } = React;

// Access service functions from global scope
const { 
    fetchTrainingSessions, 
    fetchSessionData, 
    connectWebSocket, 
    loadMockData,
    checkTrainingStatus,
    startPolling,
    stopPolling
} = window;

/**
 * Core dashboard component
 * Loads and distributes data to child components
 */
const Core = () => {
    // State for sessions and selected session
    const [sessions, setSessions] = useState([]);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wsConnection, setWsConnection] = useState(null);
    const [useMockData, setUseMockData] = useState(false);
    const [isTraining, setIsTraining] = useState(false);

    // Load available sessions on component mount
    useEffect(() => {
        const loadSessions = async () => {
            try {
                const sessionsData = await fetchTrainingSessions();
                setSessions(sessionsData);
                
                // Select the most recent session by default
                if (sessionsData.length > 0) {
                    setSelectedSessionId(sessionsData[0].session_id);
                }
            } catch (err) {
                console.error('Error loading sessions:', err);
                setError('Failed to load training sessions. Check if data directory exists.');
            } finally {
                setLoading(false);
            }
        };

        loadSessions();
    }, []);

    // Check if training is active on component mount
    useEffect(() => {
        const checkTrainingActive = async () => {
            try {
                const status = await checkTrainingStatus();
                setIsTraining(status.active);
                
                if (status.active && status.data) {
                    // Update session data with the latest data
                    setSessionData(status.data);
                }
            } catch (error) {
                console.error('Error checking training status:', error);
            }
        };
        
        checkTrainingActive();
    }, []);
    
    // Listen for training updates
    useEffect(() => {
        const handleTrainingUpdate = (event) => {
            const data = event.detail;
            console.log('Training update received:', data);
            
            // Update session data with the latest data
            setSessionData(data);
            setIsTraining(true);
            
            // Refresh sessions list to include the new session
            fetchTrainingSessions().then(sessionsData => {
                setSessions(sessionsData);
            });
        };
        
        // Add event listener
        window.addEventListener('training-update', handleTrainingUpdate);
        
        // Clean up
        return () => {
            window.removeEventListener('training-update', handleTrainingUpdate);
        };
    }, []);
    
    // Load session data when selected session changes
    useEffect(() => {
        if (!selectedSessionId && !useMockData) return;

        const loadSessionData = async () => {
            setLoading(true);
            try {
                if (useMockData) {
                    // Use mock data for development
                    setSessionData(loadMockData());
                } else {
                    // Fetch real data
                    const data = await fetchSessionData(selectedSessionId);
                    if (data) {
                        setSessionData(data);
                    } else {
                        setError(`Failed to load data for session ${selectedSessionId}`);
                    }
                }
            } catch (err) {
                console.error(`Error loading session data for ${selectedSessionId}:`, err);
                setError(`Error loading session data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        loadSessionData();

        // Clean up previous WebSocket connection
        if (wsConnection) {
            wsConnection.close();
        }

        // Set up WebSocket connection for real-time updates
        if (selectedSessionId && !useMockData) {
            const ws = connectWebSocket(selectedSessionId, handleWebSocketMessage);
            setWsConnection(ws);

            // Clean up WebSocket on unmount or when session changes
            return () => {
                if (ws) {
                    ws.close();
                }
            };
        }
    }, [selectedSessionId, useMockData]);

    // Handle WebSocket messages
    const handleWebSocketMessage = (message) => {
        if (message.type === 'update' && message.data) {
            // Update session data with new information
            setSessionData(prevData => {
                if (!prevData) return null;
                
                return {
                    ...prevData,
                    current: {
                        ...prevData.current,
                        ...message.data
                    },
                    // Update charts data if available
                    charts: message.data.charts ? {
                        ...prevData.charts,
                        ...message.data.charts
                    } : prevData.charts
                };
            });
        }
    };

    // Handle session selection
    const handleSessionChange = (sessionId) => {
        setSelectedSessionId(sessionId);
    };

    // Toggle between real and mock data
    const toggleMockData = () => {
        setUseMockData(prev => !prev);
    };

    // Start a new training session
    const handleStartTraining = async (params) => {
        try {
            setLoading(true);
            const response = await window.startTraining(params);
            
            if (response.status === 'success') {
                setIsTraining(true);
                
                // Start polling for updates
                startPolling((data) => {
                    setSessionData(data);
                });
                
                // Refresh sessions list after a short delay
                setTimeout(async () => {
                    const sessionsData = await fetchTrainingSessions();
                    setSessions(sessionsData);
                    
                    // Select the most recent session
                    if (sessionsData.length > 0) {
                        setSelectedSessionId(sessionsData[0].session_id);
                    }
                    
                    setLoading(false);
                }, 2000);
            } else {
                setError(`Error starting training: ${response.message || 'Unknown error'}`);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error starting training:', error);
            setError(`Error starting training: ${error.message || 'Unknown error'}`);
            setLoading(false);
        }
    };
    
    // Stop the current training session
    const handleStopTraining = async () => {
        try {
            setLoading(true);
            const response = await window.stopTraining();
            
            if (response.status === 'success') {
                setIsTraining(false);
                stopPolling();
                
                // Refresh sessions list and data
                const sessionsData = await fetchTrainingSessions();
                setSessions(sessionsData);
                
                if (selectedSessionId) {
                    const data = await fetchSessionData(selectedSessionId);
                    if (data) {
                        setSessionData(data);
                    }
                }
            } else {
                setError(`Error stopping training: ${response.message || 'Unknown error'}`);
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error stopping training:', error);
            setError(`Error stopping training: ${error.message || 'Unknown error'}`);
            setLoading(false);
        }
    };

    // Refresh data
    const refreshData = async () => {
        if (useMockData) {
            setSessionData(loadMockData());
            return;
        }

        if (!selectedSessionId) return;

        setLoading(true);
        try {
            const data = await fetchSessionData(selectedSessionId);
            if (data) {
                setSessionData(data);
            }
        } catch (err) {
            console.error(`Error refreshing data for ${selectedSessionId}:`, err);
            setError(`Error refreshing data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Snake Game Genetic Algorithm Dashboard</h1>
                <div className="controls">
                    <select 
                        value={selectedSessionId || ''} 
                        onChange={(e) => handleSessionChange(e.target.value)}
                        disabled={loading || useMockData}
                    >
                        <option value="" disabled>Select a training session</option>
                        {sessions.map(session => (
                            <option key={session.session_id} value={session.session_id}>
                                {session.start_time} - Gen {session.generations} - Fitness {session.best_fitness.toFixed(2)}
                            </option>
                        ))}
                    </select>
                    <button onClick={refreshData} disabled={loading}>
                        Refresh Data
                    </button>
                    <button onClick={toggleMockData}>
                        {useMockData ? 'Use Real Data' : 'Use Mock Data'}
                    </button>
                    {isTraining ? (
                        <button 
                            className="stop-training-btn"
                            onClick={handleStopTraining}
                            disabled={loading}
                        >
                            Stop Training
                        </button>
                    ) : (
                        <button 
                            className="start-training-btn"
                            onClick={() => window.dispatchEvent(new CustomEvent('show-training-form'))}
                            disabled={loading}
                        >
                            Start Training
                        </button>
                    )}
                </div>
            </header>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={() => setError(null)}>Dismiss</button>
                </div>
            )}

            {loading ? (
                <div className="loading">
                    <p>Loading data...</p>
                </div>
            ) : (
                <div className="dashboard-content">
                    {sessionData ? (
                        <>
                            <div className="panels">
                                <SideLeft data={sessionData} />
                                <SideRight data={sessionData} />
                            </div>
                            <Footer 
                                onStartTraining={handleStartTraining}
                                onStopTraining={handleStopTraining}
                                isTraining={isTraining}
                            />
                        </>
                    ) : (
                        <div className="no-data">
                            <p>No session data available. Please select a session or use mock data.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Expose Core component to global scope
window.Core = Core;

// Also export as default for module systems
export default Core;