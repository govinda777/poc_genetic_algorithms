"""
Snake Game Genetic Algorithm Core

This module implements the core components of the genetic algorithm for training
neural networks to play the Snake game.

Components:
- Neural Network implementation
- Population management
- Selection, crossover, and mutation
- Fitness evaluation
"""

import numpy as np
import random
import math
import json

# Constants
INPUT_SIZE = 24  # 8 directions x 3 inputs (distance, food, danger)
HIDDEN_SIZE = 16
OUTPUT_SIZE = 4  # up, down, left, right

class NeuralNetwork:
    """
    Simple neural network with one hidden layer.
    The network takes sensor data as input and outputs action probabilities.
    """
    
    def __init__(self, weights=None):
        """
        Initialize the neural network with random weights or provided weights.
        
        Args:
            weights (list, optional): Flattened list of weights for the network.
                If None, random weights are generated.
        """
        if weights is None:
            # Initialize random weights
            self.weights_input_hidden = np.random.uniform(-1, 1, (INPUT_SIZE, HIDDEN_SIZE))
            self.bias_hidden = np.random.uniform(-1, 1, HIDDEN_SIZE)
            self.weights_hidden_output = np.random.uniform(-1, 1, (HIDDEN_SIZE, OUTPUT_SIZE))
            self.bias_output = np.random.uniform(-1, 1, OUTPUT_SIZE)
        else:
            # Reshape provided weights
            weights = np.array(weights)
            input_hidden_size = INPUT_SIZE * HIDDEN_SIZE
            hidden_bias_size = HIDDEN_SIZE
            hidden_output_size = HIDDEN_SIZE * OUTPUT_SIZE
            
            self.weights_input_hidden = weights[:input_hidden_size].reshape(INPUT_SIZE, HIDDEN_SIZE)
            self.bias_hidden = weights[input_hidden_size:input_hidden_size + hidden_bias_size]
            self.weights_hidden_output = weights[input_hidden_size + hidden_bias_size:input_hidden_size + hidden_bias_size + hidden_output_size].reshape(HIDDEN_SIZE, OUTPUT_SIZE)
            self.bias_output = weights[input_hidden_size + hidden_bias_size + hidden_output_size:]
    
    def get_weights_flat(self):
        """
        Get all weights as a flattened list.
        
        Returns:
            list: Flattened list of all weights.
        """
        return np.concatenate([
            self.weights_input_hidden.flatten(),
            self.bias_hidden.flatten(),
            self.weights_hidden_output.flatten(),
            self.bias_output.flatten()
        ])
    
    def get_total_weights(self):
        """
        Get the total number of weights in the network.
        
        Returns:
            int: Total number of weights.
        """
        return (INPUT_SIZE * HIDDEN_SIZE) + HIDDEN_SIZE + (HIDDEN_SIZE * OUTPUT_SIZE) + OUTPUT_SIZE
    
    def forward(self, inputs):
        """
        Forward pass through the network.
        
        Args:
            inputs (list): Input values from sensors.
            
        Returns:
            list: Output values (action probabilities).
        """
        # Hidden layer
        hidden = np.dot(inputs, self.weights_input_hidden) + self.bias_hidden
        hidden = self.relu(hidden)
        
        # Output layer
        output = np.dot(hidden, self.weights_hidden_output) + self.bias_output
        output = self.softmax(output)
        
        return output
    
    def predict(self, inputs):
        """
        Predict the best action based on inputs.
        
        Args:
            inputs (list): Input values from sensors.
            
        Returns:
            int: Index of the best action.
        """
        outputs = self.forward(inputs)
        return np.argmax(outputs)
    
    @staticmethod
    def relu(x):
        """ReLU activation function."""
        return np.maximum(0, x)
    
    @staticmethod
    def softmax(x):
        """Softmax activation function."""
        e_x = np.exp(x - np.max(x))
        return e_x / e_x.sum()


