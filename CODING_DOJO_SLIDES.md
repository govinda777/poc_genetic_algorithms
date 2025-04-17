---
marp: true
theme: default
paginate: true
---

# Coding Dojo
## Aprendendo juntos através da prática colaborativa

---

# O que é um Coding Dojo?

- Ambiente de aprendizado colaborativo
- Inspirado nas artes marciais: local de prática e aperfeiçoamento
- Desenvolvedores resolvem problemas juntos
- Foco em boas práticas e técnicas de programação
- Aprendizado através da colaboração

---

# Dinâmica do Dojo

1. **Piloto**: Pessoa que está programando
2. **Copiloto**: Pessoa que auxilia o piloto
3. **Plateia**: Observa e contribui com ideias

![Dojo dinâmica](https://i.imgur.com/123abc.png)

---

# Regras do Dojo

- Rodízio a cada 5-7 minutos
- Piloto → Plateia
- Copiloto → Piloto
- Alguém da plateia → Copiloto
- Todos participam
- Comunicação constante
- Respeito às ideias de todos
- Foco em aprender, não em terminar rápido

---

# TDD: Test-Driven Development

1. Escreva um teste que falha
2. Faça o teste passar (código mínimo)
3. Refatore o código

![Ciclo TDD](https://i.imgur.com/456def.png)

---

# Nosso Projeto

- Algoritmos Genéticos para otimização
- Resolução de problemas complexos através de evolução simulada
- Conceitos: população, seleção, crossover, mutação
- Aplicação em problemas reais

---

# O Desafio

> Caixeiro Viajante
- [ ] Implementar um algoritmo genético para resolver o problema do caixeiro viajante
- [ ] Encontrar o caminho mais curto que passa por todas as cidades
- [ ] Avaliar diferentes estratégias de seleção e mutação
- [ ] Visualizar a evolução das soluções

> Snake Game (AI)
- [ ] Implementar um algoritmo genético para o jogo do cobrinha!
- [ ] Treinar o agente para maximizar a pontuação
- [ ] Visualizar a evolução do agente
- [ ] Treinar o agente para maximizar a pontuação em um ambiente mais complexo

---

# Fluxo de Desenvolvimento

1. **Feature files (.feature)**
   - Escrevemos cenários em linguagem natural (Gherkin)
   - Descrevem o comportamento esperado

2. **Step definitions (/steps)**
   - Traduzem os cenários em código executável
   - Conectam a especificação com a implementação

3. **Código de produção**
   - Implementa a funcionalidade real
   - Faz os testes passarem

---

# Exemplo: Feature (.feature)

```gherkin
Feature: Algoritmo Genético para TSP
  
  Scenario: Criação de população inicial
    Given uma lista de 5 cidades com suas coordenadas
    When eu criar uma população inicial de 100 indivíduos
    Then cada indivíduo deve representar um caminho válido
    And a população deve ter diversidade suficiente
```

---

# Exemplo: Step Definitions (/steps)

```javascript
Given('uma lista de {int} cidades com suas coordenadas', function (numCidades) {
  this.cidades = gerarCidadesAleatorias(numCidades);
});

When('eu criar uma população inicial de {int} indivíduos', function (tamPopulacao) {
  this.populacao = new AlgoritmoGenetico(this.cidades).criarPopulacaoInicial(tamPopulacao);
});

Then('cada indivíduo deve representar um caminho válido', function () {
  // Verificações para garantir que cada caminho é válido
});
```

---

# Exemplo: Código de Produção

```javascript
class AlgoritmoGenetico {
  constructor(cidades) {
    this.cidades = cidades;
  }

  criarPopulacaoInicial(tamanho) {
    const populacao = [];
    for (let i = 0; i < tamanho; i++) {
      populacao.push(this.gerarIndividuoAleatorio());
    }
    return populacao;
  }

  gerarIndividuoAleatorio() {
    // Implementação para gerar um caminho aleatório
  }
}
```

---

# Benefícios do Coding Dojo

- Aprendizado prático e colaborativo
- Melhoria das habilidades técnicas
- Exposição a diferentes abordagens de solução
- Prática de TDD e desenvolvimento ágil
- Troca de conhecimentos entre diferentes níveis de experiência

---

# Vamos começar!

1. Definir o problema
2. Escrever os primeiros cenários (.feature)
3. Implementar as definições de steps
4. Desenvolver o código usando TDD
5. Refatorar e melhorar a solução

---

# Dúvidas?

Agora é a hora de esclarecer qualquer dúvida antes de iniciarmos!
