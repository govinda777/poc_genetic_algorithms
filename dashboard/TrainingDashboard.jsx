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
    // Chamada para iniciar treinamento via API
    fetch('/api/train', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        epochs: Number(trainingParams.epochs),
        population_size: Number(trainingParams.population),
        mutation_rate: 0.1,
        crossover_rate: 0.7,
        elitism: 0.1,
        games_per_agent: 3
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setTrainingStarted(true);
          setShowTrainingForm(false);
          setCurrentEpoch(0);
        } else {
          alert("Erro ao iniciar o treino: " + data.message);
        }
      })
      .catch(error => {
        console.error('Erro ao iniciar o treino:', error);
        alert("Erro ao iniciar o treino");
      });
  };
  useEffect(() => {
    let pollingInterval;
    if (trainingStarted) {
      pollingInterval = setInterval(() => {
        fetch('/api/train/status')
          .then(response => response.json())
          .then(data => {
            const epoch = data.data && data.data.current && data.data.current.generation ? data.data.current.generation : 0;
            setCurrentEpoch(epoch);
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