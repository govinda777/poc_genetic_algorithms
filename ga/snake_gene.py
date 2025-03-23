import numpy as np

class AgentGene:
    """
    Representa um gene específico - uma unidade funcional dentro do DNA que codifica
    uma parte específica do comportamento ou estrutura do agente.
    
    Análogo ao gene biológico, cada instância desta classe contém instruções 
    específicas para uma parte da rede neural (por exemplo, pesos entre camadas específicas).
    """

    def __init__(self, size, name, values=None):
        """
        Inicializa um gene com um tamanho específico e nome funcional.
        
        Args:
            size: Tamanho do gene (número de valores)
            name: Nome funcional do gene (ex: "input_weights")
            values: Valores iniciais (opcional)
        """
        self.size = size
        self.name = name  # Identificador funcional do gene
        
        if values is not None:
            self.values = np.array(values)
        else:
            self.values = np.random.uniform(-1, 1, size)

    def mutate(self, mutation_rate=0.1, mutation_strength=0.2):
        """
        Aplica mutações aleatórias nos valores do gene.
        Equivalente a mutações pontuais em um gene biológico.
        """
        mutation_mask = np.random.random(self.size) < mutation_rate
        mutations = np.random.normal(0, mutation_strength, self.size) * mutation_mask
        self.values += mutations
        
        # Limitamos os valores para manter estabilidade
        self.values = np.clip(self.values, -1, 1)

    def crossover(self, partner_gene):
        """
        Realiza crossover entre este gene e outro, gerando um novo gene.
        Semelhante à recombinação dentro de um único gene biológico.
        """
        # Garantir que os genes são compatíveis
        if self.size != partner_gene.size or self.name != partner_gene.name:
            raise ValueError("Tentativa de cruzamento entre genes incompatíveis")
            
        # Crossover de ponto único
        crossover_point = np.random.randint(0, self.size)
        child_values = np.concatenate([
            self.values[:crossover_point],
            partner_gene.values[crossover_point:]
        ])
        
        return AgentGene(self.size, self.name, child_values)

    def clone(self):
        """Cria uma cópia exata do gene."""
        return AgentGene(self.size, self.name, self.values.copy())
        
    def get_values(self):
        """Retorna os valores do gene."""
        return self.values
        
    def __len__(self):
        """Permite usar len() para obter o tamanho do gene."""
        return self.size 