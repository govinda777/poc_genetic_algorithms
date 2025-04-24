---
marp: true
theme: default
paginate: true
---

# Genetic Algorithms
## Uma abordagem evolucionária para solução de problemas

---

# O que são Algoritmos Genéticos?

- Método de otimização inspirado na evolução natural
- Utiliza conceitos como seleção natural, reprodução e mutação
- Busca soluções para problemas complexos simulando evolução
- Criados pelo John Holland nos anos 1970
- Úteis para problemas de otimização e busca

---

# Quando usar Algoritmos Genéticos?

- Espaço de busca muito grande
- Problemas difíceis de modelar matematicamente
- Muitos parâmetros interrelacionados
- Múltiplos objetivos de otimização
- Função objetivo não-diferenciável

---

# Conceitos Fundamentais

- **Indivíduo**: representação de uma solução potencial
- **População**: conjunto de indivíduos
- **Gene**: unidade básica de informação genética
- **Cromossomo**: sequência de genes que forma um indivíduo
- **Fitness**: medida da qualidade de um indivíduo
- **Geração**: iteração do algoritmo

---

# Operações Genéticas

1. **Seleção**: escolha dos indivíduos mais aptos
2. **Crossover**: combinação de material genético
3. **Mutação**: alterações aleatórias nos genes
4. **Elitismo**: preservação dos melhores indivíduos

