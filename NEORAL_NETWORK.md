<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <!-- Título -->
  <text x="300" y="30" font-family="Arial" font-size="20" fill="black">Rede Neural do Agente Snake</text>
  
  <!-- Camada de Entrada -->
  <g>
    <text x="20" y="50" font-family="Arial" font-size="14" fill="black">Camada de Entrada (24 neurônios)</text>
    
    <!-- Grupo: Sensores de Obstáculo -->
    <text x="40" y="80" font-family="Arial" font-size="12" fill="black">Sensores de Obstáculo [1-8]</text>
    <circle cx="100" cy="100" r="5" fill="blue" />
    <circle cx="100" cy="120" r="5" fill="blue" />
    <circle cx="100" cy="140" r="5" fill="blue" />
    <circle cx="100" cy="160" r="5" fill="blue" />
    <circle cx="100" cy="180" r="5" fill="blue" />
    <circle cx="100" cy="200" r="5" fill="blue" />
    <circle cx="100" cy="220" r="5" fill="blue" />
    <circle cx="100" cy="240" r="5" fill="blue" />
    
    <!-- Grupo: Sensores de Comida -->
    <text x="40" y="270" font-family="Arial" font-size="12" fill="black">Sensores de Comida [9-16]</text>
    <circle cx="100" cy="290" r="5" fill="blue" />
    <circle cx="100" cy="310" r="5" fill="blue" />
    <circle cx="100" cy="330" r="5" fill="blue" />
    <circle cx="100" cy="350" r="5" fill="blue" />
    <circle cx="100" cy="370" r="5" fill="blue" />
    <circle cx="100" cy="390" r="5" fill="blue" />
    <circle cx="100" cy="410" r="5" fill="blue" />
    <circle cx="100" cy="430" r="5" fill="blue" />
    
    <!-- Grupo: Sensores de Perigo -->
    <text x="40" y="460" font-family="Arial" font-size="12" fill="black">Sensores de Perigo [17-24]</text>
    <circle cx="100" cy="480" r="5" fill="blue" />
    <circle cx="100" cy="500" r="5" fill="blue" />
    <circle cx="100" cy="520" r="5" fill="blue" />
    <circle cx="100" cy="540" r="5" fill="blue" />
    <circle cx="100" cy="560" r="5" fill="blue" />
    <circle cx="100" cy="580" r="5" fill="blue" />
    <circle cx="100" cy="600" r="5" fill="blue" />
    <circle cx="100" cy="620" r="5" fill="blue" />
  </g>
  
  <!-- Camada Oculta -->
  <g>
    <text x="350" y="50" font-family="Arial" font-size="14" fill="black">Camada Oculta (16 neurônios)</text>
    <circle cx="400" cy="100" r="5" fill="green" />
    <circle cx="400" cy="130" r="5" fill="green" />
    <circle cx="400" cy="160" r="5" fill="green" />
    <circle cx="400" cy="190" r="5" fill="green" />
    <circle cx="400" cy="220" r="5" fill="green" />
    <circle cx="400" cy="250" r="5" fill="green" />
    <circle cx="400" cy="280" r="5" fill="green" />
    <circle cx="400" cy="310" r="5" fill="green" />
    <circle cx="400" cy="340" r="5" fill="green" />
    <circle cx="400" cy="370" r="5" fill="green" />
    <circle cx="400" cy="400" r="5" fill="green" />
    <circle cx="400" cy="430" r="5" fill="green" />
    <circle cx="400" cy="460" r="5" fill="green" />
    <circle cx="400" cy="490" r="5" fill="green" />
    <circle cx="400" cy="520" r="5" fill="green" />
    <circle cx="400" cy="550" r="5" fill="green" />
    
    <!-- Rótulo para vieses -->
    <text x="410" y="580" font-family="Arial" font-size="12" fill="black">Vieses (B_h)</text>
  </g>
  
  <!-- Camada de Saída -->
  <g>
    <text x="650" y="50" font-family="Arial" font-size="14" fill="black">Camada de Saída (4 neurônios)</text>
    <circle cx="700" cy="200" r="5" fill="red" />
    <text x="710" cy="200" font-family="Arial" font-size="12" fill="black">Cima [O1]</text>
    
    <circle cx="700" cy="250" r="5" fill="red" />
    <text x="710" cy="250" font-family="Arial" font-size="12" fill="black">Direita [O2]</text>
    
    <circle cx="700" cy="300" r="5" fill="red" />
    <text x="710" cy="300" font-family="Arial" font-size="12" fill="black">Baixo [O3]</text>
    
    <circle cx="700" cy="350" r="5" fill="red" />
    <text x="710" cy="350" font-family="Arial" font-size="12" fill="black">Esquerda [O4]</text>
    
    <!-- Rótulo para vieses -->
    <text x="700" cy="400" font-family="Arial" font-size="12" fill="black">Vieses (B_o)</text>
  </g>
  
  <!-- Conexões entre camadas (mostrando apenas algumas para não sobrecarregar) -->
  <!-- Conexões Entrada -> Oculta (W_ih) -->
  <g stroke="lightgray" stroke-width="0.3" opacity="0.3">
    <!-- Mostrando apenas algumas conexões representativas -->
    <line x1="100" y1="100" x2="400" y2="100" />
    <line x1="100" y1="100" x2="400" y2="160" />
    <line x1="100" y1="100" x2="400" y2="220" />
    
    <line x1="100" y1="240" x2="400" y2="250" />
    <line x1="100" y1="240" x2="400" y2="310" />
    
    <line x1="100" y1="370" x2="400" y2="370" />
    <line x1="100" y1="370" x2="400" y2="430" />
    
    <line x1="100" y1="560" x2="400" y2="490" />
    <line x1="100" y1="560" x2="400" y2="550" />
  </g>
  
  <!-- Conexões Oculta -> Saída (W_ho) -->
  <g stroke="lightgray" stroke-width="0.4" opacity="0.5">
    <!-- Mostrando apenas algumas conexões representativas -->
    <line x1="400" y1="100" x2="700" y2="200" />
    <line x1="400" y1="160" x2="700" y2="200" />
    
    <line x1="400" y1="220" x2="700" y2="250" />
    <line x1="400" y1="280" x2="700" y2="250" />
    
    <line x1="400" y1="340" x2="700" y2="300" />
    <line x1="400" y1="400" x2="700" y2="300" />
    
    <line x1="400" y1="460" x2="700" y2="350" />
    <line x1="400" y1="520" x2="700" y2="350" />
  </g>
  
  <!-- Legendas -->
  <g>
    <text x="120" y="650" font-family="Arial" font-size="12" fill="black">W_ih: 384 conexões (índices 0-383)</text>
    <text x="120" y="670" font-family="Arial" font-size="12" fill="black">B_h: 16 vieses (índices 384-399)</text>
    <text x="450" y="650" font-family="Arial" font-size="12" fill="black">W_ho: 64 conexões (índices 400-463)</text>
    <text x="450" y="670" font-family="Arial" font-size="12" fill="black">B_o: 4 vieses (índices 464-467)</text>
  </g>
