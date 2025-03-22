"""
Snake Game Genetic Algorithm Training

This module implements the training loop for the genetic algorithm.
It simulates games for each agent in the population, evaluates their performance,
and evolves the population over multiple generations.
"""

import sys
import os
import time
import json
import argparse
import numpy as np
from snake_ga import GeneticAlgorithm, Agent, NeuralNetwork
from snake_ga_data import TrainingData

# Constants
DEFAULT_POPULATION_SIZE = 100
DEFAULT_GENERATIONS = 1000
DEFAULT_MUTATION_RATE = 0.1
DEFAULT_CROSSOVER_RATE = 0.7
DEFAULT_ELITISM = 0.1
DEFAULT_GAMES_PER_AGENT = 3
DEFAULT_MAX_STEPS = 1000
DEFAULT_INITIAL_ENERGY = 100
DEFAULT_GRID_SIZE = 25

class SnakeGameSimulator:
    """
    Simulator for the Snake game.
    This class simulates the Snake game for training the genetic algorithm.
    """
    
    def __init__(self, grid_size=DEFAULT_GRID_SIZE, initial_energy=DEFAULT_INITIAL_ENERGY):
        """
        Initialize the simulator.
        
        Args:
            grid_size (int): Size of the grid.
            initial_energy (int): Initial energy of the snake.
        """
        self.grid_size = grid_size
        self.initial_energy = initial_energy
        self.reset()
    
    def reset(self):
        """Reset the game state."""
        # Initialize snake at the center of the grid
        self.snake = []
        center = self.grid_size // 2
        for i in range(3):
            self.snake.append({'x': center - i, 'y': center})
        
        # Initialize direction
        self.direction = {'x': 1, 'y': 0}  # Moving right
        
        # Initialize food
        self.generate_food()
        
        # Initialize game state
        self.score = 0
        self.steps = 0
        self.energy = self.initial_energy
        self.game_over = False
    
    def generate_food(self):
        """Generate food at a random position."""
        while True:
            food_x = np.random.randint(0, self.grid_size)
            food_y = np.random.randint(0, self.grid_size)
            
            # Check if food is on snake
            on_snake = False
            for segment in self.snake:
                if segment['x'] == food_x and segment['y'] == food_y:
                    on_snake = True
                    break
            
            if not on_snake:
                self.food = {'x': food_x, 'y': food_y}
                break
    
    def get_state(self):
        """
        Get the current state of the game.
        
        Returns:
            dict: Game state.
        """
        head = self.snake[0]
        
        # Calculate vision in 8 directions
        vision = self.calculate_vision()
        
        # Calculate food direction and distance
        food_dx = self.food['x'] - head['x']
        food_dy = self.food['y'] - head['y']
        food_distance = np.sqrt(food_dx**2 + food_dy**2)
        food_angle = np.arctan2(food_dy, food_dx)
        
        # Check danger in each direction
        danger = {
            'up': self.check_collision({'x': head['x'], 'y': head['y'] - 1}),
            'down': self.check_collision({'x': head['x'], 'y': head['y'] + 1}),
            'left': self.check_collision({'x': head['x'] - 1, 'y': head['y']}),
            'right': self.check_collision({'x': head['x'] + 1, 'y': head['y']})
        }
        
        # Create state dictionary
        state = {
            'snake': self.snake.copy(),
            'food': self.food.copy(),
            'direction': self.direction.copy(),
            'energy': self.energy,
            'score': self.score,
            'sensors': {
                'vision': vision,
                'foodDistance': {
                    'x': food_dx,
                    'y': food_dy,
                    'euclidean': food_distance
                },
                'foodAngle': food_angle,
                'danger': danger
            }
        }
        
        return state
    
    def calculate_vision(self):
        """
        Calculate vision in 8 directions.
        
        Returns:
            list: Vision data for 8 directions.
        """
        head = self.snake[0]
        directions = [
            {'x': 0, 'y': -1},  # Up
            {'x': 1, 'y': -1},  # Up-Right
            {'x': 1, 'y': 0},   # Right
            {'x': 1, 'y': 1},   # Down-Right
            {'x': 0, 'y': 1},   # Down
            {'x': -1, 'y': 1},  # Down-Left
            {'x': -1, 'y': 0},  # Left
            {'x': -1, 'y': -1}  # Up-Left
        ]
        
        vision = []
        
        for direction in directions:
            x, y = head['x'], head['y']
            distance = 0
            found_food = False
            
            while True:
                x += direction['x']
                y += direction['y']
                distance += 1
                
                # Check if out of bounds
                if x < 0 or x >= self.grid_size or y < 0 or y >= self.grid_size:
                    break
                
                # Check if hit snake
                hit_snake = False
                for segment in self.snake:
                    if segment['x'] == x and segment['y'] == y:
                        hit_snake = True
                        break
                
                if hit_snake:
                    break
                
                # Check if found food
                if self.food['x'] == x and self.food['y'] == y:
                    found_food = True
            
            vision.append({
                'distance': distance,
                'foundFood': found_food
            })
        
        return vision
    
    def check_collision(self, position):
        """
        Check if a position collides with walls or snake body.
        
        Args:
            position (dict): Position to check.
            
        Returns:
            bool: True if collision, False otherwise.
        """
        # Check wall collision
        if (position['x'] < 0 or position['x'] >= self.grid_size or
                position['y'] < 0 or position['y'] >= self.grid_size):
            return True
        
        # Check self collision (skip the tail as it will move)
        for i in range(len(self.snake) - 1):
            if position['x'] == self.snake[i]['x'] and position['y'] == self.snake[i]['y']:
                return True
        
        return False
    
    def apply_action(self, action):
        """
        Apply an action to the snake.
        
        Args:
            action (str): Action to apply ('up', 'down', 'left', 'right').
        """
        # Convert action to direction
        if action == 'up' and self.direction['y'] != 1:
            self.direction = {'x': 0, 'y': -1}
        elif action == 'down' and self.direction['y'] != -1:
            self.direction = {'x': 0, 'y': 1}
        elif action == 'left' and self.direction['x'] != 1:
            self.direction = {'x': -1, 'y': 0}
        elif action == 'right' and self.direction['x'] != -1:
            self.direction = {'x': 1, 'y': 0}
    
    def step(self):
        """
        Advance the game by one step.
        
        Returns:
            bool: True if game over, False otherwise.
        """
        if self.game_over:
            return True
        
        # Calculate new head position
        head = self.snake[0]
        new_head = {
            'x': head['x'] + self.direction['x'],
            'y': head['y'] + self.direction['y']
        }
        
        # Check for collisions
        if self.check_collision(new_head):
            self.game_over = True
            return True
        
        # Add new head
        self.snake.insert(0, new_head)
        
        # Check if snake ate food
        if new_head['x'] == self.food['x'] and new_head['y'] == self.food['y']:
            self.score += 1
            self.energy += 50  # Energy boost from food
            self.generate_food()
        else:
            # Remove tail if no food was eaten
            self.snake.pop()
            
            # Decrease energy
            self.energy -= 1
            if self.energy <= 0:
                self.game_over = True
                return True
        
        # Increment steps
        self.steps += 1
        
        return False