![height:300px](https://i.imgur.com/abcdef.png)

---

# Fluxo do Algoritmo Genético

1. Inicializar população aleatoriamente
2. Avaliar o fitness de cada indivíduo
3. Selecionar indivíduos para reprodução
4. Aplicar crossover e mutação
5. Criar nova geração
6. Repetir até critério de parada
7. Retornar melhor solução encontrada

---

# Arquitetura de Classes

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│  GeneticAlg │◀───▶│ Population  │◀───▶│ Individual  │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                   ▲                   ▲
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│  Selection  │     │  Crossover  │     │  Mutation   │
│  Strategy   │     │  Strategy   │     │  Strategy   │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

# Classe: Individual

```typescript
class Individual<T> {
  // Representação genética (cromossomo)
  private chromosome: T[];
  
  // Valor de adequação (fitness)
  private fitnessValue: number = 0;
  
  constructor(chromosome: T[]) {
    this.chromosome = chromosome;
  }
  
  getChromosome(): T[] {
    return this.chromosome;
  }
  
  getFitness(): number {
    return this.fitnessValue;
  }
  
  setFitness(value: number): void {
    this.fitnessValue = value;
  }
  
  // Cria uma cópia do indivíduo
  clone(): Individual<T> {
    return new Individual<T>([...this.chromosome]);
  }
}
```

---

# Classe: Population

```typescript
class Population<T> {
  private individuals: Individual<T>[];
  private generation: number = 0;
  
  constructor(individuals: Individual<T>[]) {
    this.individuals = individuals;
  }
  
  getIndividuals(): Individual<T>[] {
    return this.individuals;
  }
  
  addIndividual(individual: Individual<T>): void {
    this.individuals.push(individual);
  }
  
  getGeneration(): number {
    return this.generation;
  }
  
  incrementGeneration(): void {
    this.generation++;
  }
  
  getBestIndividual(): Individual<T> {
    return this.individuals.reduce((best, current) => 
      current.getFitness() > best.getFitness() ? current : best, 
      this.individuals[0]);
  }
}
```

---

# Interface: FitnessFunction

```typescript
interface FitnessFunction<T> {
  // Calcula o valor de adequação de um indivíduo
  calculate(individual: Individual<T>): number;
}
```

---

# Interface: SelectionStrategy

```typescript
interface SelectionStrategy<T> {
  // Seleciona indivíduos para reprodução
  select(population: Population<T>, count: number): Individual<T>[];
}

// Implementação: Seleção por Torneio
class TournamentSelection<T> implements SelectionStrategy<T> {
  private tournamentSize: number;
  
  constructor(tournamentSize: number) {
    this.tournamentSize = tournamentSize;
  }
  
  select(population: Population<T>, count: number): Individual<T>[] {
    // Implementação da seleção por torneio
    // Seleciona aleatoriamente indivíduos e escolhe o melhor
    // ...
  }
}
```

---

# Interface: CrossoverStrategy

```typescript
interface CrossoverStrategy<T> {
  // Combina dois indivíduos para gerar filhos
  crossover(parent1: Individual<T>, parent2: Individual<T>): Individual<T>[];
}

// Implementação: Crossover de Um Ponto
class SinglePointCrossover<T> implements CrossoverStrategy<T> {
  crossover(parent1: Individual<T>, parent2: Individual<T>): Individual<T>[] {
    // Implementação do crossover de um ponto
    // Escolhe um ponto e troca os genes entre os pais
    // ...
  }
}
```

---

# Interface: MutationStrategy

```typescript
interface MutationStrategy<T> {
  // Aplica mutação em um indivíduo
  mutate(individual: Individual<T>): void;
}

// Implementação: Mutação de Troca
class SwapMutation<T> implements MutationStrategy<T> {
  private mutationRate: number;
  
  constructor(mutationRate: number) {
    this.mutationRate = mutationRate;
  }
  
  mutate(individual: Individual<T>): void {
    // Implementação da mutação de troca
    // Troca aleatoriamente genes com probabilidade mutationRate
    // ...
  }
}
```

---

# Classe: GeneticAlgorithm

```typescript
class GeneticAlgorithm<T> {
  private population: Population<T>;
  private fitnessFunction: FitnessFunction<T>;
  private selectionStrategy: SelectionStrategy<T>;
  private crossoverStrategy: CrossoverStrategy<T>;
  private mutationStrategy: MutationStrategy<T>;
  private elitismCount: number;
  
  constructor(
    population: Population<T>,
    fitnessFunction: FitnessFunction<T>,
    selectionStrategy: SelectionStrategy<T>,
    crossoverStrategy: CrossoverStrategy<T>,
    mutationStrategy: MutationStrategy<T>,
    elitismCount: number
  ) {
    this.population = population;
    this.fitnessFunction = fitnessFunction;
    this.selectionStrategy = selectionStrategy;
    this.crossoverStrategy = crossoverStrategy;
    this.mutationStrategy = mutationStrategy;
    this.elitismCount = elitismCount;
  }
  
  // Continua...
```

---

# Classe: GeneticAlgorithm (cont.)

```typescript
  // Evolui a população para a próxima geração
  evolve(): void {
    // 1. Avalia o fitness de cada indivíduo
    this.evaluatePopulation();
    
    // 2. Cria nova população
    const newPopulation = new Population<T>([]);
    
    // 3. Aplica elitismo (preserva os melhores)
    this.applyElitism(newPopulation);
    
    // 4. Preenche o resto da população com novos indivíduos
    while (newPopulation.getIndividuals().length < this.population.getIndividuals().length) {
      // Seleciona pais
      const parents = this.selectionStrategy.select(this.population, 2);
      
      // Aplica crossover
      const offspring = this.crossoverStrategy.crossover(parents[0], parents[1]);
      
      // Aplica mutação e adiciona à nova população
      for (const child of offspring) {
        if (newPopulation.getIndividuals().length < this.population.getIndividuals().length) {
          this.mutationStrategy.mutate(child);
          newPopulation.addIndividual(child);
        }
      }
    }
    
    // 5. Atualiza população e incrementa geração
    this.population = newPopulation;
    this.population.incrementGeneration();
  }
```

---

# Classe: GeneticAlgorithm (cont.)

```typescript
  // Avalia o fitness de todos os indivíduos
  private evaluatePopulation(): void {
    for (const individual of this.population.getIndividuals()) {
      const fitness = this.fitnessFunction.calculate(individual);
      individual.setFitness(fitness);
    }
  }
  
  // Aplica elitismo (preserva os melhores indivíduos)
  private applyElitism(newPopulation: Population<T>): void {
    // Ordena população por fitness (decrescente)
    const sortedIndividuals = [...this.population.getIndividuals()].sort(
      (a, b) => b.getFitness() - a.getFitness()
    );
    
    // Adiciona os melhores à nova população
    for (let i = 0; i < this.elitismCount; i++) {
      newPopulation.addIndividual(sortedIndividuals[i].clone());
    }
  }
  
  // Retorna a melhor solução encontrada
  getBestSolution(): Individual<T> {
    return this.population.getBestIndividual();
  }
}
```

---

# Exemplo de Uso: Problema TSP

```typescript
// Criar indivíduos (rotas)
const individuals: Individual<number>[] = [];
for (let i = 0; i < 100; i++) {
  individuals.push(createRandomRoute(cities));
}

// Criar população inicial
const population = new Population<number>(individuals);

// Definir função de fitness (distância total da rota)
const fitnessFunction: FitnessFunction<number> = {
  calculate: (route) => 1 / calculateTotalDistance(route.getChromosome())
};

// Criar algoritmo genético
const ga = new GeneticAlgorithm<number>(
  population,
  fitnessFunction,
  new TournamentSelection<number>(5),
  new OrderCrossover<number>(),
  new SwapMutation<number>(0.01),
  5 // elitismo
);

// Executar evolução
for (let i = 0; i < 1000; i++) {
  ga.evolve();
}

// Obter melhor solução
const bestRoute = ga.getBestSolution();
```

---

# Exemplo de Uso: Snake Game AI

```typescript
// Representação do cromossomo: pesos da rede neural
const createRandomNN = () => {
  const weights = new Array(networkSize).fill(0)
    .map(() => Math.random() * 2 - 1);
  return new Individual<number>(weights);
};

// População inicial de redes neurais
const population = new Population<number>(
  Array(100).fill(0).map(() => createRandomNN())
);

// Fitness: pontuação no jogo
const fitnessFunction: FitnessFunction<number> = {
  calculate: (individual) => {
    const nn = createNeuralNetwork(individual.getChromosome());
    return playGame(nn);
  }
};

// Algoritmo genético
const ga = new GeneticAlgorithm<number>(
  population, fitnessFunction,
  new RouletteSelection<number>(),
  new UniformCrossover<number>(),
  new GaussianMutation<number>(0.1, 0.5),
  10
);
```

---

# Considerações Práticas

- **Representação do cromossomo**: adequada ao problema
- **Tamanho da população**: impacta diversidade e convergência
- **Taxa de mutação**: muito baixa = convergência prematura, muito alta = instabilidade
- **Balanceamento entre exploração e aproveitamento**
- **Critérios de parada**: gerações, fitness, tempo, convergência
- **Diversidade genética**: fundamental para evitar mínimos locais

---

# Vantagens e Desvantagens

## Vantagens
- Buscam globalmente no espaço de soluções
- Não requerem conhecimento do gradiente
- Paralelizável
- Adaptável a diferentes problemas

## Desvantagens
- Pode convergir prematuramente
- Não garante encontrar o ótimo global
- Parametrização pode ser complexa
- Computacionalmente intensivo

---

# Aplicações Reais

- **Engenharia**: design de aerofólios, circuitos
- **Robótica**: evolução de controladores
- **Finanças**: otimização de portfolios
- **Bioinformática**: alinhamento de sequências
- **Jogos**: desenvolvimento de agentes inteligentes
- **Transporte**: roteamento, logística
- **Machine Learning**: otimização de hiperparâmetros

---

# Perguntas?

Obrigado!

