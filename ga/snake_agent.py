import numpy as np
import webbrowser
import time
from .snake_nn import NeuralNetwork
from .snake_mach import snake_mach
from .snake_ga_data import save_game_data

class Agent:
    """
    Agente inteligente controlado por rede neural para jogar o jogo Snake.
    
    Esta classe representa um agente que joga através de uma rede neural controlada
    por seu genoma (conjunto de pesos). Ela gerencia o ciclo de vida completo do agente,
    incluindo inicialização, tomada de decisões, processamento de dados e avaliação.
    
    Attributes:
        id (str): Identificador único do agente
        generation (int): Geração à qual o agente pertence
        parent1_id (str): ID do primeiro pai (se aplicável)
        parent2_id (str): ID do segundo pai (se aplicável)
        fitness (float): Pontuação de aptidão calculada
        food_eaten (int): Quantidade de comida consumida
        moves_made (int): Número total de movimentos realizados
        survival_time (int): Tempo de sobrevivência (em passos)
        input_size (int): Tamanho da camada de entrada da rede neural
        hidden_size (int): Tamanho da camada oculta da rede neural
        output_size (int): Tamanho da camada de saída da rede neural
        genome (numpy.ndarray): Vetor de pesos da rede neural
        neural_network (NeuralNetwork): Instância da rede neural para tomada de decisões
    """
    
    def __init__(self, id=None, genome=None, input_size=24, hidden_size=16, output_size=4):
        """
        Inicializa um novo agente com configurações personalizáveis.
        
        Args:
            id (str, optional): Identificador único. Se não fornecido, será gerado aleatoriamente.
            genome (numpy.ndarray, optional): Vetor de pesos pré-existente.
            input_size (int, optional): Tamanho da camada de entrada. Padrão é 24.
            hidden_size (int, optional): Tamanho da camada oculta. Padrão é 16.
            output_size (int, optional): Tamanho da camada de saída. Padrão é 4.
        """
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
        """
        Determina a próxima ação com base no estado atual do jogo.
        
        O método processa o estado do jogo para extrair características relevantes,
        alimenta essas informações na rede neural e retorna a ação escolhida.
        
        Args:
            game_state (dict): Estado atual do jogo contendo informações como posição
                               da cobra, comida e obstáculos.
                               
        Returns:
            int: Índice da ação escolhida (0-3, representando direções).
        """
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
        
        Args:
            game_state (dict): Estado do jogo contendo informações sensoriais.
            
        Returns:
            numpy.ndarray: Vetor de 24 valores representando a entrada processada para a rede neural.
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
        """
        Atualiza a pontuação de aptidão do agente com base em seu desempenho.
        
        O fitness é calculado considerando três componentes:
        1. Comida consumida (principal objetivo)
        2. Eficiência energética (bônus por conservar energia)
        3. Tempo de sobrevivência (bônus por durar mais tempo)
        
        Args:
            food_eaten (int): Quantidade de comida consumida durante a partida.
            steps_taken (int): Número de passos realizados durante a partida.
            energy_left (float): Energia restante ao final da partida.
        """
        self.food_eaten = food_eaten
        self.moves_made = steps_taken
        self.survival_time = steps_taken

        food_fitness = food_eaten * 100
        efficiency_bonus = (energy_left / steps_taken) * 50 if steps_taken > 0 else 0
        survival_bonus = min(steps_taken / 100, 50)
        self.fitness = food_fitness + efficiency_bonus + survival_bonus

    def reset(self):
        """
        Reinicia as métricas de desempenho do agente para uma nova avaliação.
        
        Esta função é chamada antes do início de uma nova partida para garantir
        que as estatísticas da partida anterior não interfiram na avaliação atual.
        """
        self.fitness = 0
        self.food_eaten = 0
        self.moves_made = 0
        self.survival_time = 0
        
    # Implementação dos 5 passos dos agentes conforme AGENT_STEPS.md
    
    def start_game(self):
        """
        Inicia uma partida para este agente (Passo 1).
        
        Abre o jogo Snake em um navegador com o ID do agente como parâmetro,
        permitindo que o jogo identifique qual agente está jogando.
        
        Returns:
            bool: True se a partida foi iniciada com sucesso
        """
        game_url = f"game/snake_game.html?agent_id={self.id}"
        
        try:
            webbrowser.open(game_url)
            print(f"Partida iniciada para o agente {self.id}")
            return True
        except Exception as e:
            print(f"Erro ao iniciar partida: {e}")
            return False
    
    def transmit_state(self, game_state, status="EM ANDAMENTO"):
        """
        Transmite o estado atual do jogo para processamento em tempo real (Passo 2).
        
        Utiliza o módulo snake_mach para transmitir informações sobre o estado
        atual do jogo, permitindo visualização e análise em tempo real.
        
        Args:
            game_state (dict): Estado atual do jogo
            status (str): Status da partida ("EM ANDAMENTO", "VITORIA", "DERROTA")
            
        Returns:
            bool: True se a transmissão foi bem-sucedida
        """
        try:
            snake_mach.update_state(
                agent_id=self.id,
                game_state=game_state,
                status=status
            )
            return True
        except Exception as e:
            print(f"Erro na transmissão: {e}")
            return False
    
    def process_data(self, game_data):
        """
        Processa os dados coletados durante a partida (Passo 3).
        
        Extrai métricas significativas dos dados brutos e atualiza
        o fitness do agente com base nessas informações.
        
        Args:
            game_data (dict): Dados coletados durante a partida
            
        Returns:
            dict: Métricas processadas incluindo score, steps, energia restante
                 e padrões de movimento.
        """
        metrics = {
            "agent_id": self.id,
            "timestamp": time.time(),
            "score": game_data.get("score", 0),
            "steps": game_data.get("steps", 0),
            "energy_left": game_data.get("energy", 0),
            "movement_patterns": self._analyze_movement(game_data.get("snake_positions", [])),
            "collisions": game_data.get("collisions", 0)
        }
        
        # Atualiza próprio fitness com base nos dados da partida
        self.update_fitness(
            food_eaten=game_data.get("score", 0),
            steps_taken=game_data.get("steps", 0),
            energy_left=game_data.get("energy", 0)
        )
        
        return metrics
    
    def _analyze_movement(self, positions):
        """
        Analisa padrões de movimento com base nas posições registradas.
        
        Contabiliza a frequência de movimentos em cada direção para
        identificar possíveis padrões ou tendências no comportamento do agente.
        
        Args:
            positions (list): Lista de posições (x,y) da cobra ao longo do tempo
            
        Returns:
            dict: Dicionário com contagem de movimentos em cada direção ou
                 mensagem de dados insuficientes.
        """
        if not positions or len(positions) < 2:
            return {"pattern": "insufficient_data"}
            
        # Análise básica de direções
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
    
    def store_data(self, metrics):
        """
        Armazena os dados da partida para análise posterior (Passo 4).
        
        Utiliza a função save_game_data para persistir as métricas coletadas,
        permitindo análise histórica e comparações entre agentes.
        
        Args:
            metrics (dict): Métricas processadas da partida
            
        Returns:
            bool: True se os dados foram armazenados com sucesso
        """
        try:
            save_game_data(self.id, metrics)
            print(f"Dados da partida do agente {self.id} salvos com sucesso")
            return True
        except Exception as e:
            print(f"Erro ao salvar dados: {e}")
            return False
    
    def end_game(self, result):
        """
        Finaliza a partida e registra o resultado final (Passo 5).
        
        Gera um resumo da partida, libera recursos e encerra o processo,
        permitindo que o sistema continue com outros agentes ou gerações.
        
        Args:
            result (dict): Resultado final da partida
            
        Returns:
            dict: Resumo da partida finalizada incluindo ID, geração,
                 resultado, pontuação final e fitness.
        """
        # Registra o resultado final
        summary = {
            "agent_id": self.id,
            "generation": self.generation,
            "timestamp": time.time(),
            "result": result.get("status", "DESCONHECIDO"),
            "final_score": result.get("score", 0),
            "steps_taken": result.get("steps", 0),
            "fitness": self.fitness
        }
        
        # Libera recursos
        snake_mach.reset()
        print(f"Partida finalizada para o agente {self.id}")
        
        return summary
    
    def play_game(self, simulator, max_steps=1000):
        """
        Executa o fluxo completo de uma partida para este agente.
        
        Implementa o ciclo completo dos 5 passos definidos em AGENT_STEPS.md:
        1. Iniciar partida
        2. Transmitir estados
        3. Processar dados
        4. Armazenar dados
        5. Finalizar partida
        
        Args:
            simulator: Simulador do jogo que implementa a lógica do Snake
            max_steps (int): Número máximo de passos. Padrão é 1000.
            
        Returns:
            dict: Resumo da partida incluindo resultado, pontuação e fitness.
        """
        # Inicia a partida (Passo 1)
        self.start_game()
        
        # Prepara para registrar dados da partida
        game_data = {
            "score": 0,
            "steps": 0,
            "energy": 100,
            "snake_positions": [],
            "collisions": 0,
            "status": "EM ANDAMENTO"
        }
        
        # Reseta o simulador e o agente
        simulator.reset()
        self.reset()
        
        # Loop principal da partida
        for step in range(max_steps):
            # Obtém estado atual
            state = simulator.get_state()
            
            # Transmite estado atual (Passo 2)
            self.transmit_state(state)
            
            # Agente toma decisão
            action = self.decide_action(state)
            
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
                
        # Processa dados da partida (Passo 3)
        metrics = self.process_data(game_data)
        
        # Armazena dados (Passo 4)
        self.store_data(metrics)
        
        # Finaliza a partida (Passo 5)
        return self.end_game({
            "status": game_data["status"],
            "score": game_data["score"],
            "steps": game_data["steps"]
        })