def train_agent(agent, simulator, max_steps=DEFAULT_MAX_STEPS, games=DEFAULT_GAMES_PER_AGENT):
    """
    Train an agent by simulating multiple games.
    
    Args:
        agent (Agent): Agent to train.
        simulator (SnakeGameSimulator): Game simulator.
        max_steps (int): Maximum steps per game.
        games (int): Number of games to simulate.
        
    Returns:
        Agent: Trained agent with updated fitness.
    """
    total_food = 0
    total_steps = 0
    total_energy = 0
    
    for game_index in range(games):
        # Reset simulator and agent
        simulator.reset()
        agent.reset()
        
        # Play game
        for _ in range(max_steps):
            # Get state
            state = simulator.get_state()
            
            # Get action from agent
            action = agent.get_action(state)
            
            # Apply action
            simulator.apply_action(action)
            
            # Step simulator
            game_over = simulator.step()
            
            if game_over:
                break
        
        print(f"Game {game_index + 1}/{games}: Score = {simulator.score}, Steps = {simulator.steps}, Energy = {simulator.energy}")
        # Update totals
        total_food += simulator.score
        total_steps += simulator.steps
        total_energy += simulator.energy
    
    # Calculate average performance
    avg_food = total_food / games
    avg_steps = total_steps / games
    avg_energy = total_energy / games
    
    # Update agent fitness
    agent.update_fitness(avg_food, avg_steps, avg_energy)
    
    return agent


def train_population(ga, simulator, max_steps=DEFAULT_MAX_STEPS, games=DEFAULT_GAMES_PER_AGENT):
    """
    Train all agents in the population.
    
    Args:
        ga (GeneticAlgorithm): Genetic algorithm instance.
        simulator (SnakeGameSimulator): Game simulator.
        max_steps (int): Maximum steps per game.
        games (int): Number of games to simulate.
        
    Returns:
        list: Trained population.
    """
    for i, agent in enumerate(ga.population):
        train_agent(agent, simulator, max_steps, games)
        
        # Print progress
        if (i + 1) % 10 == 0:
            print(f"Trained {i + 1}/{len(ga.population)} agents")
    
    return ga.population


