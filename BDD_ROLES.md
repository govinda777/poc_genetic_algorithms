# Papéis em BDD (Behavior-Driven Development)

## O que é BDD?

BDD (Behavior-Driven Development) é uma abordagem de desenvolvimento que:

- Incentiva a colaboração entre desenvolvedores, QA e stakeholders não técnicos
- Foca no comportamento esperado do software do ponto de vista do usuário
- Usa linguagem natural estruturada (Gherkin) para descrever o comportamento
- Conecta especificações de comportamento com código automatizado

## Papéis Principais no BDD

### Product Owner / Cliente

**Responsabilidades:**
- Definir o valor de negócio das funcionalidades
- Priorizar histórias de usuário
- Descrever o comportamento esperado
- Validar se a implementação atende às necessidades

**No Coding Dojo:**
- Pode ser representado por um participante que assume esse papel
- Responde perguntas sobre regras de negócio
- Valida se as implementações atendem aos requisitos

### Analista de Negócios / QA

**Responsabilidades:**
- Traduzir requisitos de negócio em cenários Gherkin
- Garantir que os cenários sejam claros e testáveis
- Colaborar com desenvolvedores para refinar os cenários
- Verificar se todos os cenários relevantes foram considerados

**No Coding Dojo:**
- Ajuda a escrever os cenários em formato Gherkin
- Questiona edge cases e cenários alternativos
- Garante que os testes cubram os comportamentos esperados

### Desenvolvedor

**Responsabilidades:**
- Implementar o código que satisfaz os cenários
- Criar step definitions que conectam os cenários ao código
- Refatorar o código mantendo os testes passando
- Colaborar com QA e PO para esclarecer requisitos

**No Coding Dojo:**
- Implementa as features usando TDD
- Escreve as step definitions
- Refatora código conforme necessário

## O Ciclo BDD no Coding Dojo

1. **Discussão (Three Amigos)**
   - Entender o problema e os requisitos
   - Identificar cenários relevantes
   - Alinhar expectativas entre todos os papéis

2. **Escrita de Cenários**
   - Criar arquivos .feature com cenários Gherkin
   - Focar na perspectiva do usuário
   - Usar linguagem ubíqua do domínio

3. **Implementação dos Steps**
   - Criar definições para cada passo dos cenários
   - Conectar linguagem natural com código executável

4. **Implementação da Funcionalidade**
   - Escrever o código mínimo para fazer os testes passarem
   - Seguir o ciclo TDD: Red-Green-Refactor

5. **Refatoração**
   - Melhorar o código sem alterar seu comportamento
   - Garantir que todos os testes continuam passando

## Formato Gherkin

```gherkin
Feature: [Título da Funcionalidade]
  Como um [papel]
  Eu quero [funcionalidade]
  Para que [benefício]

  Scenario: [Título do Cenário]
    Given [contexto inicial]
    When [evento ou ação]
    Then [resultado esperado]
    And [resultado adicional]
```

## Exemplo Prático: Algoritmo Genético

```gherkin
Feature: Algoritmo Genético para Problema do Caixeiro Viajante
  Como um otimizador de rotas
  Eu quero usar algoritmos genéticos
  Para encontrar o caminho mais curto que passa por todas as cidades

  Scenario: Criação de população inicial válida
    Given uma lista de 10 cidades com suas coordenadas
    When eu criar uma população inicial de 100 indivíduos
    Then cada indivíduo deve representar um caminho válido
    And a população deve ter diversidade genética

  Scenario: Evolução da população ao longo das gerações
    Given uma população inicial com 100 indivíduos
    When executar o algoritmo por 50 gerações
    Then a aptidão do melhor indivíduo na geração final deve ser maior que na geração inicial
```

## Melhores Práticas

1. **Linguagem**:
   - Use linguagem simples e clara
   - Evite termos técnicos desnecessários
   - Foque no "o quê" e não no "como"

2. **Cenários**:
   - Mantenha cenários curtos e focados
   - Um cenário por comportamento
   - Independência entre cenários

3. **Step Definitions**:
   - Reutilize steps quando possível
   - Mantenha as definições simples e atômicas
   - Use expressões regulares ou parâmetros para flexibilidade

4. **Colaboração**:
   - Envolva todos os papéis na escrita dos cenários
   - Use sessões de refinamento para melhorar os cenários
   - Priorize a comunicação sobre documentação extensa

## Aplicação no Coding Dojo

1. **Alternância de Papéis**:
   - Rode os papéis para que todos experimentem cada perspectiva
   - 5-7 minutos por rodada é recomendado

2. **Escrita Colaborativa**:
   - Comece escrevendo os cenários em grupo
   - Discuta critérios de aceitação antes de codificar

3. **Desenvolvimento Incremental**:
   - Implemente um cenário por vez
   - Celebre cada cenário implementado com sucesso

4. **Reflexão**:
   - Ao final, discuta o que funcionou e o que pode melhorar
   - Identifique padrões e antipadrões observados

## Lembre-se

- BDD não é sobre ferramentas, mas sobre comunicação
- O objetivo é criar um entendimento compartilhado
- Cenários são especificações executáveis, não apenas testes
- A colaboração é mais importante que a documentação perfeita
