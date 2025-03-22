/**
 * Game Configuration
 * 
 * This file contains configuration parameters for the Snake game.
 * Modify these values to adjust the game behavior.
 */

const GAME_CONFIG = {
    // Grid settings
    GRID_SIZE: 25,
    CELL_SIZE: 20,
    
    // Snake settings
    INITIAL_SNAKE_LENGTH: 3,
    INITIAL_ENERGY: 100,
    ENERGY_DECREASE_PER_STEP: 1,
    ENERGY_INCREASE_PER_FOOD: 50,
    
    // Game settings
    GAME_SPEED: 150, // ms between steps
    
    // AI settings
    SENSOR_DIRECTIONS: 8, // Number of sensor directions (8 = N, NE, E, SE, S, SW, W, NW)
    SHOW_SENSORS: false, // Show sensors by default
    
    // Colors
    COLORS: {
        BACKGROUND: '#ffffff',
        GRID: '#dddddd',
        SNAKE_HEAD: '#388E3C',
        SNAKE_BODY: '#4CAF50',
        FOOD: '#F44336',
        SENSOR: 'rgba(0, 0, 255, 0.5)',
        SENSOR_FOOD: 'rgba(0, 255, 0, 0.5)'
    }
};

// Export the configuration if in a module environment
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = GAME_CONFIG;
}