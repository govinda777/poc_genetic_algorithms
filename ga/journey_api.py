"""
Journey API

API para interação entre a jornada de treinamento e o dashboard web.
Expõe endpoints para iniciar, parar e monitorar o treinamento.
"""

import threading
import time
from flask import jsonify, request
from .snake_training_journey import TrainingJourney, start_training_journey
from .snake_ga_data import get_latest_data

# Variáveis globais para controle do processo de treinamento
active_journey = None
journey_thread = None
journey_lock = threading.Lock()
should_stop = False

def start_journey(params=None):
    """
    Inicia uma nova jornada de treinamento em uma thread separada.
    
    Args:
        params (dict, optional): Parâmetros de configuração para a jornada.
        
    Returns:
        dict: Status da operação.
    """
    global active_journey, journey_thread, should_stop
    
    with journey_lock:
        # Verificar se já existe uma jornada em andamento
        if journey_thread and journey_thread.is_alive():
            return {
                "status": "error",
                "message": "Já existe um treinamento em andamento."
            }
        
        # Formatar parâmetros
        config = {
            "population_size": params.get("population_size", 100),
            "generations": params.get("epochs", 100),
            "mutation_rate": params.get("mutation_rate", 0.1),
            "crossover_rate": params.get("crossover_rate", 0.7),
            "elitism": params.get("elitism", 0.1),
            "games_per_agent": params.get("games_per_agent", 3),
            "real_time_visualization": True,
            "visualization_frequency": 1
        }
        
        # Resetar flag de parada
        should_stop = False
        
        # Iniciar jornada em thread separada
        journey_thread = threading.Thread(
            target=_run_journey_thread,
            args=(config,),
            daemon=True
        )
        journey_thread.start()
        
        return {
            "status": "success",
            "message": "Jornada de treinamento iniciada com sucesso."
        }

def _run_journey_thread(config):
    """
    Função executada na thread de treinamento.
    
    Args:
        config (dict): Configuração da jornada.
    """
    global active_journey, should_stop
    
    try:
        # Criar e configurar a jornada
        active_journey = TrainingJourney(config)
        active_journey.setup()
        
        # Executar a jornada até conclusão ou interrupção
        for generation in range(config["generations"]):
            # Verificar flag de parada
            if should_stop:
                print("Treinamento interrompido pelo usuário.")
                break
                
            # Executar uma geração
            active_journey.current_generation = generation
            result = active_journey._train_generation()
            
            # Verificar critérios de parada
            if active_journey._check_stop_criteria(result):
                print(f"Critério de parada atingido na geração {generation+1}.")
                break
                
            # Visualizar conforme configurado
            if config["real_time_visualization"] and generation % config["visualization_frequency"] == 0:
                active_journey._visualize_best_agent()
                
            # Salvar dados periodicamente
            if generation % active_journey.config["save_frequency"] == 0:
                active_journey.data_manager.save_training_data()
        
        # Finalizar jornada
        training_time = time.time() - active_journey.data_manager.start_time
        active_journey._finalize(training_time)
        
        # Avaliar melhor agente se existir e não foi interrompido
        if active_journey.best_agent and not should_stop:
            active_journey.evaluate_best_agent(games=5)
            
    except Exception as e:
        print(f"Erro na jornada de treinamento: {str(e)}")
    finally:
        with journey_lock:
            active_journey = None

def stop_journey():
    """
    Interrompe a jornada de treinamento em andamento.
    
    Returns:
        dict: Status da operação.
    """
    global active_journey, should_stop
    
    with journey_lock:
        if not journey_thread or not journey_thread.is_alive():
            return {
                "status": "error",
                "message": "Não há treinamento em andamento para interromper."
            }
        
        # Definir flag para interromper o treinamento
        should_stop = True
        
        return {
            "status": "success",
            "message": "Sinal de interrupção enviado. O treinamento será finalizado em breve."
        }

def get_journey_status():
    """
    Retorna o status atual da jornada de treinamento.
    
    Returns:
        dict: Status atual e dados da jornada.
    """
    global active_journey, journey_thread
    
    with journey_lock:
        is_active = journey_thread is not None and journey_thread.is_alive()
        
        # Obter dados da jornada atual, se disponíveis
        journey_data = get_latest_data()
        
        return {
            "active": is_active,
            "data": journey_data
        }

# Funções auxiliares para registro de routes no Flask
def register_journey_routes(app):
    """
    Registra as rotas da API da jornada no aplicativo Flask.
    
    Args:
        app: Aplicativo Flask.
    """
    @app.route('/api/journey/start', methods=['POST'])
    def api_start_journey():
        params = request.json or {}
        result = start_journey(params)
        return jsonify(result)
    
    @app.route('/api/journey/stop', methods=['POST'])
    def api_stop_journey():
        result = stop_journey()
        return jsonify(result)
    
    @app.route('/api/journey/status', methods=['GET'])
    def api_journey_status():
        result = get_journey_status()
        return jsonify(result) 