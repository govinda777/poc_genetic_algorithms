import React from 'react';

/**
 * Componente para visualização do DNA do agente
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.agent - Dados do agente a ser visualizado
 */
const DNAVisualization = ({ agent }) => {
  // Usar dados fictícios se nenhum agente for fornecido
  const agentData = agent || {
    id: 'agent-123',
    dna: Array(100).fill().map(() => Math.random() < 0.7) // 70% de genes ativos
  };

  // Agrupar genes para melhor visualização (10 por linha)
  const chunkedGenes = [];
  for (let i = 0; i < agentData.dna.length; i += 10) {
    chunkedGenes.push(agentData.dna.slice(i, i + 10));
  }

  return (
    <div className="dna-visualization">
      <h3>Visualização do DNA</h3>
      
      <div data-testid="dna-visualization" className="dna-container">
        <div className="dna-representation">
          {chunkedGenes.map((geneRow, rowIndex) => (
            <div key={`row-${rowIndex}`} className="gene-row">
              {geneRow.map((isActive, geneIndex) => {
                const actualIndex = rowIndex * 10 + geneIndex;
                return (
                  <div 
                    key={`gene-${actualIndex}`} 
                    className={`gene-cell ${isActive ? 'active' : 'inactive'}`}
                    data-testid={isActive ? 'active-gene' : 'inactive-gene'}
                    title={`Gene ${actualIndex}: ${isActive ? 'Ativo' : 'Inativo'}`}
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: isActive ? '#4CAF50' : '#F44336',
                      margin: '2px',
                      display: 'inline-block',
                      borderRadius: '4px'
                    }}
                  >
                    {actualIndex}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        <div data-testid="gene-values" className="gene-values">
          <h4>Valores dos Genes</h4>
          <div className="values-container" style={{ maxHeight: '300px', overflowY: 'auto', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Gene</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Estado</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Função</th>
                </tr>
              </thead>
              <tbody>
                {agentData.dna.map((isActive, index) => (
                  <tr key={`gene-row-${index}`}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{index}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                      <span 
                        style={{ 
                          color: isActive ? '#4CAF50' : '#F44336',
                          fontWeight: 'bold'
                        }}
                      >
                        {isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                      {`Controla comportamento ${index % 5 === 0 ? 'de alimentação' : 
                        index % 4 === 0 ? 'de fuga' : 
                        index % 3 === 0 ? 'de exploração' : 
                        index % 2 === 0 ? 'de decisão' : 'básico'}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="dna-legend" style={{ marginTop: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div 
              style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: '#4CAF50', 
                marginRight: '10px',
                borderRadius: '4px'
              }}
            ></div>
            <span>Gene Ativo</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div 
              style={{ 
                width: '20px', 
                height: '20px', 
                backgroundColor: '#F44336', 
                marginRight: '10px',
                borderRadius: '4px'
              }}
            ></div>
            <span>Gene Inativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DNAVisualization; 