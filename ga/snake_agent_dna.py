import numpy as np

class AgentDNA:
    """
    Representa o DNA (genoma) de um agente, contendo os pesos da rede neural.

    Permite:
    - Inicialização aleatória ou com pesos existentes
    - Cálculo de crossover
    - Aplicação de mutações
    """

    def __init__(self, input_size, hidden_size, output_size, genes=None):
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size

        self.total_genes = (input_size * hidden_size) + hidden_size + (hidden_size * output_size) + output_size

        if genes is not None:
            self.genes = np.array(genes)
        else:
            self.genes = np.random.uniform(-1, 1, self.total_genes)

    def mutate(self, mutation_rate=0.1, mutation_strength=0.2):
        """
        Aplica mutações gaussianas nos genes com uma certa taxa.

        Args:
            mutation_rate (float): Probabilidade de mutação por gene.
            mutation_strength (float): Intensidade da mutação (desvio padrão).
        """
        for i in range(len(self.genes)):
            if np.random.rand() < mutation_rate:
                self.genes[i] += np.random.normal(0, mutation_strength)
                self.genes[i] = np.clip(self.genes[i], -1, 1)

    def crossover(self, partner_dna):
        """
        Realiza crossover de ponto único com outro DNA.

        Args:
            partner_dna (AgentDNA): Outro genoma para cruzamento.

        Returns:
            AgentDNA: Novo DNA gerado.
        """
        crossover_point = np.random.randint(0, self.total_genes)
        child_genes = np.concatenate([
            self.genes[:crossover_point],
            partner_dna.genes[crossover_point:]
        ])
        return AgentDNA(self.input_size, self.hidden_size, self.output_size, child_genes)

    def to_list(self):
        """Retorna os genes como uma lista Python (útil para salvar em JSON)."""
        return self.genes.tolist()

    def clone(self):
        """Cria uma cópia do DNA atual."""
        return AgentDNA(self.input_size, self.hidden_size, self.output_size, self.genes.copy())
