// Using global React and ReactDOM instead of imports for in-browser Babel compatibility
// import React from 'react';
// import ReactDOM from 'react-dom';
// import Core from './core';
// import './styles.css'; // This would be created separately
// import SideLeftComponent from './side_left';
// import SideRightComponent from './side_right';
// import FooterComponent from './footer';

// Access components from global scope
const Core = window.Core;
const SideLeftComponent = window.SideLeftComponent;
const SideRightComponent = window.SideRightComponent;
const FooterComponent = window.FooterComponent;

/**
 * Main entry point for the dashboard
 * Renders the Core component into the root element
 */
function Dashboard() {
    return (
        <div className="dashboard-container">
            <SideLeftComponent />
            <Core />
            <SideRightComponent />
            <FooterComponent />
        </div>
    );
}

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