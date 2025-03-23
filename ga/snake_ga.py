import numpy as np
import random
import json
from .snake_agent import Agent
from .snake_nn import NeuralNetwork

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
               
