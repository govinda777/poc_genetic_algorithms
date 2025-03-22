// Using global React instead of imports for in-browser Babel compatibility
// import React from 'react';
// import Chart from '../components/chart';

// Access Chart component from global scope
const Chart = window.ChartComponent;

/**
 * Left side panel component
 * Displays training statistics and charts
 */
const SideLeft = ({ data }) => {
    if (!data || !data.current) {
        return <div className="side-panel side-left">Loading data...</div>;
    }

    const { current, charts } = data;

    return (
        <div className="dashboard-side-left">
            <h2>Training Statistics</h2>
            
            <div className="stats-container">
                <div className="stat-card">
                    <h3>Generation</h3>
                    <div className="stat-value">{current.generation}</div>
                </div>
                
                <div className="stat-card">
                    <h3>Alive Agents</h3>
                    <div className="stat-value">{current.alive_agents}</div>
                </div>
                
                <div className="stat-card">
                    <h3>Diversity</h3>
                    <div className="stat-value">{(current.diversity * 100).toFixed(1)}%</div>
                </div>
                
                <div className="stat-card">
                    <h3>Training Time</h3>
                    <div className="stat-value">{current.training_time}</div>
                </div>
            </div>
            
            <div className="charts-container">
                <div className="chart-wrapper">
                    <h3>Fitness Evolution</h3>
                    <Chart 
                        type="line"
                        labels={charts.generations}
                        datasets={[
                            {
                                label: 'Best Fitness',
                                data: charts.best_fitness,
                                borderColor: '#4CAF50',
                                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                            },
                            {
                                label: 'Average Fitness',
                                data: charts.avg_fitness,
                                borderColor: '#2196F3',
                                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            }
                        ]}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Fitness'
                                    }
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Generation'
                                    }
                                }
                            }
                        }}
                    />
                </div>
                
                <div className="chart-wrapper">
                    <h3>Diversity & Snake Size</h3>
                    <Chart 
                        type="line"
                        labels={charts.generations}
                        datasets={[
                            {
                                label: 'Diversity',
                                data: charts.diversity,
                                borderColor: '#FF9800',
                                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                yAxisID: 'y-diversity',
                            },
                            {
                                label: 'Max Snake Size',
                                data: charts.max_size,
                                borderColor: '#9C27B0',
                                backgroundColor: 'rgba(156, 39, 176, 0.1)',
                                yAxisID: 'y-size',
                            }
                        ]}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                'y-diversity': {
                                    type: 'linear',
                                    position: 'left',
                                    min: 0,
                                    max: 1,
                                    title: {
                                        display: true,
                                        text: 'Diversity'
                                    }
                                },
                                'y-size': {
                                    type: 'linear',
                                    position: 'right',
                                    min: 3,
                                    title: {
                                        display: true,
                                        text: 'Snake Size'
                                    },
                                    grid: {
                                        drawOnChartArea: false
                                    }
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Generation'
                                    }
                                }
                            }
                        }}
                    />
                </div>
            </div>
            
            <div className="additional-stats">
                <h3>Additional Statistics</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>Best Fitness:</td>
                            <td>{current.best_fitness.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Average Fitness:</td>
                            <td>{current.avg_fitness.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Max Snake Size:</td>
                            <td>{current.max_size}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Expose SideLeft component to global scope
window.SideLeftComponent = SideLeft;

// Also export as default for module systems
export default SideLeft;