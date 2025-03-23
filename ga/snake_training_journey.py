"""
Snake Training Journey

Este módulo implementa a jornada completa de treinamento para os agentes da cobra,
desde a configuração inicial até a análise de resultados e armazenamento de dados.
"""

import os
import time
import numpy as np
import json
from datetime import datetime

from .snake_ga import GeneticAlgorithm
from .snake_ga_training import SnakeGameSimulator, train_population
from .snake_ga_data import TrainingData
from .snake_mach import snake_mach

class TrainingJourney:
    """
    Gerencia a jornada completa de treinamento dos agentes, incluindo:
    - Configuração de parâmetros
    - Execução do treinamento
    - Visualização em tempo real
    - Avaliação de resultados
    - Armazenamento de dados
    """
    
    def __init__(self, config=None):
        """
        Inicializa a jornada de treinamento com configurações personalizáveis.
        
        Args:
            config (dict, optional): Configurações personalizadas.
        """
        # Configurações padrão
        self.config = {
            # Configurações do ambiente
            "grid_size": 25,
            "initial_energy": 100,
            
            # Configurações da população
            "population_size": 100,
            "elitism": 0.1,
            "mutation_rate": 0.1,
            "crossover_rate": 0.7,
            
            # Configurações do treinamento
            "generations": 100,
            "games_per_agent": 3,
            "max_steps": 1000,
            
            # Critérios de parada
            "target_fitness": 1000,
            "stagnation_limit": 20,
            
            # Visualização
            "real_time_visualization": True,
            "visualization_frequency": 5,  # A cada quantas gerações visualizar
            
            # Armazenamento de dados
            "data_dir": "../data",
            "save_frequency": 10  # A cada quantas gerações salvar
        }
        
        # Sobrescrever com configurações personalizadas
        if config:
            self.config.update(config)
            
        # Inicializar componentes
        self.ga = None
        self.simulator = None
        self.data_manager = None
        self.best_agent = None
        self.best_fitness = 0
        self.stagnation_counter = 0
        self.current_generation = 0
        
        # Métricas para acompanhamento
        self.performance_history = []
        
    def setup(self):
        """
        Configura o ambiente, população inicial e sistema de dados.
        
        Returns:
            self: Para encadeamento de métodos.
        """
        print("Configurando jornada de treinamento...")
        
        # Inicializar simulador
        self.simulator = SnakeGameSimulator(
            grid_size=self.config["grid_size"],
            initial_energy=self.config["initial_energy"]
        )
        
        # Inicializar algoritmo genético
        self.ga = GeneticAlgorithm(
            population_size=self.config["population_size"],
            mutation_rate=self.config["mutation_rate"],
            crossover_rate=self.config["crossover_rate"],
            elitism=self.config["elitism"]
        )
        
        # Inicializar sistema de armazenamento de dados
        self.data_manager = TrainingData(data_dir=self.config["data_dir"])
        
        # Registrar configuração inicial
        self._record_config()
        
        print(f"Jornada configurada. População inicial: {self.config['population_size']} agentes")
        return self
    
    def _record_config(self):
        """
        Registra a configuração da jornada para referência futura.
        """
        config_file = os.path.join(self.data_manager.session_dir, 'journey_config.json')
        with open(config_file, 'w') as f:
            json.dump(self.config, f, indent=2)
    
    def run(self):
        """
        Executa a jornada completa de treinamento.
        
        Returns:
            dict: Resultados finais do treinamento.
        """
        print(f"Iniciando jornada de treinamento com {self.config['generations']} gerações...")
        start_time = time.time()
        
        # Loop principal por gerações
        for generation in range(self.config["generations"]):
            self.current_generation = generation
            print(f"\nGeração {generation+1}/{self.config['generations']}")
            
            # Executar treinamento da população atual
            result = self._train_generation()
            
            # Verificar critérios de parada
            if self._check_stop_criteria(result):
                print(f"Critério de parada atingido na geração {generation+1}.")
                break
            
            # Visualizar progresso se configurado
            if self.config["real_time_visualization"] and generation % self.config["visualization_frequency"] == 0:
                self._visualize_best_agent()
            
            # Salvar dados periodicamente
            if generation % self.config["save_frequency"] == 0:
                self.data_manager.save_training_data()
        
        # Finalizar e salvar dados
        training_time = time.time() - start_time
        self._finalize(training_time)
        
        return {
            "generations_completed": self.current_generation + 1,
            "best_fitness": self.best_fitness,
            "best_agent": self.best_agent,
            "training_time": training_time,
            "session_id": self.data_manager.session_id
        }
    
    def _train_generation(self):
        """
        Treina a população atual por uma geração.
        
        Returns:
            dict: Resultados do treinamento desta geração.
        """
        # Treinar a população atual
        result = train_population(
            self.ga, 
            self.simulator, 
            max_steps=self.config["max_steps"], 
            games=self.config["games_per_agent"]
        )
        
        # Extrair dados relevantes
        population = result["population"]
        best_fitness = result["best_fitness"]
        diversity = result["diversity"]
        
        # Atualizar o melhor de todos os tempos se necessário
        if best_fitness > self.best_fitness:
            self.best_fitness = best_fitness
            self.best_agent = self.ga.population[0]  # O melhor agente está na posição 0 após o treino
            self.stagnation_counter = 0
        else:
            self.stagnation_counter += 1
        
        # Registrar dados desta geração
        self.data_manager.record_generation(
            generation=self.current_generation,
            population=population,
            best_fitness=best_fitness,
            diversity=diversity
        )
        
        # Evoluir para próxima geração
        self.ga.evolve()
        
        return {
            "best_fitness": best_fitness,
            "diversity": diversity,
            "population": population
        }
    
    def _check_stop_criteria(self, result):
        """
        Verifica se algum critério de parada foi atingido.
        
        Args:
            result (dict): Resultados da geração atual.
            
        Returns:
            bool: True se algum critério de parada foi atingido.
        """
        # Critério 1: Atingiu fitness alvo
        if result["best_fitness"] >= self.config["target_fitness"]:
            print(f"Atingido fitness alvo de {self.config['target_fitness']}!")
            return True
        
        # Critério 2: Estagnação por muitas gerações
        if self.stagnation_counter >= self.config["stagnation_limit"]:
            print(f"Treinamento estagnado por {self.config['stagnation_limit']} gerações.")
            return True
        
        return False
    
    def _visualize_best_agent(self):
        """
        Visualiza o melhor agente atual em tempo real.
        """
        if not self.best_agent:
            return
            
        # Preparar simulação do melhor agente
        simulator = SnakeGameSimulator(
            grid_size=self.config["grid_size"],
            initial_energy=self.config["initial_energy"]
        )
        
        # Resetar simulador
        simulator.reset()
        
        # Transmitir estado inicial
        snake_mach.update_state(
            agent_id=self.best_agent.id,
            game_state=simulator.get_state()
        )
        
        print(f"Simulando melhor agente (ID: {self.best_agent.id}, Fitness: {self.best_agent.fitness:.2f})")
        
        # Executar simulação por um número limitado de passos
        max_demo_steps = min(200, self.config["max_steps"])  # Limitar para demo
        
        for step in range(max_demo_steps):
            # Obter estado atual
            state = simulator.get_state()
            
            # Tomar decisão com base no estado
            action = self.best_agent.decide_action(state)
            
            # Aplicar ação e obter resultado
            reward, game_over = simulator.apply_action(action)
            
            # Atualizar visualização em tempo real
            snake_mach.update_state(
                agent_id=self.best_agent.id,
                game_state=simulator.get_state(),
                status="EM ANDAMENTO" if not game_over else "DERROTA"
            )
            
            # Pequena pausa para visualização
            time.sleep(0.1)
            
            # Verificar se o jogo acabou
            if game_over:
                break
    
    def _finalize(self, training_time):
        """
        Finaliza a jornada de treinamento e salva os resultados.
        
        Args:
            training_time (float): Tempo total de treinamento em segundos.
        """
        print("\nFinalizando jornada de treinamento...")
        
        # Salvar dados finais
        self.data_manager.save_training_data()
        
        # Salvar agente com melhor desempenho
        if self.best_agent:
            best_agent_file = os.path.join(self.data_manager.session_dir, 'best_agent.json')
            with open(best_agent_file, 'w') as f:
                json.dump({
                    "id": self.best_agent.id,
                    "fitness": self.best_agent.fitness,
                    "generation": self.current_generation,
                    "genome": self.best_agent.genome.tolist() if hasattr(self.best_agent.genome, 'tolist') else self.best_agent.genome,
                    "food_eaten": self.best_agent.food_eaten,
                    "moves_made": self.best_agent.moves_made,
                    "training_time": training_time
                }, f, indent=2)
        
        # Salvar resumo da sessão
        summary_file = self.data_manager.save_training_session()
        
        # Exibir resumo
        hours, remainder = divmod(training_time, 3600)
        minutes, seconds = divmod(remainder, 60)
        print(f"Treinamento concluído em {int(hours)}h {int(minutes)}m {int(seconds)}s")
        print(f"Gerações completadas: {self.current_generation + 1}")
        print(f"Melhor fitness: {self.best_fitness:.2f}")
        print(f"Dados salvos em: {self.data_manager.session_dir}")
    
    def evaluate_best_agent(self, games=10):
        """
        Avalia o melhor agente em múltiplos jogos para análise final.
        
        Args:
            games (int): Número de jogos para avaliação.
            
        Returns:
            dict: Estatísticas da avaliação.
        """
        if not self.best_agent:
            return {"error": "Nenhum agente disponível para avaliação."}
        
        print(f"\nAvaliando melhor agente em {games} jogos...")
        
        # Métricas para avaliação
        total_score = 0
        total_steps = 0
        max_score = 0
        games_completed = 0
        
        # Executar múltiplos jogos
        for game in range(games):
            # Preparar ambiente
            simulator = SnakeGameSimulator(
                grid_size=self.config["grid_size"],
                initial_energy=self.config["initial_energy"]
            )
            simulator.reset()
            
            # Jogar até o fim
            steps = 0
            game_over = False
            
            while not game_over and steps < self.config["max_steps"]:
                # Obter estado atual
                state = simulator.get_state()
                
                # Tomar decisão com base no estado
                action = self.best_agent.decide_action(state)
                
                # Aplicar ação e obter resultado
                reward, game_over = simulator.apply_action(action)
                
                # Atualizar contadores
                steps += 1
                
                # Visualizar último jogo em tempo real
                if game == games - 1:
                    snake_mach.update_state(
                        agent_id=self.best_agent.id,
                        game_state=simulator.get_state(),
                        status="EM ANDAMENTO" if not game_over else "DERROTA"
                    )
                    time.sleep(0.05)
            
            # Registrar resultados deste jogo
            score = simulator.get_state()["score"]
            total_score += score
            total_steps += steps
            max_score = max(max_score, score)
            games_completed += 1
            
            print(f"Jogo {game+1}: Pontuação = {score}, Passos = {steps}")
        
        # Calcular estatísticas
        avg_score = total_score / games_completed if games_completed > 0 else 0
        avg_steps = total_steps / games_completed if games_completed > 0 else 0
        
        results = {
            "agent_id": self.best_agent.id,
            "games_played": games,
            "average_score": avg_score,
            "average_steps": avg_steps,
            "max_score": max_score
        }
        
        # Salvar resultados da avaliação
        eval_file = os.path.join(self.data_manager.session_dir, 'evaluation_results.json')
        with open(eval_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\nAvaliação concluída. Pontuação média: {avg_score:.2f}")
        return results


# Função auxiliar para criar e executar uma jornada completa
def start_training_journey(config=None):
    """
    Inicia uma jornada completa de treinamento com configurações opcionais.
    
    Args:
        config (dict, optional): Configurações personalizadas.
        
    Returns:
        dict: Resultados do treinamento.
    """
    journey = TrainingJourney(config)
    journey.setup()
    results = journey.run()
    evaluation = journey.evaluate_best_agent()
    
    # Combinar resultados
    results.update({"evaluation": evaluation})
    return results


if __name__ == "__main__":
    # Executar uma jornada com configurações padrão quando rodado diretamente
    results = start_training_journey()
    print("\nResultados finais:")
    print(f"Melhor agente ID: {results['best_agent'].id}")
    print(f"Melhor fitness: {results['best_fitness']:.2f}")
    print(f"Avaliação - Pontuação média: {results['evaluation']['average_score']:.2f}") 