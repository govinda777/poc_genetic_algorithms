import React from 'react';

/**
 * Componente para visualização de detalhes do agente
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.agent - Dados do agente a ser visualizado
 */
const AgentVisualization = ({ agent }) => {
  // Usar dados fictícios se nenhum agente for fornecido
  const agentData = agent || {
    id: 'agent-123',
    generation: 25,
    fitness: 350,
    foodEaten: 12,
    stepsTaken: 567,
    survivalTime: '00:03:45'
  };

  return (
    <div className="agent-visualization">
      <h3>Detalhes do Agente</h3>
      
      <div className="agent-details" data-testid="agent-id" id={`agent-${agentData.id}`}>
        <div className="agent-stats">
          <div className="stat-row">
            <strong>Geração:</strong> {agentData.generation}
          </div>
          <div className="stat-row">
            <strong>Fitness:</strong> {agentData.fitness.toFixed(2)}
          </div>
          <div className="stat-row">
            <strong>Comida Consumida:</strong> {agentData.foodEaten}
          </div>
          <div className="stat-row">
            <strong>Passos Realizados:</strong> {agentData.stepsTaken}
          </div>
          <div className="stat-row">
            <strong>Tempo de Sobrevivência:</strong> {agentData.survivalTime}
          </div>
        </div>
        
        <div className="agent-simulation">
          <h4>Simulação em Tempo Real</h4>
          <iframe
            src="/game/snake_game.html?agent=true"
            title="Simulação do Agente"
            className="agent-iframe"
            style={{ width: '100%', height: '400px', border: '1px solid #ccc', borderRadius: '4px' }}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default AgentVisualization; 