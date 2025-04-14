import React from 'react';

/**
 * Componente para visualização das métricas de desempenho do agente
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.agent - Dados do agente a ser visualizado
 * @param {Object} props.trainingData - Dados do treinamento
 */
const PerformanceMetrics = ({ agent, trainingData }) => {
  // Usar dados fictícios se nenhum agente for fornecido
  const agentData = agent || {
    id: 'agent-123',
    metrics: {
      bestScore: 15,
      averageSurvivalTime: '00:01:45',
      movementEfficiency: 0.78,
      optimalDecisionRate: 0.65,
      adaptabilityScore: 0.82
    }
  };

  // Dados de treinamento para gráficos
  const trainingMetrics = trainingData || {
    generations: Array(20).fill().map((_, i) => i + 1),
    bestScore: Array(20).fill().map((_, i) => Math.min(5 + i * 0.5, 20)),
    avgSurvivalTime: Array(20).fill().map((_, i) => 20 + i * 3),
    movementEfficiency: Array(20).fill().map((_, i) => 0.4 + i * 0.02),
    optimalDecisionRate: Array(20).fill().map((_, i) => 0.3 + i * 0.025),
    adaptabilityScore: Array(20).fill().map((_, i) => 0.5 + i * 0.015)
  };

  // Criar gráficos simplificados para as métricas
  const createSimpleGraph = (data, label, color, max) => {
    const maxValue = max || Math.max(...data);
    const normalizedData = data.map(value => (value / maxValue) * 100);
    
    return (
      <div data-testid="metric-graph" className="metric-graph" style={{ marginBottom: '20px' }}>
        <h4>{label}</h4>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '100px', width: '100%', borderBottom: '1px solid #ccc' }}>
          {normalizedData.map((value, index) => (
            <div
              key={`bar-${label}-${index}`}
              style={{
                width: `${100 / normalizedData.length}%`,
                height: `${value}%`,
                backgroundColor: color,
                margin: '0 1px',
                position: 'relative'
              }}
              title={`Geração ${trainingMetrics.generations[index]}: ${data[index].toFixed(2)}`}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
          <div>1</div>
          <div>{Math.floor(trainingMetrics.generations.length / 2)}</div>
          <div>{trainingMetrics.generations.length}</div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '12px', color: '#666' }}>
          Geração
        </div>
      </div>
    );
  };

  return (
    <div className="performance-metrics">
      <h3>Métricas de Desempenho</h3>
      
      <div className="current-metrics" style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
        <h4>Métricas Atuais</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ flex: '0 0 48%', margin: '5px 0' }}>
            <strong>Melhor pontuação:</strong> {agentData.metrics.bestScore}
          </div>
          <div style={{ flex: '0 0 48%', margin: '5px 0' }}>
            <strong>Tempo médio de sobrevivência:</strong> {agentData.metrics.averageSurvivalTime}
          </div>
          <div style={{ flex: '0 0 48%', margin: '5px 0' }}>
            <strong>Eficiência de movimento:</strong> {agentData.metrics.movementEfficiency.toFixed(2)}
          </div>
          <div style={{ flex: '0 0 48%', margin: '5px 0' }}>
            <strong>Taxa de decisões ótimas:</strong> {agentData.metrics.optimalDecisionRate.toFixed(2)}
          </div>
          <div style={{ flex: '0 0 48%', margin: '5px 0' }}>
            <strong>Adaptabilidade a mudanças:</strong> {agentData.metrics.adaptabilityScore.toFixed(2)}
          </div>
        </div>
      </div>
      
      <div className="metrics-evolution" data-testid="time-evolution-graph">
        <h4>Evolução ao Longo do Tempo</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div style={{ flex: '0 0 48%' }}>
            {createSimpleGraph(trainingMetrics.bestScore, 'Melhor Pontuação', '#4CAF50')}
          </div>
          <div style={{ flex: '0 0 48%' }}>
            {createSimpleGraph(trainingMetrics.avgSurvivalTime, 'Tempo Médio de Sobrevivência (s)', '#2196F3')}
          </div>
          <div style={{ flex: '0 0 48%' }}>
            {createSimpleGraph(trainingMetrics.movementEfficiency, 'Eficiência de Movimento', '#FFC107', 1)}
          </div>
          <div style={{ flex: '0 0 48%' }}>
            {createSimpleGraph(trainingMetrics.optimalDecisionRate, 'Taxa de Decisões Ótimas', '#9C27B0', 1)}
          </div>
          <div style={{ flex: '0 0 48%' }}>
            {createSimpleGraph(trainingMetrics.adaptabilityScore, 'Adaptabilidade a Mudanças', '#FF5722', 1)}
          </div>
        </div>
      </div>
      
      <div className="metrics-explanation" style={{ marginTop: '30px' }}>
        <h4>Explicação das Métricas</h4>
        <ul style={{ paddingLeft: '20px' }}>
          <li><strong>Melhor pontuação:</strong> Quantidade máxima de comida que o agente conseguiu comer em uma partida.</li>
          <li><strong>Tempo médio de sobrevivência:</strong> Tempo médio que o agente permanece vivo antes de colidir.</li>
          <li><strong>Eficiência de movimento:</strong> Razão entre movimentos efetivos e total de movimentos (0-1).</li>
          <li><strong>Taxa de decisões ótimas:</strong> Proporção de decisões consideradas ótimas pelo algoritmo (0-1).</li>
          <li><strong>Adaptabilidade a mudanças:</strong> Capacidade do agente de se adaptar a modificações no ambiente (0-1).</li>
        </ul>
      </div>
    </div>
  );
};

export default PerformanceMetrics; 