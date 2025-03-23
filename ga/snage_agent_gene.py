import numpy as np

class AgentGene:
    """
    Representa o genoma de um agente (conjunto de pesos da rede neural).
    Fornece funcionalidades para mutação, crossover e clonação.
    """

    def __init__(self, input_size, hidden_size, output_size, values=None):
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size

        self.total_size = (
            input_size * hidden_size + hidden_size +
            hidden_size * output_size + output_size
        )

        if values is not None:
            self.values = np.array(values)
        else:
            self.values = np.random.uniform(-1, 1, self.total_size)

    def mutate(self, mutation_rate=0.1, mutation_strength=0.2):
        """
        Aplica mutação gaussiana ao genoma com base na taxa fornecida.
        """
        for i in range(len(self.values)):
            if np.random.rand() < mutation_rate:
                self.values[i] += np.random.normal(0, mutation_strength)
                self.values[i] = np.clip(self.values[i], -1, 1)

    def crossover(self, partner_gene):
        """
        Realiza crossover de ponto único com outro gene.
        """
        point = np.random.randint(0, self.total_size)
        child_values = np.concatenate([
            self.values[:point],
            partner_gene.values[point:]
        ])
        return AgentGene(self.input_size, self.hidden_size, self.output_size, child_values)

    def clone(self):
        """Cria uma cópia exata do gene."""
        return AgentGene(self.input_size, self.hidden_size, self.output_size, self.values.copy())

    def to_list(self):
        """Retorna o vetor genético como lista (para JSON, por exemplo)."""
        return self.values.tolist()

    def from_list(self, values):
        """Importa valores externos para dentro do gene."""
        self.values = np.array(values)
