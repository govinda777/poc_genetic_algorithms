# language: pt

Funcionalidade: Visualização de Resultados do Treinamento
  Como um usuário do sistema
  Eu quero visualizar os resultados e o progresso do treinamento
  Para acompanhar a evolução dos agentes de IA

  Contexto:
    Dado que estou na página do painel de treinamento
    E tenho um treinamento em execução

  Cenário: Ver informações de progresso do treinamento
    Então eu devo ver a seção "Treinamento em Progresso"
    E eu devo ver as seguintes informações:
      | informação          |
      | Status              |
      | Épocas              |
      | População           |
      | Melhor Fitness      |
      | Fitness Médio       |
      | Tempo de Treinamento|

  Cenário: Visualizar dados detalhados do treinamento
    Então eu devo ver a seção "Resultados do Treinamento"
    E eu devo ver os dados detalhados do treinamento em formato JSON

  Cenário: Visualizar simulação do agente treinado
    Então eu devo ver a seção "Visualização do Agente"
    E eu devo ver um iframe com a simulação do jogo da cobrinha 