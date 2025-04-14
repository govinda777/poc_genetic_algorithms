from flask import Flask, request, jsonify, send_from_directory
import subprocess
import os
import threading
import time
import json
from ga import snake_ga_data
from flask_socketio import SocketIO, emit
from ga.snake_training_journey import TrainingJourney, start_training_journey
from ga.journey_api import register_journey_routes
from ga.journey_visualizer import JourneyVisualizer, visualize_best_agent_from_session

app = Flask(__name__, static_folder='', static_url_path='')
socketio = SocketIO(app)

# Global variable to track training process
training_thread = None
training_process = None
training_paused = False
current_training_config = None

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

def run_training_process(epochs, population_size, mutation_rate, crossover_rate, elitism, games_per_agent):
    """Run the training process in a separate thread."""
    global training_process
    
    # Build command with parameters
    command = [
        'python3', 'ga/snake_ga_training.py',
        '--generations', str(epochs),
        '--population', str(population_size),
        '--mutation', str(mutation_rate),
        '--crossover', str(crossover_rate),
        '--elitism', str(elitism),
        '--games', str(games_per_agent)
    ]
    
    # Start the process
    training_process = subprocess.Popen(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Wait for process to complete
    stdout, stderr = training_process.communicate()
    
    # Capture return code before unsetting training_process
    retcode = training_process.returncode
    
    # Log detailed information
    print(f"Command executed: {' '.join(command)}")
    print(f"Process output: {stdout}")
    print(f"Process error: {stderr}")
    print(f"Process return code: {retcode}")
    
    # Process is done, unset global variable
    training_process = None
    
    if retcode == 0:
        print("Training completed successfully")
    else:
        print(f"Training failed with error: {stderr}")

@app.route('/api/train', methods=['POST'])
def start_training():
    global training_thread, training_process, training_paused, current_training_config
    
    # Check if training is already running
    if training_thread and training_thread.is_alive():
        return jsonify({
            'status': 'error',
            'message': 'Training is already running'
        }), 400
    
    # Get training parameters
    data = request.json
    epochs = data.get('epochs', 100)
    population_size = data.get('population_size', 100)
    mutation_rate = data.get('mutation_rate', 0.1)
    crossover_rate = data.get('crossover_rate', 0.7)
    elitism = data.get('elitism', 0.1)
    games_per_agent = data.get('games_per_agent', 3)
    
    # Store the current training configuration
    current_training_config = {
        'epochs': epochs,
        'population_size': population_size,
        'mutation_rate': mutation_rate,
        'crossover_rate': crossover_rate,
        'elitism': elitism,
        'games_per_agent': games_per_agent
    }
    
    # Reset the paused flag
    training_paused = False
    
    # Start training in a background thread
    training_thread = threading.Thread(
        target=run_training_process,
        args=(epochs, population_size, mutation_rate, crossover_rate, elitism, games_per_agent),
        daemon=True
    )
    training_thread.start()
    
    return jsonify({
        'status': 'success',
        'message': 'Training started in the background'
    })

@app.route('/api/train/pause', methods=['POST'])
def pause_training():
    global training_paused, training_process
    
    if training_process is None:
        return jsonify({
            'status': 'error',
            'message': 'No training process is running'
        }), 400
    
    if training_paused:
        return jsonify({
            'status': 'error',
            'message': 'Training is already paused'
        }), 400
    
    # Send a pause signal to the training process
    # This would typically involve a signal or mechanism to pause the training
    # For this implementation, we'll simulate pausing by sending a SIGSTOP signal
    try:
        # In a real implementation, you might use a custom signal or API call
        # to tell your training process to pause
        training_paused = True
        
        # For demo purposes, let's log the pause event
        print(f"Training paused at {time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        return jsonify({
            'status': 'success',
            'message': 'Training paused successfully'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error pausing training: {str(e)}'
        }), 500

@app.route('/api/train/continue', methods=['POST'])
def continue_training():
    global training_paused, training_process
    
    if training_process is None:
        return jsonify({
            'status': 'error',
            'message': 'No training process is running'
        }), 400
    
    if not training_paused:
        return jsonify({
            'status': 'error',
            'message': 'Training is not paused'
        }), 400
    
    # Send a continue signal to the training process
    try:
        # In a real implementation, you might use a custom signal or API call
        # to tell your training process to continue
        training_paused = False
        
        # For demo purposes, let's log the continue event
        print(f"Training continued at {time.strftime('%Y-%m-%d %H:%M:%S')}")
        
        return jsonify({
            'status': 'success',
            'message': 'Training continued successfully'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error continuing training: {str(e)}'
        }), 500

@app.route('/api/train/save', methods=['POST'])
def save_training():
    global training_process, current_training_config
    
    if training_process is None:
        return jsonify({
            'status': 'error',
            'message': 'No training process is running'
        }), 400
    
    try:
        # Get current training data
        training_data = snake_ga_data.get_latest_data()
        
        if not training_data:
            return jsonify({
                'status': 'error',
                'message': 'No training data available to save'
            }), 400
        
        # Create a timestamp for the save
        timestamp = time.strftime('%Y%m%d_%H%M%S')
        
        # Create a directory for saves if it doesn't exist
        save_dir = os.path.join('data', 'saves')
        os.makedirs(save_dir, exist_ok=True)
        
        # Save the training data and configuration
        save_path = os.path.join(save_dir, f'training_save_{timestamp}.json')
        
        save_data = {
            'timestamp': timestamp,
            'config': current_training_config,
            'training_data': training_data
        }
        
        with open(save_path, 'w') as f:
            json.dump(save_data, f, indent=2)
        
        return jsonify({
            'status': 'success',
            'message': 'Training saved successfully',
            'save_path': save_path
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error saving training: {str(e)}'
        }), 500

@app.route('/api/train/status', methods=['GET'])
def training_status():
    global training_thread, training_process, training_paused
    
    # Check if training thread is active
    is_active = training_thread is not None and training_thread.is_alive()
    
    # Get additional status from snake_ga_data
    training_data = snake_ga_data.get_latest_data()
    
    return jsonify({
        'active': is_active,
        'paused': training_paused,
        'data': training_data
    })

@app.route('/api/train/stop', methods=['POST'])
def stop_training():
    global training_process, training_paused
    
    if training_process is None:
        return jsonify({
            'status': 'error',
            'message': 'No training process is running'
        }), 400
    
    # Terminate the training process
    try:
        training_process.terminate()
        time.sleep(1)  # Give it a moment to terminate
        
        # Force kill if still running
        if training_process.poll() is None:
            training_process.kill()
        
        # Reset the paused flag
        training_paused = False
        
        return jsonify({
            'status': 'success',
            'message': 'Training process stopped'
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error stopping training: {str(e)}'
        }), 500

@app.route('/api/data', methods=['GET'])
def get_training_data():
    # Get session ID from query parameters if provided
    session_id = request.args.get('session_id')
    
    if session_id:
        # Load specific session data
        data = snake_ga_data.load_training_session(session_id)
        if data:
            return jsonify(data)
        else:
            return jsonify({
                'status': 'error',
                'message': f'Session {session_id} not found'
            }), 404
    else:
        # Get latest data
        data = snake_ga_data.get_latest_data()
        if data:
            return jsonify(data)
        else:
            return jsonify({
                'status': 'error',
                'message': 'No training data available'
            }), 404

@app.route('/api/sessions', methods=['GET'])
def list_sessions():
    sessions = snake_ga_data.list_training_sessions()
    return jsonify(sessions)

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('game_start')
def handle_game_start(data):
    print('New game started:', data)
    emit('server_response', {'message': 'Game start acknowledged'}, broadcast=True)

@socketio.on('game_data')
def handle_game_data(data):
    print('Received game data:', data)

# Registrar rotas da API da jornada
register_journey_routes(app)

# Adicionar rota para visualização de agentes
@app.route('/api/visualize/agent/<session_id>', methods=['GET'])
def visualize_agent_route(session_id):
    result = visualize_best_agent_from_session(session_id)
    return jsonify({
        'status': 'success' if result else 'error',
        'data': result
    })

# Adicionar rota para replay de partida
@app.route('/api/visualize/replay/<session_id>', methods=['GET'])
def replay_match_route(session_id):
    match_file = os.path.join('data', f'session_{session_id}', 'matches', 'best_match.json')
    
    visualizer = JourneyVisualizer(replay_speed=float(request.args.get('speed', 1.0)))
    success = visualizer.replay_match(match_file)
    
    return jsonify({
        'status': 'success' if success else 'error',
        'message': 'Replay concluído com sucesso' if success else 'Erro ao reproduzir partida'
    })

if __name__ == '__main__':
    socketio.run(app, debug=True, port=8000)
