"""
Journey Visualizer

Este módulo implementa a visualização da jornada de treinamento,
permitindo acompanhar em tempo real ou reproduzir partidas passadas.
"""

import time
import json
import os
import numpy as np
from .snake_mach import snake_mach
from .snake_ga_training import SnakeGameSimulator

class JourneyVisualizer:
    """
    Responsável pela visualização da jornada de treinamento.
    Permite visualizar em tempo real ou reproduzir partidas salvas.
    """
    
    def __init__(self, grid_size=25, replay_speed=1.0):
        """
        Inicializa o visualizador de jornada.
        
        Args:
            grid_size (int): Tamanho da grade do ambiente.
            replay_speed (float): Velocidade de reprodução (1.0 = velocidade normal).
        """
        self.grid_size = grid_size
        self.replay_speed = replay_speed
        self.simulator = SnakeGameSimulator(grid_size=grid_size)
        
    def visualize_agent(self, agent, max_steps=1000, delay=0.1):
        """
        Visualiza o desempenho de um agente em tempo real.
        
        Args:
            agent: O agente a ser visualizado.
            max_steps (int): Número máximo de passos a simular.
            delay (float): Atraso entre passos (segundos).
            
        Returns:
            dict: Estatísticas da partida.
        """
        print(f"Visualizando agente {agent.id}...")
        self.simulator.reset()
        
        # Estatísticas da partida
        steps = 0
        game_over = False
        
        # Transmitir estado inicial
        snake_mach.update_state(
            agent_id=agent.id,
            game_state=self.simulator.get_state()
        )
        
        # Loop principal da partida
        while not game_over and steps < max_steps:
            # Obter estado e decisão do agente
            state = self.simulator.get_state()
            action = agent.decide_action(state)
            
            # Aplicar ação
            reward, game_over = self.simulator.apply_action(action)
            
            # Atualizar contadores
            steps += 1
            
            # Transmitir estado atual
            status = "EM ANDAMENTO"
            if game_over:
                status = "DERROTA"
            elif state["score"] > 50:  # Exemplo de condição de vitória
                status = "VITORIA"
                
            snake_mach.update_state(
                agent_id=agent.id,
                game_state=self.simulator.get_state(),
                status=status
            )
            
            # Pausa para visualização
            time.sleep(delay)
        
        # Calcular estatísticas finais
        final_state = self.simulator.get_state()
        stats = {
            "agent_id": agent.id,
            "steps": steps,
            "score": final_state["score"],
            "energy": final_state["energy"],
            "game_over": game_over
        }
        
        print(f"Partida concluída. Pontuação: {stats['score']}, Passos: {stats['steps']}")
        return stats
        
    def replay_match(self, match_file, delay=0.1):
        """
        Reproduz uma partida salva anteriormente.
        
        Args:
            match_file (str): Caminho para o arquivo da partida.
            delay (float): Atraso entre passos (segundos).
            
        Returns:
            bool: True se a reprodução foi bem-sucedida.
        """
        try:
            # Carregar dados da partida
            with open(match_file, 'r') as f:
                match_data = json.load(f)
                
            # Verificar formato válido
            if not match_data or "frames" not in match_data:
                print(f"Arquivo de partida inválido: {match_file}")
                return False
                
            agent_id = match_data.get("agent_id", "unknown_agent")
            frames = match_data["frames"]
            
            print(f"Reproduzindo partida do agente {agent_id} com {len(frames)} frames...")
            
            # Reproduzir cada frame
            for i, frame in enumerate(frames):
                # Transmitir estado do frame
                snake_mach.update_state(
                    agent_id=agent_id,
                    game_state=frame["state"],
                    status=frame["status"]
                )
                
                # Pausa ajustada pela velocidade de reprodução
                time.sleep(delay / self.replay_speed)
                
                # Mostrar progresso
                if i % 50 == 0:
                    print(f"Reproduzindo frame {i+1}/{len(frames)}")
            
            print("Reprodução concluída.")
            return True
            
        except Exception as e:
            print(f"Erro ao reproduzir partida: {str(e)}")
            return False
            
    def record_match(self, agent, output_file, max_steps=1000):
        """
        Registra uma partida completa para reprodução futura.
        
        Args:
            agent: O agente a ser registrado.
            output_file (str): Caminho para salvar o arquivo da partida.
            max_steps (int): Número máximo de passos a simular.
            
        Returns:
            dict: Estatísticas da partida registrada.
        """
        print(f"Registrando partida do agente {agent.id}...")
        self.simulator.reset()
        
        # Estrutura para armazenar frames
        match_data = {
            "agent_id": agent.id,
            "timestamp": time.time(),
            "metadata": {
                "grid_size": self.grid_size,
                "max_steps": max_steps
            },
            "frames": []
        }
        
        # Estatísticas da partida
        steps = 0
        game_over = False
        
        # Loop principal da partida
        while not game_over and steps < max_steps:
            # Obter estado e decisão do agente
            state = self.simulator.get_state()
            action = agent.decide_action(state)
            
            # Registrar frame atual
            status = "EM ANDAMENTO"
            match_data["frames"].append({
                "step": steps,
                "state": state,
                "action": int(action),
                "status": status
            })
            
            # Aplicar ação
            reward, game_over = self.simulator.apply_action(action)
            
            # Atualizar contadores
            steps += 1
            
            # Atualizar status do último frame
            if game_over:
                match_data["frames"][-1]["status"] = "DERROTA"
        
        # Adicionar estatísticas finais
        final_state = self.simulator.get_state()
        match_data["statistics"] = {
            "steps": steps,
            "score": final_state["score"],
            "energy": final_state["energy"],
            "game_over": game_over
        }
        
        # Salvar arquivo da partida
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w') as f:
            json.dump(match_data, f, indent=2)
            
        print(f"Partida registrada em {output_file}")
        return match_data["statistics"]

# Função auxiliar para visualizar o melhor agente de uma sessão
def visualize_best_agent_from_session(session_id, data_dir="../data"):
    """
    Visualiza o melhor agente de uma sessão de treinamento.
    
    Args:
        session_id (str): ID da sessão de treinamento.
        data_dir (str): Diretório onde os dados estão armazenados.
        
    Returns:
        dict: Estatísticas da visualização ou None se falhar.
    """
    from .snake_agent import Agent
    
    # Caminho para o arquivo do melhor agente
    best_agent_file = os.path.join(data_dir, f'session_{session_id}', 'best_agent.json')
    
    try:
        # Carregar dados do melhor agente
        with open(best_agent_file, 'r') as f:
            agent_data = json.load(f)
            
        # Recriar o agente
        agent = Agent(id=agent_data["id"])
        agent.genome = np.array(agent_data["genome"])
        
        # Criar visualizador e executar visualização
        visualizer = JourneyVisualizer()
        stats = visualizer.visualize_agent(agent)
        
        return stats
    except Exception as e:
        print(f"Erro ao visualizar melhor agente: {str(e)}")
        return None 