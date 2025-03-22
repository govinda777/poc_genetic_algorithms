import React from 'react';
import ReactDOM from 'react-dom';
import Core from './core';
import './styles.css'; // This would be created separately

/**
 * Main entry point for the dashboard
 * Renders the Core component into the root element
 */
const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <Core />
        </div>
    );
};

// Render the Dashboard component when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('dashboard-root');
    
    if (rootElement) {
        ReactDOM.render(<Dashboard />, rootElement);
    } else {
        console.error('Root element with ID "dashboard-root" not found');
    }
});

export default Dashboard;