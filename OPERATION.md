# Guia Operacional do Sistema de Algoritmos Genéticos

Este documento descreve como operar a aplicação de algoritmos genéticos para o treinamento de agentes no jogo da cobrinha.

## Fluxo de Operação

### 1. Iniciar um Novo Treino

Para iniciar um novo treino:

1. Acesse a página principal da aplicação (http://localhost:8000)
2. No painel lateral esquerdo, localize a seção "Novo Treino"
3. Configure os parâmetros de treinamento:
   - **Tamanho da População**: número de agentes por geração (recomendado: 50-200)
   - **Taxa de Mutação**: probabilidade de mutação dos genes (recomendado: 0.05-0.2)
   - **Taxa de Cruzamento**: probabilidade de cruzamento entre indivíduos (recomendado: 0.7-0.9)
   - **Número de Gerações**: limite máximo de gerações para o treino (ex: 100-1000)
   - **Limite de Energia**: quantidade de movimentos permitidos por partida
4. Clique no botão "Iniciar Treino"

### 2. Execução do Jogo

O jogo da cobrinha é executado da seguinte forma:

1. Para cada agente da população:
   - O ambiente do jogo é inicializado com uma cobra e um alimento em posições aleatórias
   - O agente recebe informações do ambiente através dos sensores
   - O agente decide uma ação baseada na sua rede neural
   - A ação é aplicada e o estado do jogo é atualizado
   - Este ciclo continua até que o agente morra (colisão) ou esgote sua energia

2. Condições de término de uma partida:
   - Colisão com a parede
   - Colisão com o próprio corpo
   - Esgotamento da energia disponível

3. Cálculo de pontuação (fitness):
   - Número de alimentos consumidos (principal objetivo)
   - Proximidade ao alimento no final da partida
   - Eficiência de movimento (penalização por movimentos em círculo)

### 3. Funcionamento dos Agentes (Redes Neurais)

Cada agente é controlado por uma rede neural que:

1. **Recebe entrada dos sensores**:
   - Distância até a parede em 8 direções
   - Distância até o próprio corpo em 8 direções
   - Distância e ângulo até o alimento
   - Estado atual da cobra (direção)

2. **Processa através da rede neural**:
   - A informação dos sensores é processada através das camadas da rede
   - Os pesos das conexões são determinados pelo algoritmo genético

3. **Produz uma saída**:
   - Decisão de movimento: Cima, Baixo, Esquerda ou Direita
   - O movimento com maior valor de ativação é selecionado

### 4. Algoritmo Genético e Evolução

Após todas as partidas de uma geração:

1. Os agentes são classificados pelo fitness
2. Os melhores agentes são selecionados para reprodução
3. Novos agentes são criados através de:
   - **Crossover**: combinação dos pesos de dois pais
   - **Mutação**: alterações aleatórias nos pesos
4. A nova população substitui a anterior
5. O processo se repete até atingir o número máximo de gerações

### 5. Visualização em Tempo Real

Durante o treinamento, você poderá observar:

- **No lado esquerdo**: Estatísticas da evolução
  - Geração atual
  - Fitness médio e máximo
  - Diversidade genética
  - Gráficos de progresso

- **No lado direito**: Partidas em execução
  - Visualização do melhor agente jogando
  - Estado da rede neural (opcional)
  - Múltiplas partidas simultâneas

### 6. Renderização das Partidas no Dashboard

As partidas dos agentes são renderizadas no lado direito da tela do dashboard através dos seguintes componentes e processos:

#### Estrutura de visualização

```jsx
<div className="right-side-panel">
  <h3>Partidas em Execução</h3>
  <div className="games-container">
    {activeSessions.map((session, index) => (
      <GameViewer 
        key={index}
        agentId={session.agentId}
        gameState={session.gameState}
        generation={session.generation}
        fitness={session.currentFitness}
      />
    ))}
  </div>
</div>
```

#### Componente de visualização de jogo (GameViewer)

O componente `GameViewer` utiliza Canvas HTML5 para renderizar cada partida:

```jsx
function GameViewer({ agentId, gameState, generation, fitness }) {
  const canvasRef = useRef(null);
  
  // Efeito para renderizar o jogo quando o estado muda
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Define o tamanho da célula
    const cellSize = canvas.width / 25; // Grid 25x25
    
    // Desenha o fundo
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Desenha a grade (opcional)
    ctx.strokeStyle = '#222';
    for (let i = 0; i <= 25; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }
    
    // Desenha a comida
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(
      gameState.food.x * cellSize, 
      gameState.food.y * cellSize, 
      cellSize, 
      cellSize
    );
    
    // Desenha a cobra
    ctx.fillStyle = '#2ecc71';
    gameState.snake.forEach((segment, index) => {
      // Cabeça com cor diferente
      if (index === 0) {
        ctx.fillStyle = '#27ae60';
      }
      
      ctx.fillRect(
        segment.x * cellSize,
        segment.y * cellSize,
        cellSize,
        cellSize
      );
      
      // Volta para a cor do corpo
      if (index === 0) {
        ctx.fillStyle = '#2ecc71';
      }
    });
    
    // Opcional: desenha sensores
    if (gameState.sensors) {
      ctx.strokeStyle = 'rgba(52, 152, 219, 0.5)';
      ctx.lineWidth = 1;
      
      // Desenha linhas dos sensores
      gameState.sensors.forEach(sensor => {
        ctx.beginPath();
        ctx.moveTo(
          gameState.snake[0].x * cellSize + cellSize/2,
          gameState.snake[0].y * cellSize + cellSize/2
        );
        ctx.lineTo(
          sensor.endX * cellSize,
          sensor.endY * cellSize
        );
        ctx.stroke();
      });
    }
    
  }, [gameState]); // Re-renderiza quando o estado muda
  
  return (
    <div className="game-viewer">
      <div className="game-info">
        <span>Agente #{agentId}</span>
        <span>Geração: {generation}</span>
        <span>Fitness: {fitness.toFixed(2)}</span>
      </div>
      <canvas 
        ref={canvasRef} 
        width={250} 
        height={250} 
        className="game-canvas"
      />
    </div>
  );
}
```

#### Atualização em tempo real

O estado das partidas é atualizado em tempo real através de:

1. **WebSockets**: Para comunicação em tempo real entre o backend (Python/GA) e o frontend (React)
2. **Ciclo de atualização**: O backend envia atualizações periódicas (10-30 frames por segundo)
3. **Estado centralizado**: O componente principal do dashboard gerencia o estado global:

```jsx
function Dashboard() {
  const [activeSessions, setActiveSessions] = useState([]);
  
  useEffect(() => {
    // Conecta ao WebSocket para receber atualizações
    const socket = new WebSocket('ws://localhost:8001/ws');
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'game_update') {
        setActiveSessions(prevSessions => {
          // Atualiza a sessão específica ou adiciona uma nova
          const sessionIndex = prevSessions.findIndex(
            s => s.agentId === data.agentId
          );
          
          if (sessionIndex >= 0) {
            const newSessions = [...prevSessions];
            newSessions[sessionIndex] = {
              ...newSessions[sessionIndex],
              gameState: data.gameState,
              currentFitness: data.fitness
            };
            return newSessions;
          } else {
            return [...prevSessions, {
              agentId: data.agentId,
              generation: data.generation,
              gameState: data.gameState,
              currentFitness: data.fitness
            }];
          }
        });
      } else if (data.type === 'game_end') {
        // Remove a sessão quando o jogo termina
        setActiveSessions(prevSessions => 
          prevSessions.filter(s => s.agentId !== data.agentId)
        );
      }
    };
    
    return () => socket.close();
  }, []);
  
  return (
    <div className="dashboard">
      <SideLeft /> {/* Estatísticas e controles */}
      <div className="right-side">
        <h3>Partidas em Execução</h3>
        <div className="games-container">
          {activeSessions.map((session, index) => (
            <GameViewer 
              key={index}
              agentId={session.agentId}
              gameState={session.gameState}
              generation={session.generation}
              fitness={session.currentFitness}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### Estilização

O CSS para a visualização das partidas:

```css
.right-side {
  width: 300px;
  padding: 15px;
  background-color: #222;
  border-left: 1px solid #333;
  overflow-y: auto;
  height: 100vh;
}

.games-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.game-viewer {
  border: 1px solid #444;
  border-radius: 8px;
  overflow: hidden;
  background-color: #1a1a1a;
}

.game-info {
  display: flex;
  justify-content: space-between;
  background-color: #2c3e50;
  padding: 10px;
  font-size: 12px;
}

.game-canvas {
  display: block;
  width: 100%;
}
```

### 7. Conclusão do Treino

Quando o treinamento for concluído:

1. O melhor agente será salvo automaticamente
2. Você pode baixar o modelo treinado para uso futuro
3. Os dados da evolução podem ser exportados para análise

## Dicas e Solução de Problemas

- Se os agentes não apresentarem melhoria após várias gerações, considere:
  - Aumentar a taxa de mutação
  - Ajustar a função de fitness
  - Aumentar o tamanho da população

- Para treinos mais rápidos:
  - Reduza o número de partidas por agente
  - Diminua o limite de energia
  - Reduza o tamanho do tabuleiro

- Se ocorrerem problemas de desempenho:
  - Reduza o número de agentes visualizados simultaneamente
  - Desative os gráficos em tempo real

## Exemplos de Uso

```python
# Exemplo de como iniciar um treino via código
from ga.snake_ga_training import SnakeTraining

# Configurar o treinamento
training = SnakeTraining(
    population_size=100,
    mutation_rate=0.1,
    crossover_rate=0.8,
    max_generations=500,
    energy_limit=100
)

# Iniciar o treinamento
training.start()

# Obter o melhor agente
best_agent = training.get_best_agent()
