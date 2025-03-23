import numpy as np
from collections import OrderedDict

class AgentDNA:
    """
    Representa o DNA completo de um agente - a estrutura que contém todas as informações
    genéticas necessárias para definir o comportamento do agente.
    
    Análogo ao DNA biológico, esta classe armazena todo o material genético do agente
    e gerencia sua organização, replicação e modificação.
    """

    def __init__(self, input_size, hidden_size, output_size, chromosomes=None):
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size
        
        # O DNA contém múltiplos genes (cromossomos) que representam diferentes partes funcionais da rede neural
        self.chromosomes = OrderedDict()
        
        if chromosomes is not None:
            self.chromosomes = chromosomes
        else:
            # Inicializa os cromossomos com genes para cada parte funcional da rede neural
            self.chromosomes["input_weights"] = AgentGene(
                input_size * hidden_size, 
                "input_weights", 
                np.random.uniform(-1, 1, input_size * hidden_size)
            )
            
            self.chromosomes["hidden_biases"] = AgentGene(
                hidden_size, 
                "hidden_biases", 
                np.random.uniform(-1, 1, hidden_size)
            )
            
            self.chromosomes["output_weights"] = AgentGene(
                hidden_size * output_size, 
                "output_weights", 
                np.random.uniform(-1, 1, hidden_size * output_size)
            )
            
            self.chromosomes["output_biases"] = AgentGene(
                output_size, 
                "output_biases", 
                np.random.uniform(-1, 1, output_size)
            )
        
        # Total de genes no DNA completo
        self.total_genes = sum(gene.size for gene in self.chromosomes.values())

    def get_flattened_genome(self):
        """
        Retorna todo o DNA como um único vetor (semelhante à sequência completa de nucleotídeos)
        """
        genome = []
        for gene in self.chromosomes.values():
            genome.extend(gene.values)
        return np.array(genome)

    def mutate(self, mutation_rate=0.1, mutation_strength=0.2):
        """
        Aplica mutações em todo o DNA, afetando genes específicos.
        Semelhante a mutações pontuais no DNA biológico.
        """
        for gene in self.chromosomes.values():
            gene.mutate(mutation_rate, mutation_strength)

    def crossover(self, partner_dna):
        """
        Realiza a recombinação genética entre dois DNAs, gerando um novo DNA.
        Semelhante à recombinação cromossômica na reprodução sexual.
        """
        child_chromosomes = OrderedDict()
        
        # Para cada cromossomo, decidimos aleatoriamente se vem do 'pai' ou da 'mãe'
        for key in self.chromosomes.keys():
            if np.random.random() < 0.5:
                child_chromosomes[key] = self.chromosomes[key].clone()
            else:
                child_chromosomes[key] = partner_dna.chromosomes[key].clone()
                
        # Ocasionalmente fazer crossover em nível de gene (mais detalhado)
        if np.random.random() < 0.3:  # 30% de chance de crossover de genes
            selected_key = np.random.choice(list(self.chromosomes.keys()))
            child_chromosomes[selected_key] = self.chromosomes[selected_key].crossover(
                partner_dna.chromosomes[selected_key]
            )
            
        return AgentDNA(
            self.input_size, 
            self.hidden_size, 
            self.output_size, 
            child_chromosomes
        )

    def to_neural_network_weights(self):
        """
        Converte o DNA em pesos para a rede neural.
        Esta é a 'expressão gênica' - como os genes se traduzem em funcionalidade.
        """
        weights = {}
        weights["input_hidden"] = self.chromosomes["input_weights"].values.reshape(
            self.input_size, self.hidden_size
        )
        weights["hidden_biases"] = self.chromosomes["hidden_biases"].values
        weights["hidden_output"] = self.chromosomes["output_weights"].values.reshape(
            self.hidden_size, self.output_size
        )
        weights["output_biases"] = self.chromosomes["output_biases"].values
        
        return weights

    def clone(self):
        """Cria uma cópia exata do DNA atual."""
        cloned_chromosomes = OrderedDict()
        for key, gene in self.chromosomes.items():
            cloned_chromosomes[key] = gene.clone()
            
        return AgentDNA(
            self.input_size, 
            self.hidden_size, 
            self.output_size, 
            cloned_chromosomes
        ) 