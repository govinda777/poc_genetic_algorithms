import numpy as np

class NeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size, weights=None):
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size

        if weights is None:
            # Inicialização aleatória dos pesos e biases
            self.weights_input_hidden = np.random.uniform(-1, 1, (input_size, hidden_size))
            self.bias_hidden = np.random.uniform(-1, 1, hidden_size)
            self.weights_hidden_output = np.random.uniform(-1, 1, (hidden_size, output_size))
            self.bias_output = np.random.uniform(-1, 1, output_size)
        else:
            # Reconstrói os pesos a partir do vetor genético (genome)
            weights = np.array(weights)
            ih = input_size * hidden_size
            hb = hidden_size
            ho = hidden_size * output_size
            self.weights_input_hidden = weights[:ih].reshape(input_size, hidden_size)
            self.bias_hidden = weights[ih:ih+hb]
            self.weights_hidden_output = weights[ih+hb:ih+hb+ho].reshape(hidden_size, output_size)
            self.bias_output = weights[ih+hb+ho:]

    def get_weights_flat(self):
        """
        Retorna todos os pesos da rede neural em um único vetor (flattened),
        útil para crossover e mutações genéticas.
        """
        return np.concatenate([
            self.weights_input_hidden.flatten(),
            self.bias_hidden.flatten(),
            self.weights_hidden_output.flatten(),
            self.bias_output.flatten()
        ])

    def forward(self, inputs):
        """
        Executa uma passagem direta pela rede.
        """
        hidden = np.dot(inputs, self.weights_input_hidden) + self.bias_hidden
        hidden = self.relu(hidden)
        output = np.dot(hidden, self.weights_hidden_output) + self.bias_output
        return self.softmax(output)

    @staticmethod
    def relu(x):
        """Função de ativação ReLU (retifica valores negativos para zero)."""
        return np.maximum(0, x)

    @staticmethod
    def softmax(x):
        """
        Converte a saída da rede em uma distribuição de probabilidades,
        útil para decisões baseadas em ação.
        """
        e_x = np.exp(x - np.max(x))  # Estabiliza exponenciais
        return e_x / e_x.sum()