def main():
    """Main function for training the genetic algorithm."""
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Train a genetic algorithm to play Snake')
    parser.add_argument('--population', type=int, default=DEFAULT_POPULATION_SIZE,
                        help='Population size')
    parser.add_argument('--generations', type=int, default=DEFAULT_GENERATIONS,
                        help='Number of generations')
    parser.add_argument('--mutation', type=float, default=DEFAULT_MUTATION_RATE,
                        help='Mutation rate')
    parser.add_argument('--crossover', type=float, default=DEFAULT_CROSSOVER_RATE,
                        help='Crossover rate')
    parser.add_argument('--elitism', type=float, default=DEFAULT_ELITISM,
                        help='Elitism rate')
    parser.add_argument('--games', type=int, default=DEFAULT_GAMES_PER_AGENT,
                        help='Games per agent')
    parser.add_argument('--steps', type=int, default=DEFAULT_MAX_STEPS,
                        help='Maximum steps per game')
    parser.add_argument('--grid', type=int, default=DEFAULT_GRID_SIZE,
                        help='Grid size')
    parser.add_argument('--energy', type=int, default=DEFAULT_INITIAL_ENERGY,
                        help='Initial energy')
    parser.add_argument('--load', type=str, default=None,
                        help='Load population from file')
    parser.add_argument('--save', type=str, default=None,
                        help='Save best agent to file')
    
    args = parser.parse_args()
    
    # Create data directory if it doesn't exist
    os.makedirs('../data', exist_ok=True)
    
    # Initialize training data manager
    training_data = TrainingData()
    
    # Initialize simulator
    simulator = SnakeGameSimulator(args.grid, args.energy)
    
    # Initialize genetic algorithm
    ga = GeneticAlgorithm(
        population_size=args.population,
        mutation_rate=args.mutation,
        crossover_rate=args.crossover,
        elitism=args.elitism
    )
    
    # Load population if specified
    if args.load:
        print(f"Loading population from {args.load}")
        # TODO: Implement loading population
    
    # Training loop
    print(f"Starting training with population size {args.population} for {args.generations} generations")
    print(f"Mutation rate: {args.mutation}, Crossover rate: {args.crossover}, Elitism: {args.elitism}")
    print(f"Games per agent: {args.games}, Max steps per game: {args.steps}")
    print(f"Grid size: {args.grid}, Initial energy: {args.energy}")
    
    start_time = time.time()
    
    for generation in range(args.generations):
        gen_start_time = time.time()
        
        print(f"\nGeneration {generation + 1}/{args.generations}")
        
        # Train population
        train_population(ga, simulator, args.steps, args.games)
        
        # Record data before evolution
        ga.population.sort(key=lambda agent: agent.fitness, reverse=True)
        best_agent = ga.population[0]
        
        print(f"Best fitness: {best_agent.fitness:.2f}")
        print(f"Best food eaten: {best_agent.food_eaten:.2f}")
        print(f"Best steps taken: {best_agent.steps_taken:.2f}")
        
        # Evolve population
        result = ga.evolve()
        
        # Record generation data
        training_data.record_generation(
            generation=generation,
            population=ga.population,
            best_fitness=result['best_fitness'],
            diversity=result['diversity']
        )
        
        # Save best agent periodically
        if args.save and (generation + 1) % 10 == 0:
            save_path = f"{args.save}_gen{generation + 1}.json"
            ga.save_best_agent(save_path)
            print(f"Saved best agent to {save_path}")
        
        # Print generation stats
        gen_time = time.time() - gen_start_time
        print(f"Generation time: {gen_time:.2f}s")
        print(f"Diversity: {result['diversity']:.2f}")
        
        # Save training data periodically
        if (generation + 1) % 10 == 0:
            training_data.save_training_data()
            print("Saved training data")
    
    # Save final training data
    training_data.save_training_data()
    
    # Save final best agent
    if args.save:
        save_path = f"{args.save}_final.json"
        ga.save_best_agent(save_path)
        print(f"Saved final best agent to {save_path}")
    
    # Save training session
    session_file = training_data.save_training_session()
    print(f"Saved training session to {session_file}")
    
    # Print final stats
    total_time = time.time() - start_time
    hours, remainder = divmod(total_time, 3600)
    minutes, seconds = divmod(remainder, 60)
    
    print(f"\nTraining completed in {int(hours)}h {int(minutes)}m {int(seconds)}s")
    print(f"Best fitness: {ga.best_fitness:.2f}")
    print(f"Best food eaten: {ga.best_agent.food_eaten:.2f}")
    print(f"Best steps taken: {ga.best_agent.steps_taken:.2f}")


if __name__ == "__main__":
    main()