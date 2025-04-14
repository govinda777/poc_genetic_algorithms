# Genoma no Algoritmo Genético do Snake

## Conceito de Genoma em Algoritmos Genéticos

No contexto de algoritmos genéticos, um **genoma** é a representação completa das características hereditárias de um indivíduo. Inspirado na biologia, onde o DNA contém as instruções genéticas para o desenvolvimento e funcionamento de todos os organismos vivos, o genoma em algoritmos genéticos define completamente um agente e seu comportamento.

## Implementação do Genoma no Projeto

### Estrutura do Genoma

No projeto de IA para o jogo Snake, o genoma é implementado como um vetor contínuo de valores reais (tipicamente no intervalo [-1, 1]) que codifica todos os pesos e vieses da rede neural do agente. Esta representação permite:

1. **Herança genética**: Transmissão de características entre gerações
2. **Variação**: Mutação para explorar novas possibilidades
3. **Recombinação**: Crossover para combinar características de diferentes agentes

### Mapeamento do Genoma para a Rede Neural

Cada agente possui uma rede neural que traduz informações do ambiente (entradas) em decisões de movimento (saídas). O genoma define completamente esta rede neural através da seguinte estrutura:

```
[W_ih][B_h][W_ho][B_o]
```

Onde:
- **W_ih**: Matriz de pesos entre a camada de entrada e a camada oculta
- **B_h**: Vetor de vieses da camada oculta
- **W_ho**: Matriz de pesos entre a camada oculta e a camada de saída
- **B_o**: Vetor de vieses da camada de saída

Para uma rede com:
- `input_size` neurônios na camada de entrada (24 por padrão)
- `hidden_size` neurônios na camada oculta (16 por padrão)
- `output_size` neurônios na camada de saída (4 por padrão)

O tamanho total do genoma é:
```
total_weights = (input_size * hidden_size) + hidden_size + (hidden_size * output_size) + output_size
```

Na configuração padrão, temos:
```
total_weights = (24 * 16) + 16 + (16 * 4) + 4 = 384 + 16 + 64 + 4 = 468 valores
```

### Significado Biológico dos Componentes

1. **Pesos entre camadas (W_ih, W_ho)**:
   - Análogos às conexões sinápticas no cérebro
   - Determinam a influência relativa de cada característica na tomada de decisão
   - Valores positivos indicam excitação, valores negativos indicam inibição

2. **Vieses (B_h, B_o)**:
   - Análogos ao limiar de ativação dos neurônios
   - Determinam a tendência básica de ativação de cada neurônio
   - Permitem ajustar o comportamento padrão do agente

## Características Codificadas no Genoma

O genoma codifica indiretamente as seguintes características comportamentais do agente:

### 1. Sensibilidade aos Estímulos

Os pesos relacionados às entradas sensoriais determinam como o agente responde a diferentes estímulos:

- **Distância até obstáculos**: Quanto o agente se preocupa em evitar colisões
- **Localização da comida**: Como o agente prioriza se mover em direção à comida
- **Perigo iminente**: Resposta a situações de risco elevado

### 2. Estratégias de Movimento

Através dos pesos e conexões, o genoma define estratégias como:

- **Exploração vs. Exploração**: Equilíbrio entre buscar novas áreas ou aproveitar recursos conhecidos
- **Planejamento de caminho**: Capacidade de planejar rotas eficientes para a comida
- **Comportamento evasivo**: Habilidade de evitar situações sem saída

### 3. Memória Implícita

Embora a rede neural implementada seja feed-forward sem memória explícita, certos padrões de pesos podem criar:

- **Tendências de movimento**: Preferência por determinadas direções ou padrões
- **Resposta a configurações específicas**: Reconhecimento implícito de situações comuns

## Operações Genéticas

### Inicialização

O genoma inicial é gerado aleatoriamente (distribuição uniforme no intervalo [-1, 1]), criando agentes com comportamentos iniciais diversos.

### Crossover (Recombinação)

O crossover combina genomas de dois agentes "pais" para criar um novo agente "filho":

1. **Crossover de Ponto Único**: Seleciona um ponto aleatório no genoma e combina a primeira parte de um pai com a segunda parte do outro
2. **Crossover por Cromossomo**: Nas implementações mais avançadas, seleciona grupos inteiros de pesos (correspondentes a camadas específicas) de cada pai

### Mutação

A mutação introduz pequenas variações aleatórias no genoma:

1. **Taxa de Mutação**: Probabilidade de cada gene ser mutado (tipicamente 0.1 ou 10%)
2. **Força da Mutação**: Magnitude da variação quando ocorre uma mutação (tipicamente distribuição normal com σ = 0.2)
3. **Clipping**: Os valores são mantidos no intervalo [-1, 1] para garantir estabilidade

## Expressão do Genoma

O genoma é "expresso" quando:

1. É carregado na rede neural do agente
2. A rede neural processa as entradas sensoriais
3. As saídas da rede determinam a ação (direção de movimento) do agente

## Avaliação do Fitness (Aptidão)

O sucesso do genoma é avaliado através do desempenho do agente no jogo:

1. **Pontuação primária**: Quantidade de comida consumida (principal objetivo)
2. **Eficiência energética**: Relação entre energia restante e passos realizados
3. **Tempo de sobrevivência**: Capacidade de evitar a morte por período prolongado

## Implementação Técnica

No código, o genoma é gerenciado através das seguintes classes:

1. `AgentGene`: Representa uma parte funcional do genoma (ex: pesos entre camadas específicas)
2. `AgentDNA`: Gerencia o genoma completo, incluindo operações de crossover e mutação
3. `Agent`: Contém o genoma e a rede neural associada, aplicando o comportamento codificado

## Conclusão

