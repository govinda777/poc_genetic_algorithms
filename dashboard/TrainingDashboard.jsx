import React, { useState, useEffect } from 'react';

const TrainingDashboard = () => {
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [trainingParams, setTrainingParams] = useState({ epochs: '', population: '' });
  const [trainingStarted, setTrainingStarted] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [trainingData, setTrainingData] = useState(null);

  const handleNewTraining = () => {
    setShowTrainingForm(true);
  };

  const handleInputChange = (e) => {
    setTrainingParams({
      ...trainingParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleTrainingSubmit = (e) => {
    e.preventDefault();
    // Simula o início do treino, podendo posteriormente ser integrada a uma API
    setTrainingStarted(true);
    setShowTrainingForm(false);
    setCurrentEpoch(0);
  };
  useEffect(() => {
    let pollingInterval;
    if (trainingStarted) {
      pollingInterval = setInterval(() => {
        fetch('/api/train/status')
          .then(response => response.json())
          .then(data => {
            if (typeof data.currentEpoch !== 'undefined') {
              setCurrentEpoch(data.currentEpoch);
            }
            setTrainingData(data);
          })
          .catch(error => console.error('Error fetching training status:', error));
      }, 1000); // poll every second
    }
    return () => clearInterval(pollingInterval);
  }, [trainingStarted]);
  return (
    <div className="training-dashboard" style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}>
      <button onClick={handleNewTraining}>Novo Treino</button>
      {showTrainingForm && (
        <form onSubmit={handleTrainingSubmit} style={{ marginTop: '20px' }}>
          <div>
            <label>
              Épocas:
              <input
                type="number"
                name="epochs"
                value={trainingParams.epochs}
                onChange={handleInputChange}
                style={{ marginLeft: '10px' }}
              />
            </label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>
              População:
              <input
                type="number"
                name="population"
                value={trainingParams.population}
                onChange={handleInputChange}
                style={{ marginLeft: '10px' }}
              />
            </label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <button type="submit">Iniciar Treino</button>
          </div>
        </form>
      )}
      {trainingStarted && (
        <div style={{ marginTop: '20px' }}>
          <h2>Treino em Execução</h2>
          <p>Épocas: {trainingParams.epochs}</p>
          <p>População: {trainingParams.population}</p>
          <p>Época Atual: {currentEpoch}</p>
          {trainingData && (
            <div style={{ marginTop: '10px' }}>
              <h3>Dados do Treino</h3>
              <pre>{JSON.stringify(trainingData, null, 2)}</pre>
            </div>
          )}
          <iframe
            src="/game/snake_game.html"
            style={{ width: '100%', height: '500px', border: 'none' }}
            title="Simulação do Agente"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default TrainingDashboard;