class Agent:
    """
    Agent that uses a neural network to play the Snake game.
    """
    
    def __init__(self, neural_network=None):
        """
        Initialize the agent with a neural network.
        
        Args:
            neural_network (NeuralNetwork, optional): Neural network for the agent.
                If None, a new network is created.
        """
        self.neural_network = neural_network if neural_network else NeuralNetwork()
        self.fitness = 0
        self.food_eaten = 0
        self.steps_taken = 0
        self.max_steps_without_food = 100
        self.steps_without_food = 0
        self.alive = True
    
    def get_action(self, state):
        """
        Get the next action based on the current state.
        
        Args:
            state (dict): Current state of the game.
            
        Returns:
            str: Action to take ('up', 'down', 'left', 'right').
        """
        # Process state into inputs for neural network
        inputs = self.process_state(state)
        
        # Get action from neural network
        action_idx = self.neural_network.predict(inputs)
        
        # Convert action index to action string
        actions = ['up', 'down', 'left', 'right']
        return actions[action_idx]
    
    def process_state(self, state):
        """
        Process the game state into inputs for the neural network.
        
        Args:
            state (dict): Current state of the game.
            
        Returns:
            list: Processed inputs for the neural network.
        """
        sensors = state['sensors']
        vision = sensors['vision']
        
        # Normalize inputs
        inputs = []
        
        # For each of the 8 directions
        for i in range(8):
            # Distance to obstacle (normalized)
            distance = vision[i]['distance'] / 25.0  # Normalize by grid size
            inputs.append(distance)
            
            # Food in this direction
            inputs.append(1.0 if vision[i]['foundFood'] else 0.0)
            
            # Danger in this direction (inverse of distance if very close)
            danger = 1.0 if distance < 0.2 else 0.0
            inputs.append(danger)
        
        return np.array(inputs)
    
    def update_fitness(self, food_eaten, steps_taken, energy_left):
        """
        Update the fitness of the agent.
        
        Args:
            food_eaten (int): Number of food items eaten.
            steps_taken (int): Number of steps taken.
            energy_left (int): Energy left at the end of the game.
        """
        # Update agent stats
        self.food_eaten = food_eaten
        self.steps_taken = steps_taken
        
        # Calculate fitness
        # Base fitness on food eaten (major component)
        food_fitness = food_eaten * 100
        
        # Bonus for energy efficiency
        efficiency = energy_left / steps_taken if steps_taken > 0 else 0
        efficiency_bonus = efficiency * 50
        
        # Bonus for surviving longer
        survival_bonus = min(steps_taken / 100, 50)
        
        # Combine components
        self.fitness = food_fitness + efficiency_bonus + survival_bonus
    
    def reset(self):
        """Reset the agent for a new game."""
        self.fitness = 0
        self.food_eaten = 0
        self.steps_taken = 0
        self.steps_without_food = 0
        self.alive = True


