# Documentação da Classe Agent

## Visão Geral

A classe `Agent` é um componente central no sistema de algoritmos genéticos para o jogo Snake. Ela representa um agente inteligente que joga o jogo através de uma rede neural controlada por seu genoma (conjunto de pesos). Esta classe gerencia todo o ciclo de vida do agente durante suas interações com o jogo: desde a inicialização, tomada de decisões, processamento de dados coletados, até o encerramento e avaliação de desempenho.

## Estrutura e Atributos

### Identificação e Linhagem
- `id`: Identificador único do agente (gerado aleatoriamente se não fornecido)
- `generation`: Geração à qual o agente pertence
- `parent1_id` e `parent2_id`: Identificadores dos pais genéticos (se aplicável)

### Métricas de Desempenho
- `fitness`: Pontuação de aptidão calculada
- `food_eaten`: Quantidade de comida consumida
- `moves_made`: Número total de movimentos realizados
- `survival_time`: Tempo de sobrevivência (medido em passos)

### Rede Neural
- `input_size`: Tamanho da camada de entrada (24 por padrão)
- `hidden_size`: Tamanho da camada oculta (16 por padrão)
- `output_size`: Tamanho da camada de saída (4 por padrão, correspondendo às direções)
- `genome`: Vetor de pesos da rede neural
- `neural_network`: Instância da rede neural para tomada de decisões

## Métodos Principais

### Inicialização e Configuração

#### `__init__(id=None, genome=None, input_size=24, hidden_size=16, output_size=4)`
Inicializa um novo agente com configurações personalizáveis.

- **Parâmetros**:
  - `id`: Identificador (opcional)
  - `genome`: Vetor de pesos pré-existente (opcional)
  - `input_size`: Tamanho da camada de entrada
  - `hidden_size`: Tamanho da camada oculta
  - `output_size`: Tamanho da camada de saída

### Tomada de Decisão

#### `decide_action(game_state)`
Determina a próxima ação com base no estado atual do jogo.

- **Parâmetros**:
  - `game_state`: Estado atual do jogo
- **Retorna**:
  - Índice da ação escolhida (0-3, representando direções)

#### `_process_game_state(game_state)`
Converte os dados sensoriais do jogo em entradas para a rede neural.

- **Parâmetros**:
  - `game_state`: Estado do jogo com informações sensoriais
- **Retorna**:
  - Vetor de 24 valores (8 direções × 3 variáveis por direção)
  - Para cada direção:
    - Distância até o obstáculo (normalizada)
    - Presença de comida nessa direção (binário)
    - Perigo iminente (binário)

### Avaliação de Desempenho

#### `update_fitness(food_eaten, steps_taken, energy_left)`
Atualiza a pontuação de aptidão do agente com base em seu desempenho.

- **Parâmetros**:
  - `food_eaten`: Quantidade de comida consumida
  - `steps_taken`: Passos realizados
  - `energy_left`: Energia restante

- **Cálculo do Fitness**:
  - `food_fitness`: 100 pontos por comida
  - `efficiency_bonus`: Bônus por eficiência (energia/passos)
  - `survival_bonus`: Bônus pelo tempo de sobrevivência (limitado a 50)

#### `reset()`
Reinicia as métricas de desempenho do agente para uma nova avaliação.

### Ciclo de Vida da Partida

#### `start_game()`
Inicia uma nova partida para o agente (Passo 1).

- **Retorna**:
  - `True` se a partida iniciou com sucesso

#### `transmit_state(game_state, status="EM ANDAMENTO")`
Transmite o estado atual do jogo para processamento em tempo real (Passo 2).

- **Parâmetros**:
  - `game_state`: Estado atual do jogo
  - `status`: Status da partida ("EM ANDAMENTO", "VITORIA" ou "DERROTA")
- **Retorna**:
  - `True` se a transmissão foi bem-sucedida

#### `process_data(game_data)`
Processa os dados coletados durante a partida (Passo 3).

- **Parâmetros**:
  - `game_data`: Dados coletados durante a partida
- **Retorna**:
  - Dicionário com métricas processadas

#### `_analyze_movement(positions)`
Analisa os padrões de movimento da cobra com base nas posições registradas.

- **Parâmetros**:
  - `positions`: Lista de posições (x,y) da cobra ao longo do tempo
- **Retorna**:
  - Dicionário com contagem de movimentos em cada direção

#### `store_data(metrics)`
Armazena os dados da partida para análise posterior (Passo 4).

- **Parâmetros**:
  - `metrics`: Métricas processadas da partida
- **Retorna**:
  - `True` se os dados foram armazenados com sucesso

#### `end_game(result)`
Finaliza a partida e registra o resultado final (Passo 5).

- **Parâmetros**:
  - `result`: Resultado final da partida
- **Retorna**:
  - Resumo da partida finalizada

### Simulação Completa

#### `play_game(simulator, max_steps=1000)`
Executa o fluxo completo de uma partida para este agente.

- **Parâmetros**:
  - `simulator`: Simulador do jogo
  - `max_steps`: Número máximo de passos (padrão: 1000)
- **Retorna**:
  - Resumo da partida

## Fluxo de Funcionamento

1. **Inicialização**: Um agente é criado com um genoma aleatório ou herdado
2. **Partida**: 
   - O agente é conectado ao jogo Snake
   - Em cada passo do jogo:
     - Recebe o estado atual (posição da cobra, comida, obstáculos)
     - Processa o estado para extrair características relevantes
     - Alimenta essas características na rede neural
     - Determina a ação (direção) com base na saída da rede
     - Transmite dados para visualização/análise
3. **Avaliação**:
   - Após a partida, o fitness é calculado
   - Os dados são processados e armazenados
   - Recursos são liberados
4. **Evolução**: Os agentes com melhor desempenho têm maior probabilidade de reprodução

## Componentes Relacionados

- **NeuralNetwork**: Implementa a rede neural para tomada de decisões
- **snake_mach**: Gerencia a transmissão de dados em tempo real
- **save_game_data**: Função para armazenar dados da partida

## Exemplo de Uso

```python
# Criar um agente com configuração padrão
agent = Agent()

# Inicializar simulador
simulator = SnakeGameSimulator(grid_size=25, initial_energy=100)

# Executar uma partida completa
results = agent.play_game(simulator, max_steps=500)

# Acessar o fitness final
print(f"Fitness alcançado: {agent.fitness}")
```

## Notas de Implementação

1. A classe segue os 5 passos definidos em `AGENT_STEPS.md` para gerenciar o ciclo de vida completo de uma partida.
2. A estrutura de entrada da rede neural (24 valores) corresponde a 8 direções com 3 valores por direção.
3. O cálculo de fitness prioriza a obtenção de comida, mas também recompensa eficiência e sobrevivência.
4. O agente pode ser usado tanto para treinamento com algoritmos genéticos quanto para demonstração do comportamento aprendido. 