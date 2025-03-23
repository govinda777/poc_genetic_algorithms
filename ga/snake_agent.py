import numpy as np
from .snake_nn import NeuralNetwork

class Agent:
    def __init__(self, id=None, genome=None, input_size=24, hidden_size=16, output_size=4):
        self.id = id or f"agent_{np.random.randint(10000)}"
        self.generation = 0
        self.parent1_id = None
        self.parent2_id = None

        self.fitness = 0
        self.food_eaten = 0
        self.moves_made = 0
        self.survival_time = 0

        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size

        total_weights = (input_size * hidden_size) + hidden_size + (hidden_size * output_size) + output_size
        self.genome = genome if genome is not None else np.random.uniform(-1, 1, total_weights)

        self.neural_network = NeuralNetwork(input_size, hidden_size, output_size, self.genome)

    def decide_action(self, game_state):
        inputs = self._process_game_state(game_state)
        outputs = self.neural_network.forward(inputs)
        return np.argmax(outputs)

    def _process_game_state(self, game_state):
        """
        Converte os dados de sensores do estado do jogo em um vetor de entrada para a rede neural.
        
        A entrada é composta por 8 direções (N, NE, E, SE, S, SW, W, NW), e para cada direção coletamos:
        - Distância até o obstáculo mais próximo (normalizada pela largura da grade)
        - Informação binária se há comida visível nessa direção
        - Informação binária se existe perigo iminente (muito próximo de uma parede ou corpo da cobra)

        Totalizando 8 direções × 3 variáveis = 24 entradas.
        """
        inputs = np.zeros(24)
        if 'sensors' in game_state and 'vision' in game_state['sensors']:
            vision = game_state['sensors']['vision']
            for i in range(8):
                dist = vision[i]['distance'] / 25.0  # Normaliza distância para [0, 1]
                inputs[i*3 + 0] = dist
                inputs[i*3 + 1] = 1.0 if vision[i]['foundFood'] else 0.0
                inputs[i*3 + 2] = 1.0 if dist < 0.2 else 0.0  # Perigo se muito próximo de obstáculo
        return inputs

    def update_fitness(self, food_eaten, steps_taken, energy_left):
        self.food_eaten = food_eaten
        self.moves_made = steps_taken
        self.survival_time = steps_taken

        food_fitness = food_eaten * 100
        efficiency_bonus = (energy_left / steps_taken) * 50 if steps_taken > 0 else 0
        survival_bonus = min(steps_taken / 100, 50)
        self.fitness = food_fitness + efficiency_bonus + survival_bonus

    def reset(self):
        self.fitness = 0
        self.food_eaten = 0
        self.moves_made = 0
        self.survival_time = 0
