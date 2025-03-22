"""
Snake Game Genetic Algorithm Data Management

This module handles data collection, storage, and export for the genetic algorithm
training process. It tracks metrics like fitness, diversity, and snake size over
generations and provides functions to save this data for visualization in the dashboard.
"""

import json
import os
import csv
import time
from datetime import datetime

class TrainingData:
    """
    Class for collecting and managing training data.
    """
    
    def __init__(self, data_dir='../data'):
        """
        Initialize the training data manager.
        
        Args:
            data_dir (str): Directory to save data files.
        """
        self.data_dir = data_dir
        self.session_id = datetime.now().strftime('%Y%m%d_%H%M%S')
        self.session_dir = os.path.join(data_dir, f'session_{self.session_id}')
        
        # Create data directory if it doesn't exist
        os.makedirs(self.session_dir, exist_ok=True)
        
        # Initialize data structures
        self.generation_data = []
        self.best_agents = []
        self.start_time = time.time()
    
    def record_generation(self, generation, population, best_fitness, diversity):
        """
        Record data for a generation.
        
        Args:
            generation (int): Generation number.
            population (list): List of agents in the population.
            best_fitness (float): Fitness of the best agent.
            diversity (float): Diversity measure of the population.
        """
        # Sort population by fitness
        sorted_population = sorted(population, key=lambda agent: agent.fitness, reverse=True)
        
        # Get best agent
        best_agent = sorted_population[0]
        
        # Calculate average fitness
        avg_fitness = sum(agent.fitness for agent in population) / len(population)
        
        # Calculate max snake size
        max_size = max(agent.food_eaten + 3 for agent in population)  # +3 for initial size
        
        # Calculate average snake size
        avg_size = sum(agent.food_eaten + 3 for agent in population) / len(population)
        
        # Count alive agents
        alive_agents = sum(1 for agent in population if agent.alive)
        
        # Calculate training time
        training_time = time.time() - self.start_time
        
        # Create generation data record
        gen_data = {
            'generation': generation,
            'best_fitness': best_fitness,
            'avg_fitness': avg_fitness,
            'max_size': max_size,
            'avg_size': avg_size,
            'diversity': diversity,
            'alive_agents': alive_agents,
            'training_time': training_time
        }
        
        # Add to generation data list
        self.generation_data.append(gen_data)
        
        # Save best agent of this generation
        self.best_agents.append({
            'generation': generation,
            'fitness': best_agent.fitness,
            'food_eaten': best_agent.food_eaten,
            'steps_taken': best_agent.steps_taken,
            'weights': best_agent.neural_network.get_weights_flat().tolist()
        })
        
        # Save data periodically
        if generation % 10 == 0:
            self.save_training_data()
    
    def save_training_data(self):
        """
        Save all training data to files.
        """
        # Save generation data as JSON
        gen_data_file = os.path.join(self.session_dir, 'generation_data.json')
        with open(gen_data_file, 'w') as f:
            json.dump(self.generation_data, f, indent=2)
        
        # Save generation data as CSV
        gen_csv_file = os.path.join(self.session_dir, 'generation_data.csv')
        with open(gen_csv_file, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=self.generation_data[0].keys() if self.generation_data else [])
            writer.writeheader()
            writer.writerows(self.generation_data)
        
        # Save best agents
        best_agents_file = os.path.join(self.session_dir, 'best_agents.json')
        with open(best_agents_file, 'w') as f:
            json.dump(self.best_agents, f, indent=2)
        
        # Save latest best agent separately
        if self.best_agents:
            latest_best = self.best_agents[-1]
            latest_best_file = os.path.join(self.session_dir, 'latest_best_agent.json')
            with open(latest_best_file, 'w') as f:
                json.dump(latest_best, f, indent=2)
    
    def save_training_session(self):
        """
        Save a summary of the training session.
        
        Returns:
            str: Path to the session summary file.
        """
        # Calculate session duration
        duration = time.time() - self.start_time
        hours, remainder = divmod(duration, 3600)
        minutes, seconds = divmod(remainder, 60)
        duration_str = f"{int(hours)}h {int(minutes)}m {int(seconds)}s"
        
        # Get final generation
        final_gen = self.generation_data[-1]['generation'] if self.generation_data else 0
        
        # Get best fitness achieved
        best_fitness = max(gen['best_fitness'] for gen in self.generation_data) if self.generation_data else 0
        
        # Get max snake size achieved
        max_size = max(gen['max_size'] for gen in self.generation_data) if self.generation_data else 3
        
        # Create session summary
        session_summary = {
            'session_id': self.session_id,
            'start_time': datetime.fromtimestamp(self.start_time).strftime('%Y-%m-%d %H:%M:%S'),
            'duration': duration_str,
            'generations': final_gen,
            'best_fitness': best_fitness,
            'max_snake_size': max_size
        }
        
        # Save session summary
        summary_file = os.path.join(self.data_dir, 'sessions.json')
        
        # Load existing sessions if file exists
        sessions = []
        if os.path.exists(summary_file):
            try:
                with open(summary_file, 'r') as f:
                    sessions = json.load(f)
            except json.JSONDecodeError:
                sessions = []
        
        # Add current session
        sessions.append(session_summary)
        
        # Save updated sessions
        with open(summary_file, 'w') as f:
            json.dump(sessions, f, indent=2)
        
        return summary_file
    
    def export_for_dashboard(self):
        """
        Export data in a format suitable for the dashboard.
        
        Returns:
            dict: Data for dashboard visualization.
        """
        # Extract data for charts
        generations = [gen['generation'] for gen in self.generation_data]
        best_fitness = [gen['best_fitness'] for gen in self.generation_data]
        avg_fitness = [gen['avg_fitness'] for gen in self.generation_data]
        diversity = [gen['diversity'] for gen in self.generation_data]
        max_size = [gen['max_size'] for gen in self.generation_data]
        
        # Get latest generation data
        latest_gen = self.generation_data[-1] if self.generation_data else {
            'generation': 0,
            'best_fitness': 0,
            'avg_fitness': 0,
            'max_size': 3,
            'avg_size': 3,
            'diversity': 0,
            'alive_agents': 0,
            'training_time': 0
        }
        
        # Format training time
        hours, remainder = divmod(latest_gen['training_time'], 3600)
        minutes, seconds = divmod(remainder, 60)
        training_time_str = f"{int(hours)}h {int(minutes)}m {int(seconds)}s"
        
        # Create dashboard data
        dashboard_data = {
            'session_id': self.session_id,
            'current': {
                'generation': latest_gen['generation'],
                'best_fitness': latest_gen['best_fitness'],
                'avg_fitness': latest_gen['avg_fitness'],
                'max_size': latest_gen['max_size'],
                'diversity': latest_gen['diversity'],
                'alive_agents': latest_gen['alive_agents'],
                'training_time': training_time_str
            },
            'charts': {
                'generations': generations,
                'best_fitness': best_fitness,
                'avg_fitness': avg_fitness,
                'diversity': diversity,
                'max_size': max_size
            },
            'best_agent': self.best_agents[-1] if self.best_agents else None
        }
        
        # Save dashboard data
        dashboard_file = os.path.join(self.session_dir, 'dashboard_data.json')
        with open(dashboard_file, 'w') as f:
            json.dump(dashboard_data, f, indent=2)
        
        return dashboard_data


def load_training_session(session_id, data_dir='../data'):
    """
    Load a training session.
    
    Args:
        session_id (str): ID of the session to load.
        data_dir (str): Directory containing data files.
        
    Returns:
        dict: Dashboard data for the session.
    """
    session_dir = os.path.join(data_dir, f'session_{session_id}')
    dashboard_file = os.path.join(session_dir, 'dashboard_data.json')
    
    if os.path.exists(dashboard_file):
        with open(dashboard_file, 'r') as f:
            return json.load(f)
    
    return None


def list_training_sessions(data_dir='../data'):
    """
    List all training sessions.
    
    Args:
        data_dir (str): Directory containing data files.
        
    Returns:
        list: List of session summaries.
    """
    summary_file = os.path.join(data_dir, 'sessions.json')
    
    if os.path.exists(summary_file):
        with open(summary_file, 'r') as f:
            return json.load(f)
    
    return []