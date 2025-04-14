# Características Detalhadas do Genoma do Agente Snake

Este documento detalha especificamente como cada componente do genoma influencia o comportamento do agente Snake, complementando a documentação geral sobre genomas no projeto.

## 1. Mapeamento Funcional dos Componentes do Genoma

O genoma do agente é composto por 468 valores (na configuração padrão), que podem ser divididos em quatro grandes componentes funcionais. Cada componente controla aspectos específicos do comportamento do agente:

| Componente | Índices no Vetor | Função Comportamental | Influência Primária |
|------------|------------------|------------------------|---------------------|
| **W_ih** (Pesos Entrada-Oculta) | 0-383 | Processamento Sensorial | Como o agente interpreta informações do ambiente |
| **B_h** (Vieses Camada Oculta) | 384-399 | Limiares de Ativação | Tendências comportamentais base |
| **W_ho** (Pesos Oculta-Saída) | 400-463 | Tomada de Decisão | Como as informações processadas geram ações |
| **B_o** (Vieses Camada Saída) | 464-467 | Preferências Direcionais | Tendência a escolher certas direções |

## 2. Análise Comportamental dos Componentes

### 2.1 Pesos Entrada-Oculta (W_ih)

Estes pesos determinam como o agente processa as informações sensoriais. Cada neurônio na camada oculta recebe informações de todos os 24 sensores, e a força dessas conexões define quais informações são mais relevantes para o agente.

#### Subgrupos Funcionais:

| Subgrupo | Índices Aproximados | Comportamento Controlado |
|----------|---------------------|--------------------------|
| Sensores de Obstáculo | 0-127 | Capacidade de evitar colisões |
| Sensores de Comida | 128-255 | Habilidade de localizar e perseguir comida |
| Sensores de Perigo | 256-383 | Capacidade de reconhecer e evitar situações perigosas |

#### Padrões Comportamentais Específicos:

* **Pesos altos nos sensores frontais**: Agente mais atento ao que está à sua frente
* **Pesos altos nos sensores de comida**: Agente mais agressivo na busca por alimento
* **Pesos altos nos sensores de perigo lateral**: Agente que evita encurralar-se contra paredes

### 2.2 Vieses da Camada Oculta (B_h)

Os vieses da camada oculta estabelecem o limiar de ativação para cada neurônio oculto, funcionando como "configurações de personalidade" que definem tendências comportamentais básicas.

#### Efeitos Comportamentais:

* **Vieses positivos altos**: Neurônios mais facilmente ativados, resultando em agentes mais "reativos"
* **Vieses negativos**: Neurônios que só ativam com estímulos fortes, resultando em agentes mais "cautelosos"
* **Vieses próximos de zero**: Comportamento mais neutro, dependendo principalmente dos pesos

#### Exemplos de Grupos Funcionais:

| Índices | Característica Comportamental |
|---------|-------------------------------|
| 384-387 | Processamento de obstáculos distantes |
| 388-391 | Detecção de oportunidades de comida |
| 392-395 | Planejamento de rotas e navegação |
| 396-399 | Comportamento de emergência/evasão |

### 2.3 Pesos Oculta-Saída (W_ho)

Estes pesos determinam como o processamento das informações sensoriais se traduz em decisões de movimento. Cada neurônio de saída (representando uma direção) recebe conexões de todos os neurônios da camada oculta.

#### Mapeamento Direção-Comportamento:

| Direção | Índices Aproximados | Comportamentos Associados |
|---------|---------------------|---------------------------|
| Cima | 400-415 | Capacidade de navegar para cima, evitar obstáculos acima |
| Direita | 416-431 | Capacidade de navegar para direita, evitar obstáculos à direita |
| Baixo | 432-447 | Capacidade de navegar para baixo, evitar obstáculos abaixo |
| Esquerda | 448-463 | Capacidade de navegar para esquerda, evitar obstáculos à esquerda |

#### Padrões de Conexão Específicos:

* **Conexões fortes entre neurônios de perigo e direções opostas**: Comportamento evasivo eficiente
* **Conexões fortes entre neurônios de comida e direções correspondentes**: Comportamento de perseguição eficiente
* **Balanceamento entre todas as direções**: Agente capaz de navegar de forma flexível

### 2.4 Vieses da Camada de Saída (B_o)

Os vieses da camada de saída estabelecem preferências direcionais básicas do agente, independentemente dos estímulos recebidos.