class GeneticAlgorithm:
    """
    Genetic algorithm for evolving neural networks to play the Snake game.
    """
    
    def __init__(self, population_size=100, mutation_rate=0.1, crossover_rate=0.7, elitism=0.1):
        """
        Initialize the genetic algorithm.
        
        Args:
            population_size (int): Size of the population.
            mutation_rate (float): Probability of mutation.
            crossover_rate (float): Probability of crossover.
            elitism (float): Proportion of top performers to keep unchanged.
        """
        self.population_size = population_size
        self.mutation_rate = mutation_rate
        self.crossover_rate = crossover_rate
        self.elitism = elitism
        self.population = []
        self.generation = 0
        self.best_fitness = 0
        self.best_agent = None
        
        # Initialize population
        self.initialize_population()
    
    def initialize_population(self):
        """Initialize the population with random agents."""
        self.population = [Agent() for _ in range(self.population_size)]
    
    def evolve(self):
        """
        Evolve the population to the next generation.
        
        Returns:
            list: New population of agents.
        """
        # Sort population by fitness (descending)
        self.population.sort(key=lambda agent: agent.fitness, reverse=True)
        
        # Update best agent
        if self.population[0].fitness > self.best_fitness:
            self.best_fitness = self.population[0].fitness
            self.best_agent = self.population[0]
        
        # Calculate diversity
        diversity = self.calculate_diversity()
        
        # Create new population
        new_population = []
        
        # Elitism: Keep top performers
        elitism_count = int(self.population_size * self.elitism)
        for i in range(elitism_count):
            new_population.append(Agent(NeuralNetwork(self.population[i].neural_network.get_weights_flat())))
        
        # Fill the rest of the population with offspring
        while len(new_population) < self.population_size:
            # Select parents
            parent1 = self.select_parent()
            parent2 = self.select_parent()
            
            # Crossover
            if random.random() < self.crossover_rate:
                child_weights = self.crossover(
                    parent1.neural_network.get_weights_flat(),
                    parent2.neural_network.get_weights_flat()
                )
            else:
                # No crossover, just copy parent1
                child_weights = parent1.neural_network.get_weights_flat().copy()
            
            # Mutation
            child_weights = self.mutate(child_weights)
            
            # Create new agent with child weights
            new_population.append(Agent(NeuralNetwork(child_weights)))
        
        # Update population and generation
        self.population = new_population
        self.generation += 1
        
        return {
            'population': self.population,
            'generation': self.generation,
            'best_fitness': self.best_fitness,
            'diversity': diversity
        }
    
    def select_parent(self):
        """
        Select a parent using tournament selection.
        
        Returns:
            Agent: Selected parent.
        """
        # Tournament selection
        tournament_size = 5
        tournament = random.sample(self.population, tournament_size)
        tournament.sort(key=lambda agent: agent.fitness, reverse=True)
        return tournament[0]
    
    def crossover(self, weights1, weights2):
        """
        Perform crossover between two sets of weights.
        
        Args:
            weights1 (list): First set of weights.
            weights2 (list): Second set of weights.
            
        Returns:
            list: New set of weights after crossover.
        """
        # Single-point crossover
        crossover_point = random.randint(0, len(weights1) - 1)
        child_weights = np.concatenate([weights1[:crossover_point], weights2[crossover_point:]])
        return child_weights
    
    def mutate(self, weights):
        """
        Mutate weights.
        
        Args:
            weights (list): Weights to mutate.
            
        Returns:
            list: Mutated weights.
        """
        # Gaussian mutation
        for i in range(len(weights)):
            if random.random() < self.mutation_rate:
                weights[i] += random.gauss(0, 0.2)
                # Clip weights to [-1, 1]
                weights[i] = max(-1, min(1, weights[i]))
        return weights
    
    def calculate_diversity(self):
        """
        Calculate the diversity of the population.
        
        Returns:
            float: Diversity measure (0-1).
        """
        if not self.population:
            return 0
        
        # Calculate average distance between all pairs of agents
        total_distance = 0
        count = 0
        
        for i in range(len(self.population)):
            for j in range(i + 1, len(self.population)):
                weights1 = self.population[i].neural_network.get_weights_flat()
                weights2 = self.population[j].neural_network.get_weights_flat()
                
                # Euclidean distance
                distance = np.sqrt(np.sum((weights1 - weights2) ** 2))
                
                # Normalize by number of weights
                distance /= len(weights1)
                
                total_distance += distance
                count += 1
        
        # Average distance
        avg_distance = total_distance / count if count > 0 else 0
        
        # Normalize to [0, 1]
        diversity = min(1.0, avg_distance / 2.0)
        
        return diversity
    
    def save_best_agent(self, filename):
        """
        Save the best agent to a file.
        
        Args:
            filename (str): Filename to save to.
        """
        if self.best_agent is None:
            return
        
        data = {
            'weights': self.best_agent.neural_network.get_weights_flat().tolist(),
            'fitness': self.best_agent.fitness,
            'food_eaten': self.best_agent.food_eaten,
            'steps_taken': self.best_agent.steps_taken,
            'generation': self.generation
        }
        
        with open(filename, 'w') as f:
            json.dump(data, f)
    
    def load_agent(self, filename):
        """
        Load an agent from a file.
        
        Args:
            filename (str): Filename to load from.
            
        Returns:
            Agent: Loaded agent.
        """
        with open(filename, 'r') as f:
            data = json.load(f)
        
        agent = Agent(NeuralNetwork(data['weights']))
        agent.fitness = data['fitness']
        agent.food_eaten = data['food_eaten']
        agent.steps_taken = data['steps_taken']
        
        return agent