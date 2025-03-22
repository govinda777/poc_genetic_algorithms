## Descrição dos Componentes

### `snake_ga.py`

Este arquivo contém a implementação central do algoritmo genético, incluindo:

- **Classe `GeneticAlgorithm`**: Responsável pela evolução da população.
- **Classe `NeuralNetwork`**: Implementação da rede neural utilizada pelos agentes.
- **Classe `Agent`**: Representa um agente individual com sua rede neural e genoma.

Funcionalidades principais:
- Criação e gerenciamento de população
- Codificação dos genomas (vetores de pesos)
- Operadores genéticos: seleção, crossover, mutação
- Sensores de percepção do ambiente

#### Exemplo de uso básico:

```python
from snake_ga import GeneticAlgorithm, Agent

# Inicializa o algoritmo genético
ga = GeneticAlgorithm(
    population_size=100,
    mutation_rate=0.1,
    crossover_rate=0.8,
    network_architecture=[24, 16, 4]  # [entrada, camada oculta, saída]
)

# Cria a população inicial
population = ga.create_initial_population()

# Evolui por uma geração
next_generation = ga.evolve_population(population, fitness_scores)
```

### `snake_ga_data.py`

Responsável pelo gerenciamento de dados gerados durante o treinamento, incluindo:

- Registro de métricas de desempenho
- Armazenamento e recuperação de dados de treinamento
- Exportação de resultados para formatos como CSV e JSON
- Funções de análise estatística

Principais funcionalidades:
- `save_training_data()`: Salva os dados do treinamento em disco
- `load_training_data()`: Carrega dados de treinamento anteriores
- `export_metrics()`: Exporta métricas para análise externa
- `generate_charts()`: Cria visualizações para análise rápida

#### Exemplo de uso:

```python
from snake_ga_data import TrainingDataManager

# Inicializa o gerenciador de dados
data_manager = TrainingDataManager(output_dir="./training_data/")

# Registra dados de uma geração
data_manager.record_generation(
    generation_number=10,
    population=current_population,
    fitness_scores=[23.5, 17.8, ...],
    best_agent=best_agent
)

# Exporta os dados ao final do treino
data_manager.export_training_session("treino_20231025")
```

### `snake_ga_training.py`

Contém o sistema de treinamento que coordena a execução de partidas, avaliação de agentes e o processo evolutivo:

- **Classe `SnakeTraining`**: Orquestra o processo de treinamento completo
- **Classe `GameSimulator`**: Simula partidas para avaliar agentes
- **Classe `FitnessEvaluator`**: Calcula pontuações de fitness

Funcionalidades principais:
- Configuração de parâmetros de treinamento
- Execução de múltiplas partidas para cada agente
- Cálculo de fitness baseado em múltiplos critérios
- Controle de tempo e energia durante as partidas
- Interface para monitoramento externo do progresso

#### Exemplo de uso:

```python
from snake_ga_training import SnakeTraining

# Configura e inicia um treinamento
training = SnakeTraining(
    population_size=100,
    mutation_rate=0.1,
    crossover_rate=0.8,
    max_generations=500,
    energy_limit=200,
    games_per_agent=5
)

# Inicia o treinamento
training.start()

# Recupera o melhor agente ao final
best_agent = training.get_best_agent()

# Salva o melhor agente
training.save_best_agent("best_agent.json")
```

## Configuração da Rede Neural

A rede neural utilizada pelos agentes possui a seguinte estrutura:

- **Camada de entrada (24 neurônios)**:
  - 8 sensores de distância até a parede
  - 8 sensores de distância até o próprio corpo
  - 2 valores para distância e ângulo até a comida
  - 4 valores para direção atual da cobra (one-hot)
  - 2 valores de bias

- **Camada oculta (16 neurônios)**:
  - Função de ativação: ReLU (Rectified Linear Unit)

- **Camada de saída (4 neurônios)**:
  - Representa as ações: Cima, Baixo, Esquerda, Direita
  - Função de ativação: Softmax

## Algoritmo Genético

O algoritmo genético implementado segue estas etapas:

1. **Inicialização**: Cria uma população aleatória de agentes
2. **Avaliação**: Executa partidas para cada agente e calcula seu fitness
3. **Seleção**: Seleciona os melhores agentes usando seleção por torneio
4. **Crossover**: Combina genes de dois pais para criar filhos
5. **Mutação**: Introduz pequenas variações aleatórias nos genes
6. **Substituição**: A nova geração substitui a anterior
7. **Repetição**: Retorna à etapa 2 até atingir o critério de parada

### Função de Fitness

O fitness de cada agente é calculado com base em:

