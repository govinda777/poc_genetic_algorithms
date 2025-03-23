import json
import threading
import time
from flask import Flask, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

class SnakeMach:
    """
    Responsável por transmitir dados em tempo real da partida para o frontend via WebSocket.
    """
    def __init__(self):
        self.status = "EM ANDAMENTO"  # Pode ser: "EM ANDAMENTO", "VITORIA", "DERROTA"
        self.agent_id = None
        self.state = {}
        self.lock = threading.Lock()

    def update_state(self, agent_id, game_state, status="EM ANDAMENTO"):
        with self.lock:
            self.agent_id = agent_id
            self.state = game_state
            self.status = status
        socketio.emit('game_update', self.get_payload())

    def get_payload(self):
        return {
            'agent_id': self.agent_id,
            'status': self.status,
            'state': self.state
        }

    def reset(self):
        with self.lock:
            self.agent_id = None
            self.state = {}
            self.status = "EM ANDAMENTO"

# Instância global da transmissão
snake_mach = SnakeMach()

@app.route("/status/<agent_id>")
def get_status(agent_id):
    if snake_mach.agent_id != agent_id:
        return jsonify({"error": "Agente nao encontrado ou nao ativo"}), 404
    return jsonify(snake_mach.get_payload())

@socketio.on("connect")
def handle_connect():
    emit("connected", {"message": "Conectado ao SnakeMach"})
    emit("game_update", snake_mach.get_payload())

# Exemplo de uso em background (para testes isolados)
def simulate_game_updates():
    i = 0
    while True:
        dummy_state = {
            "snake": [{"x": i, "y": 5}],
            "food": {"x": 10, "y": 5},
            "score": i,
            "energy": 100 - i
        }
        snake_mach.update_state(agent_id="agent_001", game_state=dummy_state)
        i = (i + 1) % 25
        time.sleep(0.5)

if __name__ == "__main__":
    threading.Thread(target=simulate_game_updates, daemon=True).start()
    socketio.run(app, host="0.0.0.0", port=5000)
