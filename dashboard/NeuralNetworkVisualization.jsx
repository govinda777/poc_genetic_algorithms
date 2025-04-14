import React from 'react';

/**
 * Componente para visualização da rede neural do agente
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.agent - Dados do agente a ser visualizado
 */
const NeuralNetworkVisualization = ({ agent }) => {
  // Usar dados fictícios se nenhum agente for fornecido
  const agentData = agent || {
    id: 'agent-123',
    neuralNetwork: {
      layers: [
        { type: 'input', neurons: 8, activeNeurons: [0, 2, 5, 7] },
        { type: 'hidden', neurons: 6, activeNeurons: [1, 3] },
        { type: 'output', neurons: 4, activeNeurons: [0, 2] }
      ],
      weights: generateRandomWeights([8, 6, 4])
    }
  };

  // Helper para gerar pesos aleatórios para a visualização
  function generateRandomWeights(layerSizes) {
    const weights = [];
    for (let i = 0; i < layerSizes.length - 1; i++) {
      const layerWeights = [];
      for (let j = 0; j < layerSizes[i]; j++) {
        const neuronWeights = [];
        for (let k = 0; k < layerSizes[i + 1]; k++) {
          neuronWeights.push(Math.random() * 2 - 1); // Entre -1 e 1
        }
        layerWeights.push(neuronWeights);
      }
      weights.push(layerWeights);
    }
    return weights;
  }

  // Calcular as posições dos neurônios
  const networkGraphics = calculateNetworkGraphics(agentData.neuralNetwork);

  return (
    <div className="neural-network-visualization">
      <h3>Visualização da Rede Neural</h3>
      
      <div data-testid="neural-network-visualization" className="network-container" style={{ padding: '20px' }}>
        <svg 
          width="800" 
          height="400" 
          style={{ 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            backgroundColor: '#f9f9f9'
          }}
        >
          {/* Desenhar conexões entre os neurônios */}
          {networkGraphics.connections.map((connection, index) => (
            <line
              key={`connection-${index}`}
              x1={connection.startX}
              y1={connection.startY}
              x2={connection.endX}
              y2={connection.endY}
              stroke={connection.weight > 0 ? '#4CAF50' : '#F44336'}
              strokeWidth={Math.abs(connection.weight) * 3}
              strokeOpacity="0.6"
              data-testid="connection"
            />
          ))}
          
          {/* Desenhar pesos nas conexões */}
          {networkGraphics.connections.map((connection, index) => (
            <text
              key={`weight-${index}`}
              x={(connection.startX + connection.endX) / 2}
              y={(connection.startY + connection.endY) / 2}
              textAnchor="middle"
              fontSize="10"
              fill="#333"
              data-testid="connection-weight"
            >
              {connection.weight.toFixed(2)}
            </text>
          ))}
          
          {/* Desenhar neurônios */}
          {networkGraphics.neurons.map((neuron, index) => (
            <g key={`neuron-${index}`} data-testid={neuron.isActive ? 'active-neuron' : 'neuron'}>
              <circle
                cx={neuron.x}
                cy={neuron.y}
                r={20}
                fill={neuron.isActive ? '#4CAF50' : '#ccc'}
                stroke="#333"
                strokeWidth="1"
              />
              <text
                x={neuron.x}
                y={neuron.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize="12"
              >
                {neuron.id}
              </text>
            </g>
          ))}
          
          {/* Rótulos das camadas */}
          {networkGraphics.layerLabels.map((label, index) => (
            <text
              key={`layer-${index}`}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#333"
            >
              {label.text}
            </text>
          ))}
        </svg>
        
        <div className="network-legend" style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div 
              style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: '#4CAF50', 
                marginRight: '10px',
                borderRadius: '50%'
              }}
            ></div>
            <span>Neurônio Ativo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div 
              style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: '#ccc', 
                marginRight: '10px',
                borderRadius: '50%'
              }}
            ></div>
            <span>Neurônio Inativo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '30px', 
              height: '5px', 
              backgroundColor: '#4CAF50', 
              marginRight: '10px' 
            }}></div>
            <span>Peso Positivo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '30px', 
              height: '5px', 
              backgroundColor: '#F44336', 
              marginRight: '10px' 
            }}></div>
            <span>Peso Negativo</span>
          </div>
        </div>
      </div>
      
      <div className="network-description" style={{ marginTop: '20px' }}>
        <h4>Estrutura da Rede Neural</h4>
        <ul>
          {agentData.neuralNetwork.layers.map((layer, index) => (
            <li key={`layer-desc-${index}`}>
              <strong>{layer.type === 'input' ? 'Camada de Entrada' : layer.type === 'output' ? 'Camada de Saída' : `Camada Oculta ${index}`}:</strong> {layer.neurons} neurônios
              {layer.activeNeurons.length > 0 && ` (${layer.activeNeurons.length} ativos)`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Função para calcular as posições dos neurônios e conexões no SVG
function calculateNetworkGraphics(network) {
  const svgWidth = 800;
  const svgHeight = 400;
  const paddingX = 100;
  const paddingY = 50;
  
  const layerCount = network.layers.length;
  const layerWidth = (svgWidth - 2 * paddingX) / (layerCount - 1);
  
  let neurons = [];
  let connections = [];
  let layerLabels = [];
  let neuronId = 0;
  
  // Calcular posições dos neurônios
  network.layers.forEach((layer, layerIndex) => {
    const x = paddingX + layerIndex * layerWidth;
    const neuronCount = layer.neurons;
    const neuronHeight = (svgHeight - 2 * paddingY) / (neuronCount - 1 || 1);
    
    // Adicionar rótulo da camada
    layerLabels.push({
      x: x,
      y: 25,
      text: layer.type === 'input' ? 'Entrada' : layer.type === 'output' ? 'Saída' : `Oculta ${layerIndex}`
    });
    
    // Adicionar neurônios
    const layerNeurons = [];
    for (let i = 0; i < neuronCount; i++) {
      const y = paddingY + i * neuronHeight;
      const isActive = layer.activeNeurons.includes(i);
      
      layerNeurons.push({
        id: neuronId++,
        x: x,
        y: y,
        layerIndex: layerIndex,
        neuronIndex: i,
        isActive: isActive
      });
      
      neurons.push({
        id: neuronId - 1,
        x: x,
        y: y,
        layerIndex: layerIndex,
        neuronIndex: i,
        isActive: isActive
      });
    }
    
    // Adicionar conexões com a camada anterior
    if (layerIndex > 0) {
      const prevLayerNeurons = neurons.filter(n => n.layerIndex === layerIndex - 1);
      
      prevLayerNeurons.forEach(startNeuron => {
        layerNeurons.forEach((endNeuron, j) => {
          const weightValue = network.weights[layerIndex - 1][startNeuron.neuronIndex][j];
          
          connections.push({
            startX: startNeuron.x,
            startY: startNeuron.y,
            endX: endNeuron.x,
            endY: endNeuron.y,
            weight: weightValue
          });
        });
      });
    }
  });
  
  return { neurons, connections, layerLabels };
}

export default NeuralNetworkVisualization; 