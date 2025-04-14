import React, { useState, useEffect } from 'react';

const TrainingDashboard = () => {
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [trainingParams, setTrainingParams] = useState({
    epochs: 100,
    population_size: 100,
    mutation_rate: 0.1,
    crossover_rate: 0.7,
    elitism: 0.1,
    games_per_agent: 3
  });
  const [trainingStarted, setTrainingStarted] = useState(false);
  const [trainingPaused, setTrainingPaused] = useState(false);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const [trainingData, setTrainingData] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const handleNewTraining = () => {
    setShowTrainingForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setTrainingParams({
      ...trainingParams,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleTrainingSubmit = (e) => {
    e.preventDefault();
    setStatusMessage('Iniciando treinamento...');
    
    // Chamada para iniciar treinamento via API
    fetch('/api/train', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trainingParams)
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setTrainingStarted(true);
          setShowTrainingForm(false);
          setCurrentEpoch(0);
          setStatusMessage('Treinamento iniciado com sucesso!');
        } else {
          setStatusMessage("Erro ao iniciar o treino: " + data.message);
        }
      })
      .catch(error => {
        console.error('Erro ao iniciar o treino:', error);
        setStatusMessage("Erro ao iniciar o treino: " + error.message);
      });
  };

  const handlePauseTraining = () => {
    setStatusMessage('Pausando treinamento...');
    
    fetch('/api/train/pause', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setTrainingPaused(true);
          setStatusMessage('Treinamento pausado com sucesso!');
        } else {
          setStatusMessage("Erro ao pausar o treino: " + data.message);
        }
      })
      .catch(error => {
        console.error('Erro ao pausar o treino:', error);
        setStatusMessage("Erro ao pausar o treino: " + error.message);
      });
  };

  const handleContinueTraining = () => {
    setStatusMessage('Continuando treinamento...');
    
    fetch('/api/train/continue', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setTrainingPaused(false);
          setStatusMessage('Treinamento continuado com sucesso!');
        } else {
          setStatusMessage("Erro ao continuar o treino: " + data.message);
        }
      })
      .catch(error => {
        console.error('Erro ao continuar o treino:', error);
        setStatusMessage("Erro ao continuar o treino: " + error.message);
      });
  };

  const handleSaveTraining = () => {
    setStatusMessage('Salvando treinamento...');
    
    fetch('/api/train/save', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setStatusMessage('Treinamento salvo com sucesso!');
        } else {
          setStatusMessage("Erro ao salvar o treino: " + data.message);
        }
      })
      .catch(error => {
        console.error('Erro ao salvar o treino:', error);
        setStatusMessage("Erro ao salvar o treino: " + error.message);
      });
  };

  const handleStopTraining = () => {
    setStatusMessage('Parando treinamento...');
    
    fetch('/api/train/stop', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setTrainingStarted(false);
          setTrainingPaused(false);
          setStatusMessage('Treinamento parado com sucesso!');
        } else {
          setStatusMessage("Erro ao parar o treino: " + data.message);
        }
      })
      .catch(error => {
        console.error('Erro ao parar o treino:', error);
        setStatusMessage("Erro ao parar o treino: " + error.message);
      });
  };

  useEffect(() => {
    let pollingInterval;
    if (trainingStarted && !trainingPaused) {
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
  }, [trainingStarted, trainingPaused]);

  return (
    <div className="training-dashboard" style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px' }}>
      <h2>Painel de Treinamento</h2>
      
      {!trainingStarted && (
        <button 
          onClick={handleNewTraining} 
          className="btn btn-primary"
          style={{ marginBottom: '15px' }}
        >
          Novo Treino
        </button>
      )}
      
      {showTrainingForm && (
        <div className="training-form-container" style={{ marginTop: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '5px' }}>
          <h3>Configuração do Treinamento</h3>
          <form onSubmit={handleTrainingSubmit}>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Número de Épocas:
              </label>
              <input
                type="number"
                name="epochs"
                value={trainingParams.epochs}
                onChange={handleInputChange}
                min="1"
                className="form-control"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Tamanho da População:
              </label>
              <input
                type="number"
                name="population_size"
                value={trainingParams.population_size}
                onChange={handleInputChange}
                min="10"
                className="form-control"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Taxa de Mutação:
              </label>
              <input
                type="number"
                name="mutation_rate"
                value={trainingParams.mutation_rate}
                onChange={handleInputChange}
                min="0"
                max="1"
                step="0.01"
                className="form-control"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Taxa de Crossover:
              </label>
              <input
                type="number"
                name="crossover_rate"
                value={trainingParams.crossover_rate}
                onChange={handleInputChange}
                min="0"
                max="1"
                step="0.01"
                className="form-control"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Elitismo:
              </label>
              <input
                type="number"
                name="elitism"
                value={trainingParams.elitism}
                onChange={handleInputChange}
                min="0"
                max="1"
                step="0.01"
                className="form-control"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Jogos por Agente:
              </label>
              <input
                type="number"
                name="games_per_agent"
                value={trainingParams.games_per_agent}
                onChange={handleInputChange}
                min="1"
                className="form-control"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <button 
                type="submit" 
                className="btn btn-success"
                style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Iniciar Treinamento
              </button>
              <button 
                type="button" 
                onClick={() => setShowTrainingForm(false)}
                className="btn btn-secondary"
                style={{ marginLeft: '10px', padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      
      {statusMessage && (
        <div 
          className="status-message"
          style={{ margin: '15px 0', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          {statusMessage}
        </div>
      )}
      
      {trainingStarted && (
        <div className="training-progress" style={{ marginTop: '20px' }}>
          <h3>Treinamento em Progresso</h3>
          
          <div className="progress-info" style={{ margin: '15px 0', padding: '15px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px' }}>
            <div className="progress-item" style={{ marginBottom: '10px' }}>
              <strong>Status:</strong> {trainingPaused ? 'Pausado' : 'Em execução'}
            </div>
            <div className="progress-item" style={{ marginBottom: '10px' }}>
              <strong>Épocas:</strong> {currentEpoch} / {trainingParams.epochs}
            </div>
            <div className="progress-item" style={{ marginBottom: '10px' }}>
              <strong>População:</strong> {trainingParams.population_size}
            </div>
            
            {trainingData && trainingData.data && trainingData.data.current && (
              <>
                <div className="progress-item" style={{ marginBottom: '10px' }}>
                  <strong>Melhor Fitness:</strong> {trainingData.data.current.best_fitness || 'N/A'}
                </div>
                <div className="progress-item" style={{ marginBottom: '10px' }}>
                  <strong>Fitness Médio:</strong> {trainingData.data.current.avg_fitness || 'N/A'}
                </div>
                <div className="progress-item" style={{ marginBottom: '10px' }}>
                  <strong>Tempo de Treinamento:</strong> {trainingData.data.current.training_time || 'N/A'}
                </div>
              </>
            )}
          </div>
          
          <div className="training-controls" style={{ marginTop: '20px' }}>
            {!trainingPaused ? (
              <button 
                onClick={handlePauseTraining} 
                className="btn btn-warning"
                style={{ marginRight: '10px', padding: '10px 15px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Pausar Treinamento
              </button>
            ) : (
              <button 
                onClick={handleContinueTraining} 
                className="btn btn-primary"
                style={{ marginRight: '10px', padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Continuar Treinamento
              </button>
            )}
            
            <button 
              onClick={handleSaveTraining} 
              className="btn btn-info"
              style={{ marginRight: '10px', padding: '10px 15px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Salvar Treinamento
            </button>
            
            <button 
              onClick={handleStopTraining} 
              className="btn btn-danger"
              style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Parar Treinamento
            </button>
          </div>
          
          {trainingData && (
            <div className="training-data" style={{ marginTop: '25px' }}>
              <h3>Resultados do Treinamento</h3>
              <div style={{ overflowX: 'auto', maxHeight: '300px', border: '1px solid #ddd', borderRadius: '4px', padding: '10px' }}>
                <pre>{JSON.stringify(trainingData, null, 2)}</pre>
              </div>
            </div>
          )}
          
          <div className="agent-visualization" style={{ marginTop: '25px' }}>
            <h3>Visualização do Agente</h3>
            <iframe
              src="/game/snake_game.html"
              style={{ width: '100%', height: '500px', border: '1px solid #ddd', borderRadius: '4px' }}
              title="Simulação do Agente"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingDashboard;