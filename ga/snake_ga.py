import os
import time
import json
import numpy as np
import webbrowser
import random
from .snake_agent import Agent
from .snake_nn import NeuralNetwork
from .snake_mach import snake_mach
from .snake_ga_data import save_game_data
from .snake_ga_training import SnakeGameSimulator

# Hiperparâmetros da rede
INPUT_SIZE = 24
HIDDEN_SIZE = 16
OUTPUT_SIZE = 4

class GeneticAlgorithm:
    def __init__(self, population_size=100, mutation_rate=0.1, crossover_rate=0.7, elitism=0.1):
        self.population_size = population_size
        self.mutation_rate = mutation_rate
        self.crossover_rate = crossover_rate
        self.elitism = elitism
        self.population = []
        self.generation = 0
        self.best_fitness = 0
        self.best_agent = None
        self.initialize_population()

    def initialize_population(self):
        """Cria uma população inicial de agentes aleatórios."""
        self.population = [
            Agent(input_size=INPUT_SIZE, hidden_size=HIDDEN_SIZE, output_size=OUTPUT_SIZE)
            for _ in range(self.population_size)
        ]

    def evolve(self):
        """Evolui a população atual para a próxima geração."""
        self.population.sort(key=lambda agent: agent.fitness, reverse=True)

        # Atualiza o melhor agente global
        if self.population[0].fitness > self.best_fitness:
            self.best_fitness = self.population[0].fitness
            self.best_agent = self.population[0]

        diversity = self.calculate_diversity()
        new_population = []

        # Elitismo: mantém os melhores agentes
        elitism_count = int(self.population_size * self.elitism)
        for i in range(elitism_count):
            genome = self.population[i].genome.copy()
            new_population.append(Agent(genome=genome, input_size=INPUT_SIZE, hidden_size=HIDDEN_SIZE, output_size=OUTPUT_SIZE))

        # Geração de novos agentes
        while len(new_population) < self.population_size:
            parent1 = self.select_parent()
            parent2 = self.select_parent()

            if random.random() < self.crossover_rate:
                child_genome = self.crossover(parent1.genome, parent2.genome)
            else:
                child_genome = parent1.genome.copy()

            child_genome = self.mutate(child_genome)

            new_population.append(
                Agent(genome=child_genome, input_size=INPUT_SIZE, hidden_size=HIDDEN_SIZE, output_size=OUTPUT_SIZE)
            )

        self.population = new_population
        self.generation += 1

        return {
            'population': self.population,
            'generation': self.generation,
            'best_fitness': self.best_fitness,
            'diversity': diversity
        }

    def select_parent(self):
        """Seleciona um agente com base em torneio."""
        tournament = random.sample(self.population, 5)
        tournament.sort(key=lambda agent: agent.fitness, reverse=True)
        return tournament[0]

    def crossover(self, genome1, genome2):
        """Aplica crossover de ponto único entre dois genomas."""
        point = random.randint(0, len(genome1) - 1)
        return np.concatenate([genome1[:point], genome2[point:]])

    def mutate(self, genome):
        """Aplica mutação gaussiana em um genoma."""
        for i in range(len(genome)):
            if random.random() < self.mutation_rate:
                genome[i] += random.gauss(0, 0.2)
               

class SnakeGA:
    """
    Implementação do algoritmo genético para o jogo da cobra.
    Gerencia a evolução da população de agentes e fornece métodos para iniciar, 
    transmitir e finalizar partidas.
    """
    
    def __init__(self, population_size=100, mutation_rate=0.1, crossover_rate=0.7, elitism=0.1):
        """
        Inicializa o algoritmo genético com parâmetros configuráveis.
        
        Args:
            population_size (int): Tamanho da população
            mutation_rate (float): Taxa de mutação (0.0 a 1.0)
            crossover_rate (float): Taxa de cruzamento (0.0 a 1.0)
            elitism (float): Taxa de elitismo (0.0 a 1.0)
        """
        self.population_size = population_size
        self.mutation_rate = mutation_rate
        self.crossover_rate = crossover_rate
        self.elitism = elitism
        self.population = []
        self.generation = 0
        self.best_fitness = 0
        self.best_agent = None
        
        # Inicializa a população inicial
        self._initialize_population()
    
    def _initialize_population(self):
        """Cria a população inicial de agentes com genomas aleatórios."""
        self.population = []
        for i in range(self.population_size):
            agent_id = f"agent_{self.generation}_{i}"
            agent = Agent(id=agent_id)
            self.population.append(agent)
    
    def evolve(self):
        """
        Evolui a população para a próxima geração usando seleção, cruzamento e mutação.
        
        Returns:
            dict: Resultados da evolução, incluindo melhor fitness e diversidade.
        """
        # Implementação existente...
        pass
    
    # Novos métodos baseados na documentação AGENT_STEPS.md
    
    def start_game(self, agent_id):
        """
        Inicia uma partida para o agente especificado.
        
        Args:
            agent_id (str): ID do agente que jogará a partida
            
        Returns:
            bool: True se a partida foi iniciada com sucesso
        """
        # Passo 1: Iniciar uma partida
        game_url = f"game/snake_game.html?agent_id={agent_id}"
        
        # Abre o jogo no navegador (em ambiente de desenvolvimento)
        # Em produção, poderia ser substituído por outra forma de iniciar o jogo
        try:
            webbrowser.open(game_url)
            print(f"Partida iniciada para o agente {agent_id}")
            return True
        except Exception as e:
            print(f"Erro ao iniciar partida: {e}")
            return False
    
    def transmit_game_state(self, agent_id, game_state, status="EM ANDAMENTO"):
        """
        Transmite o estado atual do jogo para processamento em tempo real.
        
        Args:
            agent_id (str): ID do agente jogando
            game_state (dict): Estado atual do jogo
            status (str): Status da partida ("EM ANDAMENTO", "VITORIA", "DERROTA")
            
        Returns:
            bool: True se a transmissão foi bem-sucedida
        """
        # Passo 2: Processo de transmissão da partida
        try:
            # Utiliza o snake_mach para transmitir dados em tempo real
            snake_mach.update_state(
                agent_id=agent_id,
                game_state=game_state,
                status=status
            )
            return True
        except Exception as e:
            print(f"Erro na transmissão: {e}")
            return False
    
    def process_game_data(self, agent_id, game_data):
        """
        Processa os dados coletados durante a partida para avaliação do agente.
        
        Args:
            agent_id (str): ID do agente
            game_data (dict): Dados coletados durante a partida
            
        Returns:
            dict: Métricas processadas
        """
        # Passo 3: Coleta e processamento de dados
        metrics = {
            "agent_id": agent_id,
            "timestamp": time.time(),
            "score": game_data.get("score", 0),
            "steps": game_data.get("steps", 0),
            "energy_left": game_data.get("energy", 0),
            "movement_patterns": self._analyze_movement(game_data.get("snake_positions", [])),
            "collisions": game_data.get("collisions", 0)
        }
        
        # Atualiza o fitness do agente com base nos dados da partida
        agent = self._find_agent_by_id(agent_id)
        if agent:
            agent.update_fitness(
                food_eaten=game_data.get("score", 0),
                steps_taken=game_data.get("steps", 0),
                energy_left=game_data.get("energy", 0)
            )
        
        return metrics
    
    def _analyze_movement(self, positions):
        """Analisa padrões de movimento com base nas posições."""
        # Implementação simplificada para análise de movimento
        if not positions or len(positions) < 2:
            return {"pattern": "insufficient_data"}
            
        # Análise básica (pode ser expandida conforme necessário)
        directions_count = {"up": 0, "down": 0, "left": 0, "right": 0}
        for i in range(1, len(positions)):
            prev = positions[i-1]
            curr = positions[i]
            dx = curr["x"] - prev["x"]
            dy = curr["y"] - prev["y"]
            
            if dx > 0: directions_count["right"] += 1
            elif dx < 0: directions_count["left"] += 1
            elif dy > 0: directions_count["down"] += 1
            elif dy < 0: directions_count["up"] += 1
        
        return directions_count
    
    def _find_agent_by_id(self, agent_id):
        """Encontra um agente pelo ID."""
        for agent in self.population:
            if agent.id == agent_id:
                return agent
        return None
    
    def store_game_data(self, agent_id, metrics):
        """
        Armazena os dados da partida para análise posterior.
        
        Args:
            agent_id (str): ID do agente
            metrics (dict): Métricas processadas da partida
            
        Returns:
            bool: True se os dados foram armazenados com sucesso
        """
        # Passo 4: Armazenamento de dados
        try:
            # Utiliza a função save_game_data do módulo snake_ga_data
            save_game_data(agent_id, metrics)
            print(f"Dados da partida do agente {agent_id} salvos com sucesso")
            return True
        except Exception as e:
            print(f"Erro ao salvar dados: {e}")
            return False
    
    def end_game(self, agent_id, result):
        """
        Finaliza a partida e registra o resultado.
        
        Args:
            agent_id (str): ID do agente
            result (dict): Resultado final da partida
            
        Returns:
            dict: Resumo da partida finalizada
        """
        # Passo 5: Finalização da partida
        agent = self._find_agent_by_id(agent_id)
        
        # Registra o resultado final
        summary = {
            "agent_id": agent_id,
            "generation": self.generation,
            "timestamp": time.time(),
            "result": result.get("status", "DESCONHECIDO"),
            "final_score": result.get("score", 0),
            "steps_taken": result.get("steps", 0),
            "fitness": agent.fitness if agent else 0
        }
        
        # Libera recursos (para a próxima execução)
        snake_mach.reset()
        print(f"Partida finalizada para o agente {agent_id}")
        
        return summary
    
    def run_game_for_agent(self, agent_id, max_steps=1000):
        """
        Executa o fluxo completo de uma partida para um agente.
        
        Args:
            agent_id (str): ID do agente
            max_steps (int): Número máximo de passos
            
        Returns:
            dict: Resumo da partida
        """
        # Inicia a partida
        self.start_game(agent_id)
        
        # Simula a partida em tempo real (em um ambiente real este seria diferente)
        game_data = {
            "score": 0,
            "steps": 0,
            "energy": 100,
            "snake_positions": [],
            "collisions": 0,
            "status": "EM ANDAMENTO"
        }
        
        # Loop principal da partida 
        simulator = SnakeGameSimulator(grid_size=25, initial_energy=100)
        simulator.reset()
        agent = self._find_agent_by_id(agent_id)
        
        for step in range(max_steps):
            # Obter estado atual
            state = simulator.get_state()
            
            # Transmitir estado atual
            self.transmit_game_state(agent_id, state)
            
            # Agente toma decisão
            action = agent.decide_action(state)
            
            # Aplica ação no simulador
            game_over = simulator.step()
            
            # Atualiza dados da partida
            game_data["score"] = state.get("score", 0)
            game_data["steps"] = step + 1
            game_data["energy"] = state.get("energy", 0)
            game_data["snake_positions"].append(state.get("snake", [])[0])
            
            # Verifica fim de jogo
            if game_over:
                game_data["status"] = "DERROTA"
                break
                
        # Processa dados da partida
        metrics = self.process_game_data(agent_id, game_data)
        
        # Armazena dados
        self.store_game_data(agent_id, metrics)
        
        # Finaliza a partida
        return self.end_game(agent_id, {
            "status": game_data["status"],
            "score": game_data["score"],
            "steps": game_data["steps"]
        })
       