</svg>
 

🧠 Estrutura da Rede Neural

 

[Entradas] → [Camada Oculta] → [Saídas]

📥 Camada de Entrada

 

Direção atual da cobra:  

Posição relativa da comida:  

Perigos nas direções:  


 

🧩 Camadas Ocultas

 

📤 Camada de Saída

 

🧬 Representação Genética

 

🧠 Visualização da Rede Neural

 

 



Fonte: ResearchGate

🔄 Integração com o Agente

 

Se desejar, posso auxiliar na criação de uma visualização personalizada da rede neural do agente ou fornecer mais detalhes sobre sua implementação.


---

## Arquitetura da Rede Neural do Agente Snake

A rede neural do agente Snake possui uma arquitetura de três camadas:

```
[CAMADA DE ENTRADA] --> [CAMADA OCULTA] --> [CAMADA DE SAÍDA]
    (24 sensores)        (16 neurônios)       (4 neurônios)
```

### Detalhamento da Estrutura

**Camada de Entrada (24 sensores)**:
- Divididos em 3 grupos funcionais:
  * Sensores de Obstáculo: detectam paredes e próprio corpo
  * Sensores de Comida: localizam alimento no ambiente
  * Sensores de Perigo: identificam situações arriscadas

**Camada Oculta (16 neurônios)**:
- Cada neurônio recebe conexões de todos os 24 sensores
- Processam e combinam as informações sensoriais
- Possuem vieses (B_h) que funcionam como "configurações de personalidade"

**Camada de Saída (4 neurônios)**:
- Representam as direções possíveis: Cima, Direita, Baixo, Esquerda
- Cada neurônio recebe conexões de todos os 16 neurônios da camada oculta
- Possuem vieses (B_o) que estabelecem preferências direcionais básicas

### Conexões e Pesos

**Conexões Entrada-Oculta (W_ih)**:
- Total de 384 conexões (24×16)
- Índices 0-383 no genoma
- Determinam como o agente processa informações sensoriais

**Vieses da Camada Oculta (B_h)**:
- 16 valores (um para cada neurônio oculto)
- Índices 384-399 no genoma
- Definem limiares de ativação e tendências comportamentais

**Conexões Oculta-Saída (W_ho)**:
- Total de 64 conexões (16×4)
- Índices 400-463 no genoma
- Determinam como o processamento se traduz em decisões de movimento

**Vieses da Camada de Saída (B_o)**:
- 4 valores (um para cada direção)
- Índices 464-467 no genoma
- Estabelecem preferências direcionais básicas

### Fluxo de Processamento

1. Os 24 sensores captam informações do ambiente
2. Essas informações são ponderadas pelos pesos W_ih (0-383)
3. Os 16 neurônios da camada oculta processam as entradas, aplicando seus vieses B_h (384-399)
4. O resultado do processamento é transmitido para a camada de saída através dos pesos W_ho (400-463)
5. Os 4 neurônios de saída, com seus vieses B_o (464-467), produzem valores de ativação
6. A direção com maior valor de ativação é escolhida como próximo movimento do agente

O genoma completo do agente é composto por 468 valores que codificam todos esses pesos e vieses, determinando seu comportamento e estratégia de jogo[1].

Citações:
[1] GENOMA_CARACTERISTICAS.md https://github.com/govinda777/poc_genetic_algorithms/blob/main/GENOMA_CARACTERISTICAS.md
[2] ga%2Fsnake_nn.py https://github.com/govinda777/poc_genetic_algorithms/blob/main/ga%2Fsnake_nn.py
[3] govind https://github.com/govind

