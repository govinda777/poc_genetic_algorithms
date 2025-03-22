from flask import Flask, request, jsonify, send_from_directory
import subprocess
import os

app = Flask(__name__, static_folder='', static_url_path='')

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/train', methods=['POST'])
def run_training():
    data = request.json
    epochs = data.get('epochs', 10)
    commands = data.get('commands', ['up', 'down', 'left', 'right'])

    try:
        # Chamar script de treino com argumentos se necessário
        result = subprocess.run(
            ['python3', 'ga/snake_ga_training.py', str(epochs)],
            capture_output=True, text=True, check=True
        )
        return jsonify({
            'status': 'success',
            'output': result.stdout
        })
    except subprocess.CalledProcessError as e:
        return jsonify({
            'status': 'error',
            'output': e.stderr
        }), 500

@app.route('/api/data', methods=['GET'])
def get_training_data():
    from ga import snake_ga_data  # Certifique-se que ele tem um método ou dicionário exposto
    return jsonify(snake_ga_data.get_latest_data())  # Precisa implementar isso no arquivo

if __name__ == '__main__':
    app.run(debug=True, port=8000)