O genoma no algoritmo genético do Snake é uma representação numérica completa do comportamento do agente, codificando os pesos e vieses da rede neural que traduz percepções em ações. Através de operações de seleção, crossover e mutação, o algoritmo evolui populações de agentes cada vez mais adaptados ao desafio de maximizar pontuação no jogo enquanto evita colisões.

Esta abordagem demonstra o poder dos algoritmos genéticos em desenvolver soluções eficazes para problemas complexos de tomada de decisão, sem necessidade de programação explícita do comportamento desejado.

# Diagramas do Genoma do Agente Snake

Este documento contém diagramas que ilustram a estrutura do genoma do agente Snake e como ele se relaciona com a rede neural.

## 1. Estrutura do Genoma

```mermaid
graph LR
    subgraph Genoma
        W_ih[Pesos Entrada-Oculta\n384 valores]
        B_h[Vieses Oculta\n16 valores]
        W_ho[Pesos Oculta-Saída\n64 valores]
        B_o[Vieses Saída\n4 valores]
    end
    
    W_ih --> B_h --> W_ho --> B_o
    
    %% Tamanhos
    subgraph Dimensões
        input[Entrada\n24 neurônios]
        hidden[Oculta\n16 neurônios]
        output[Saída\n4 neurônios]
    end
    
    %% Cálculos
    calc1["input_size × hidden_size\n24 × 16 = 384"] -.-> W_ih
    calc2["hidden_size\n16"] -.-> B_h
    calc3["hidden_size × output_size\n16 × 4 = 64"] -.-> W_ho
    calc4["output_size\n4"] -.-> B_o
```

## 2. Mapeamento do Vetor para a Rede Neural

```mermaid
graph TD
    subgraph "Vetor Genoma [468 valores]"
        g1[0...383: Pesos Entrada-Oculta]
        g2[384...399: Vieses da Camada Oculta]
        g3[400...463: Pesos Oculta-Saída]
        g4[464...467: Vieses da Camada Saída]
    end
    
    subgraph "Rede Neural"
        subgraph "Camada de Entrada"
            i1[Neurônio 1]
            i2[Neurônio 2]
            i3[...]
            i4[Neurônio 24]
        end
        
        subgraph "Camada Oculta"
            h1[Neurônio 1]
            h2[Neurônio 2]
            h3[...]
            h4[Neurônio 16]
        end
        
        subgraph "Camada de Saída"
            o1[Cima]
            o2[Direita] 
            o3[Baixo]
            o4[Esquerda]
        end
    end
    
    g1 --> |Reshape 24×16| i1 & i2 & i3 & i4 --> h1 & h2 & h3 & h4
    g2 --> |Bias| h1 & h2 & h3 & h4 --> o1 & o2 & o3 & o4
    g3 --> |Reshape 16×4| h1 & h2 & h3 & h4 --> o1 & o2 & o3 & o4
    g4 --> |Bias| o1 & o2 & o3 & o4
```

## 3. Fluxo de Informação: Do Ambiente à Decisão

```mermaid
flowchart LR
    subgraph "Ambiente"
        obs[Obstáculos]
        food[Comida]
        pos[Posição]
    end
    
    subgraph "Sensores [24 valores]"
        s1["8 Direções × 3 Variáveis"]
        
        subgraph "Para cada direção"
            sv1[Distância Obstáculo]
            sv2[Presença Comida]
            sv3[Perigo Iminente]
        end
    end
    
    subgraph "Genoma [468 valores]"
        genome["Pesos + Vieses"]
    end
    
    subgraph "Rede Neural"
        nn["Função f(sensores, genoma)"]
    end
    
    subgraph "Decisão [4 valores]"
        d1[Cima]
        d2[Direita]
        d3[Baixo]
        d4[Esquerda]
    end
    
    subgraph "Ação"
        action["Direção Escolhida\n(maior valor)"]
    end
    
    obs & food & pos --> s1
    s1 --> |"Entradas"| nn
    genome --> |"Define comportamento"| nn
    nn --> d1 & d2 & d3 & d4
    d1 & d2 & d3 & d4 --> |"argmax()"| action
```

## 4. Operações Genéticas

```mermaid
graph TD
    subgraph "Operações no Genoma"
        init["Inicialização\nValores aleatórios [-1, 1]"]
        
        subgraph "Crossover"
            cross1["Ponto Único"]
            cross2["Por Cromossomo"]
        end
        
        subgraph "Mutação"
            mut1["Probabilidade: ~10%"]
            mut2["Magnitude: N(0, 0.2)"]
            mut3["Clipping: [-1, 1]"]
        end
        
        subgraph "Seleção"
            sel1["Baseada em Fitness"]
            sel2["Métodos: Torneio, Roleta"]
        end
    end
    
    init --> cross1 & cross2
    cross1 & cross2 --> mut1 --> mut2 --> mut3
    mut3 --> sel1 --> sel2
    
    result["Evolução do Comportamento\nao Longo das Gerações"]
    
    sel2 --> result
```

## 5. Expressão dos Genes - Comportamentos Específicos

```mermaid
graph LR
    subgraph "Grupos de Genes"
        g1["Genes para Detecção\nde Obstáculos"]
        g2["Genes para Busca\nde Comida"]
        g3["Genes para Evitar\nArmadilhas"]
        g4["Genes para Tomada\nde Decisão"]
    end
    
    subgraph "Comportamentos Codificados"
        b1["Desvio de Colisões"]
        b2["Navegação Eficiente"]
        b3["Planejamento de Rota"]
        b4["Respostas a Situações\nEspecíficas"]
    end
    
    g1 --> b1
    g2 --> b2
    g3 --> b3
    g4 --> b4
    
    fitness["Fitness Total\n= f(comida, eficiência, sobrevivência)"]
    
    b1 & b2 & b3 & b4 --> fitness
```

