# Coding Dojo

O projeto poc_genetic_algorithms explora algoritmos genéticos em uma abordagem prática e colaborativa. Ele utiliza a dinâmica de Coding Dojo para promover a prática de programação em grupo, com foco em desenvolvimento orientado por testes (BDD). Os participantes seguem uma estrutura de revezamento entre os papéis de Piloto e Copiloto, dentro de um timebox de 30 minutos, contribuindo para a resolução de problemas de forma iterativa e colaborativa.


## Regras

- [ ] Codificação BDD, passos de bebê 🚼 
- [ ] Escrever primeiro .feature, segundo .steps, terceiro código
- [ ] Enquanto os testes não estiverem passando a plateia não tem o direito de opinar, apenas o Piloto e Copiloto


## Dinâmica 

- Timebox : 30 min
- A cada 5 min alguém da plateia vira Copiloto.
- A cada 5 min o copiloto vira piloto.
- Prerequisites para participar. Ter uma conta no GitHub, Fazer um fork do repositório

---

## Desafios

---

✅ Nível Fácil

1. Visualização da Evolução da Aptidão

Objetivo:  

Benefícios:  

Ferramentas:  


2. Implementar Elitismo

Objetivo:  

Benefícios:  

Implementação:  



---

⚙️ Nível Intermediário

3. Introduzir Mutação Adaptativa

Objetivo:  

Benefícios:  

Implementação:  


4. Implementar Seleção por Torneio

Objetivo:  

Benefícios:  

Implementação:  



---

🔥 Nível Avançado

5. Adicionar Obstáculos Dinâmicos ao Ambiente

Objetivo:  

Benefícios:  

Implementação:  


6. Implementar Competição entre Agentes

Objetivo:  

Benefícios:  

Implementação:  



---

## Desafios

### ✅ Nível Fácil

**1. Visualização da Evolução da Aptidão**
- **Objetivo:** Exibir um gráfico em tempo real da média de aptidão da população a cada geração.
- **Benefícios:** Ajuda a entender o progresso do algoritmo e identificar possíveis estagnações.
- **Ferramentas:** Utilize bibliotecas como `matplotlib` ou `plotly` para a visualização.

**2. Implementar Elitismo**
- **Objetivo:** Garantir que os melhores indivíduos de cada geração sejam preservados na próxima.
- **Benefícios:** Evita a perda de soluções de alta qualidade durante o processo evolutivo.
- **Implementação:** Copiar os top N indivíduos diretamente para a próxima geração antes de aplicar crossover e mutação.

---

### ⚙️ Nível Intermediário

**3. Introduzir Mutação Adaptativa**
- **Objetivo:** Ajustar dinamicamente a taxa de mutação com base na diversidade da população ou na taxa de melhoria da aptidão.
- **Benefícios:** Ajuda a evitar a convergência prematura e mantém a diversidade genética.
- **Implementação:** Aumentar a taxa de mutação quando a melhoria da aptidão entre gerações for pequena.

**4. Implementar Seleção por Torneio**
- **Objetivo:** Selecionar indivíduos para reprodução com base em competições entre subconjuntos aleatórios da população.
- **Benefícios:** Promove uma seleção mais equilibrada, evitando a dominação de poucos indivíduos.
- **Implementação:** Escolher aleatoriamente K indivíduos e selecionar o melhor entre eles para reprodução.

---

### 🔥 Nível Avançado

**5. Adicionar Obstáculos Dinâmicos ao Ambiente**
- **Objetivo:**Modificar o ambiente do agente para incluir obstáculos que mudam de posição ao longo do tempo
- **Benefícios:**Testa a adaptabilidade do algoritmo genético a ambientes não estáticos
- **Implementação:**Atualizar a função de aptidão para penalizar colisões com obstáculos e ajustar a representação do ambiente

**6. Implementar Competição entre Agentes**
- **Objetivo:**Permitir que múltiplos agentes competam entre si em um ambiente compartilhado
- **Benefícios:**Promove a evolução de estratégias mais robustas e adaptativas
- **Implementação:**Desenvolver um sistema de pontuação baseado em desempenho relativo entre agentes

---

### 🧩 Dica para a Dinâmica do Dojo
Divida os participantes em pequenos grupos e atribua a cada um um dos desafios acima, de acordo com o nível de experiênci. Reserve os últimos 5 a 10 minutos para que cada grupo apresente brevemente suas soluções e aprendizado.

Se desejar, posso fornecer exemplos de código ou orientações mais detalhadas para qualquer um desses desafios. 