#### Efeitos nas Preferências Direcionais:

| Viés | Índice | Comportamento Resultante |
|------|--------|--------------------------|
| Cima (alto positivo) | 464 | Preferência por mover-se para cima quando não há estímulos fortes |
| Direita (alto positivo) | 465 | Preferência por mover-se para direita quando não há estímulos fortes |
| Baixo (alto positivo) | 466 | Preferência por mover-se para baixo quando não há estímulos fortes |
| Esquerda (alto positivo) | 467 | Preferência por mover-se para esquerda quando não há estímulos fortes |

## 3. Exemplos de Configurações Genéticas e Comportamentos Resultantes

### 3.1 Agente "Caçador Agressivo"

* **Características do Genoma**:
  * Pesos altos entre sensores de comida e camada oculta
  * Vieses da camada oculta positivos
  * Fortes conexões entre neurônios de detecção de comida e direções correspondentes
  * Vieses de saída balanceados

* **Comportamento Resultante**:
  * Prioriza fortemente a busca por comida
  * Reage rapidamente quando detecta alimento
  * Pode assumir riscos para alcançar comida
  * Movimento eficiente em direção ao alimento

### 3.2 Agente "Sobrevivente Cauteloso"

* **Características do Genoma**:
  * Pesos altos entre sensores de obstáculos/perigo e camada oculta
  * Vieses da camada oculta negativos (exigem estímulos fortes)
  * Fortes conexões entre neurônios de detecção de perigo e direções de evasão
  * Vieses de saída equilibrados

* **Comportamento Resultante**:
  * Prioriza evitar colisões
  * Mantém distância segura das paredes
  * Movimento mais lento e deliberado
  * Menos eficiente na busca por comida, mas sobrevive mais tempo

### 3.3 Agente "Explorador Equilibrado"

* **Características do Genoma**:
  * Pesos balanceados entre todos os tipos de sensores
  * Vieses da camada oculta próximos de zero
  * Conexões oculta-saída distribuídas de forma uniforme
  * Pequeno viés positivo para frente (promove exploração)

* **Comportamento Resultante**:
  * Bom equilíbrio entre busca por comida e evitar obstáculos
  * Explora o ambiente de forma eficiente
  * Adapta-se bem a diferentes situações
  * Desempenho consistente e estável

## 4. Interações Entre Componentes

As características do genoma não funcionam isoladamente; elas interagem para produzir comportamentos complexos:

### 4.1 Sinergias Positivas

* **W_ih para detecção de comida + W_ho para direções apropriadas**:
  * Cria um comportamento eficiente de perseguição de alimento

* **W_ih para detecção de obstáculos + B_h negativos**:
  * Produz comportamento cauteloso perto de paredes e do próprio corpo

### 4.2 Combinações Problemáticas

* **W_ih altos para comida + B_o alto para uma direção específica**:
  * Pode criar fixação em uma direção, mesmo quando subótima

* **W_ih baixos para obstáculos + B_h altamente positivos**:
  * Pode criar agentes que se movem rapidamente para colisões

## 5. Evolução das Características ao Longo das Gerações

Durante o processo evolutivo, observa-se tipicamente:

* **Primeiras gerações**: Genomas aleatórios com comportamentos erráticos
* **Gerações intermediárias**: Desenvolvimento de estratégias básicas de sobrevivência
* **Gerações avançadas**: Refinamento de comportamentos complexos e estratégicos

### Padrões Emergentes Comuns:

1. **Especialização sensorial**: Certos neurônios ocultos se especializam em processar tipos específicos de informação
2. **Circuitos de decisão**: Formação de "mini-circuitos" dentro da rede que processam situações específicas
3. **Compensação comportamental**: Desenvolvimento de estratégias que compensam deficiências em outras áreas

## 6. Visualização de Características em Agentes Treinados

Para visualizar as características comportamentais de um agente específico, o seguinte procedimento pode ser usado:

1. Extrair o genoma do agente
2. Segmentar o genoma nos quatro componentes principais
3. Criar mapas de calor para visualizar a força das conexões
4. Observar o comportamento do agente em diferentes cenários
5. Correlacionar padrões nos pesos com comportamentos observados

---

Este documento fornece uma análise mais granular de como cada parte do genoma influencia aspectos específicos do comportamento do agente, complementando a descrição geral da estrutura e função do genoma. 