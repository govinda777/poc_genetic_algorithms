# language: pt

Funcionalidade: Dashboard de Visualização do Treinamento
  Como um usuário do sistema
  Eu quero visualizar detalhes avançados do agente treinado
  Para compreender melhor seu comportamento e desempenho

  Contexto:
    Dado que estou na página do painel de treinamento
    E tenho um treinamento em execução ou concluído
    E estou visualizando o dashboard de treinamento

  Cenário: Visualizar detalhes do agente
    Quando eu clico na aba "Visualizar Agente"
    Então eu devo ver a seção de detalhes do agente
    E eu devo ver os seguintes detalhes do agente:
      | detalhe               |
      | Geração               |
      | Fitness               |
      | Comida Consumida      |
      | Passos Realizados     |
      | Tempo de Sobrevivência|
    E eu devo ver a simulação do agente em tempo real

  Cenário: Visualizar DNA do agente
    Quando eu clico na aba "Visualizar DNA"
    Então eu devo ver a seção de visualização do DNA
    E eu devo ver a representação gráfica do DNA do agente
    E eu devo ver os valores dos genes exibidos em formato legível
    E eu devo poder identificar os genes ativos e inativos

  Cenário: Visualizar rede neural do agente
    Quando eu clico na aba "Visualizar Rede Neural"
    Então eu devo ver a representação visual da rede neural
    E eu devo ver os neurônios e suas conexões
    E os neurônios ativos devem ser destacados visualmente
    E eu devo ver os pesos das conexões entre neurônios

  Cenário: Alternar entre diferentes visualizações do agente
    Dado que estou visualizando os detalhes do agente
    Quando eu alterno entre as diferentes abas de visualização
    Então cada visualização deve ser atualizada corretamente
    E os dados exibidos devem corresponder ao agente selecionado

  Cenário: Visualizar métricas de desempenho do agente
    Quando eu clico na aba "Métricas de Desempenho"
    Então eu devo ver as seguintes métricas:
      | métrica                        |
      | Melhor pontuação               |
      | Tempo médio de sobrevivência   |
      | Eficiência de movimento        |
      | Taxa de decisões ótimas        |
      | Adaptabilidade a mudanças      |
    E as métricas devem ser apresentadas em formato gráfico
    E devo poder ver a evolução das métricas ao longo do tempo 