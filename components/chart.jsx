import React, { useRef, useEffect } from 'react';

/**
 * Chart component
 * A wrapper around Chart.js for data visualization
 * 
 * Note: This is a simplified implementation that assumes Chart.js is loaded globally.
 * In a real implementation, you would import Chart.js as a dependency.
 */
const Chart = ({ type, labels, datasets, options }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    
    useEffect(() => {
        if (!canvasRef.current) return;
        
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded. Please include Chart.js in your project.');
            return;
        }
        
        // Destroy previous chart if it exists
        if (chartRef.current) {
            chartRef.current.destroy();
        }
        
        // Get canvas context
        const ctx = canvasRef.current.getContext('2d');
        
        // Create new chart
        chartRef.current = new window.Chart(ctx, {
            type: type || 'line',
            data: {
                labels: labels || [],
                datasets: datasets || []
            },
            options: options || {}
        });
        
        // Cleanup on unmount
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [type, labels, datasets, options]);
    
    return (
        <div className="chart-container">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

/**
 * Mock implementation for development without Chart.js
 * This will render a placeholder when Chart.js is not available
 */
const MockChart = ({ type, labels, datasets, options }) => {
    return (
        <div className="mock-chart">
            <div className="mock-chart-header">
                <h4>{type.toUpperCase()} Chart</h4>
                <p>Chart.js not loaded - showing mock visualization</p>
            </div>
            <div className="mock-chart-content">
                <div className="mock-chart-y-axis">
                    {datasets.map((dataset, index) => (
                        <div key={index} className="mock-dataset-label" style={{ color: dataset.borderColor }}>
                            {dataset.label}
                        </div>
                    ))}
                </div>
                <div className="mock-chart-data">
                    {datasets.map((dataset, datasetIndex) => (
                        <div 
                            key={datasetIndex} 
                            className="mock-dataset"
                            style={{ 
                                backgroundColor: dataset.backgroundColor,
                                borderColor: dataset.borderColor
                            }}
                        >
                            {dataset.data.map((value, valueIndex) => (
                                <div 
                                    key={valueIndex} 
                                    className="mock-data-point"
                                    style={{ 
                                        height: `${Math.min(100, (value / Math.max(...dataset.data)) * 100)}%`,
                                    }}
                                    title={`${dataset.label}: ${value}`}
                                ></div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="mock-chart-x-axis">
                    {labels.length > 10 ? (
                        <>
                            <span>{labels[0]}</span>
                            <span>...</span>
                            <span>{labels[labels.length - 1]}</span>
                        </>
                    ) : (
                        labels.map((label, index) => (
                            <span key={index}>{label}</span>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Export the appropriate chart component based on environment
 */
export default typeof window !== 'undefined' && typeof window.Chart !== 'undefined' 
    ? Chart 
    : MockChart;