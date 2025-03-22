import React, { useState } from 'react';

const TrainingDashboard = () => {
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [trainingParams, setTrainingParams] = useState({ epochs: '', population: '' });
  const [trainingStarted, setTrainingStarted] = useState(false);

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
  };

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