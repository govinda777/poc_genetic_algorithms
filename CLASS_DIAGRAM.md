# Diagrama de Classes - Snake Genetic Algorithm

```mermaid
classDiagram
    %% Classes principais do core do sistema
    class SnakeGameSimulator {
        -int grid_size
        -int initial_energy
        -list snake
        -dict food
        -int score
        -int energy
        -bool game_over
        +__init__(grid_size, initial_energy)
        +reset()
        +generate_food()
        +get_state()
        +calculate_vision()
        +check_collision(position)
        +apply_action(action)
        +step()
    }

    class Agent {
        -string id
        -int generation
        -string parent1_id
        -string parent2_id
        -float fitness
        -int food_eaten
        -int moves_made
        -int survival_time
        -NeuralNetwork neural_network
        -array genome
        +__init__(id, genome, input_size, hidden_size, output_size)
        +decide_action(game_state)
        +update_fitness(food_eaten, steps_taken, energy_left)
        +reset()
    }

    class NeuralNetwork {
        -int input_size
        -int hidden_size
        -int output_size
        -array weights_input_hidden
        -array bias_hidden
        -array weights_hidden_output
        -array bias_output
        +__init__(input_size, hidden_size, output_size, weights)
        +forward(inputs)
        +get_weights_flat()
        +relu(x)
        +softmax(x)
    }

    class AgentDNA {
        -int input_size
        -int hidden_size
        -int output_size
        -array genes
        -int total_genes
        +__init__(input_size, hidden_size, output_size, genes)
        +mutate(mutation_rate, mutation_strength)
        +crossover(partner_dna)
        +to_list()
        +clone()
    }

    class GeneticAlgorithm {
        -int population_size
        -float mutation_rate
        -float crossover_rate
        -float elitism
        -list population
        -int generation
        -float best_fitness
        -Agent best_agent
        +__init__(population_size, mutation_rate, crossover_rate, elitism)
        +initialize_population()
        +evolve()
        +select_parent()
        +crossover(genome1, genome2)
        +mutate(genome)
    }

    class SnakeMach {
        -string status
        -string agent_id
        -dict state
        -lock
        +__init__()
        +update_state(agent_id, game_state, status)
        +get_payload()
        +reset()
    }

    class TrainingData {
        -string data_dir
        -string session_id
        -string session_dir
        -list generation_data
        -list best_agents
        -float start_time
        +__init__(data_dir)
        +record_generation(generation, population, best_fitness, diversity)
        +save_training_data()
        +save_training_session()
        +export_for_dashboard()
    }

    %% Classes da jornada de treinamento
    class TrainingJourney {
        -dict config
        -GeneticAlgorithm ga
        -SnakeGameSimulator simulator
        -TrainingData data_manager
        -Agent best_agent
        -float best_fitness
        -int stagnation_counter
        -int current_generation
        -list performance_history
        +__init__(config)
        +setup()
        +run()
        +evaluate_best_agent(games)
        -_train_generation()
        -_check_stop_criteria(result)
        -_visualize_best_agent()
        -_finalize(training_time)
        -_record_config()
    }

    class JourneyVisualizer {
        -int grid_size
        -float replay_speed
        -SnakeGameSimulator simulator
        +__init__(grid_size, replay_speed)
        +visualize_agent(agent, max_steps, delay)
        +replay_match(match_file, delay)
        +record_match(agent, output_file, max_steps)
    }

    %% Classes de API e Interface
    class JourneyAPI {
        -TrainingJourney active_journey
        -Thread journey_thread
        -bool should_stop
        +start_journey(params)
        +stop_journey()
        +get_journey_status()
        -_run_journey_thread(config)
        +register_journey_routes(app)
    }

    class FlaskAPI {
        -Flask app
        -SocketIO socketio
        +run_training_process(epochs, population_size, ...)
        +start_training()
        +training_status()
        +stop_training()
        +get_training_data()
        +list_sessions()
        +visualize_agent_route(session_id)
        +replay_match_route(session_id)
    }

    %% Classes de Dashboard
    class Dashboard {
        +Core()
        +SideLeft()
        +SideRight()
        +Footer()
    }
    
    %% Relacionamentos
    Agent "1" --* "1" NeuralNetwork : possui
    Agent "1" --o "1" AgentDNA : pode utilizar
    GeneticAlgorithm "1" --* "*" Agent : gerencia
    TrainingJourney "1" --* "1" GeneticAlgorithm : utiliza
    TrainingJourney "1" --* "1" SnakeGameSimulator : utiliza
    TrainingJourney "1" --* "1" TrainingData : gerencia dados
    JourneyVisualizer "1" --* "1" SnakeGameSimulator : utiliza
    JourneyVisualizer ..> SnakeMach : transmite dados
    TrainingJourney ..> SnakeMach : transmite dados
    JourneyAPI "1" --o "1" TrainingJourney : controla
    FlaskAPI ..> JourneyAPI : utiliza
    Dashboard ..> FlaskAPI : consome dados
```

## Descrição das Classes Principais

### Core do Sistema

- **SnakeGameSimulator**: Responsável pela simulação do ambiente do jogo da cobra
- **Agent**: Representa um agente controlado por IA no jogo
- **NeuralNetwork**: Implementa a rede neural usada para tomada de decisões
- **AgentDNA**: Representa o genoma (pesos) de um agente para evolução genética
- **GeneticAlgorithm**: Implementa o algoritmo genético para evoluir a população de agentes
- **SnakeMach**: Transmite dados em tempo real para visualização
- **TrainingData**: Gerencia o armazenamento e exportação de dados de treinamento

### Jornada de Treinamento

- **TrainingJourney**: Gerencia o ciclo completo de treinamento, desde a configuração até avaliação
- **JourneyVisualizer**: Visualiza agentes em ação, permite replay de partidas salvas

### API e Interface

- **JourneyAPI**: Expõe funcionalidades da jornada para a aplicação web
- **FlaskAPI**: Implementa endpoints REST para controle do sistema

### Dashboard

- **Dashboard**: Interface visual para monitorar e controlar o treinamento
  - Contém componentes como Core, SideLeft, SideRight e Footer

## Relacionamentos Principais

- Um **Agent** possui uma **NeuralNetwork** para tomada de decisões
- Um **GeneticAlgorithm** gerencia múltiplos **Agent**
- A **TrainingJourney** utiliza **GeneticAlgorithm**, **SnakeGameSimulator** e **TrainingData**
- O **JourneyVisualizer** transmite dados via **SnakeMach**
- A **FlaskAPI** controla a **JourneyAPI** que por sua vez controla a **TrainingJourney**
- O **Dashboard** consome dados da **FlaskAPI**

Este diagrama de classes representa a arquitetura completa do sistema, mostrando tanto os componentes de backend (simulação, algoritmo genético) quanto os componentes de frontend (dashboard, visualização).
