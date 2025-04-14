# language: pt

Funcionalidade: Configuração e Controle de Treinamento
  Como um usuário do sistema
  Eu quero configurar e controlar o treinamento de algoritmos genéticos
  Para que eu possa treinar modelos de IA para o jogo da cobrinha

  Contexto:
    Dado que estou na página do painel de treinamento

  Cenário: Visualizar formulário de configuração de treinamento
    Quando eu clico no botão "Novo Treino"
    Então eu devo ver o formulário de configuração de treinamento
    E o formulário deve conter os campos:
      | campo                  |
      | Número de Épocas       |
      | Tamanho da População   |
      | Taxa de Mutação        |
      | Taxa de Crossover      |
      | Elitismo               |
      | Jogos por Agente       |
    E o formulário deve conter os botões:
      | botão               |
      | Iniciar Treinamento |
      | Cancelar            |

  Cenário: Iniciar treinamento com parâmetros válidos
    Quando eu clico no botão "Novo Treino"
    E eu preencho os seguintes campos:
      | campo                  | valor |
      | Número de Épocas       | 100   |
      | Tamanho da População   | 80    |
      | Taxa de Mutação        | 0.2   |
      | Taxa de Crossover      | 0.8   |
      | Elitismo               | 0.1   |
      | Jogos por Agente       | 3     |
    E eu clico no botão "Iniciar Treinamento"
    Então uma requisição para iniciar o treinamento deve ser enviada à API
    E eu devo ver a mensagem "Treinamento iniciado com sucesso!"
    E eu devo ver a seção de progresso do treinamento

  Cenário: Tentar iniciar treinamento com parâmetros inválidos
    Quando eu clico no botão "Novo Treino"
    E eu preencho os seguintes campos:
      | campo                  | valor |
      | Número de Épocas       | -10   |
      | Tamanho da População   | 0     |
    E eu clico no botão "Iniciar Treinamento"
    Então o formulário não deve ser enviado devido a validação HTML5
    E nenhuma requisição deve ser enviada à API

  Cenário: Iniciar e pausar treinamento
    Dado que tenho um treinamento em execução
    Quando eu clico no botão "Pausar Treinamento"
    Então uma requisição para pausar o treinamento deve ser enviada à API
    E eu devo ver a mensagem "Treinamento pausado com sucesso!"
    E o status do treinamento deve mudar para "Pausado"

  Cenário: Continuar treinamento pausado
    Dado que tenho um treinamento pausado
    Quando eu clico no botão "Continuar Treinamento"
    Então uma requisição para continuar o treinamento deve ser enviada à API
    E eu devo ver a mensagem "Treinamento continuado com sucesso!"
    E o status do treinamento deve mudar para "Em execução"

  Cenário: Salvar estado atual do treinamento
    Dado que tenho um treinamento em execução
    Quando eu clico no botão "Salvar Treinamento"
    Então uma requisição para salvar o treinamento deve ser enviada à API
    E eu devo ver a mensagem "Treinamento salvo com sucesso!"

  Cenário: Parar treinamento em execução
    Dado que tenho um treinamento em execução
    Quando eu clico no botão "Parar Treinamento"
    Então uma requisição para parar o treinamento deve ser enviada à API
    E eu devo ver a mensagem "Treinamento parado com sucesso!"
    E o painel deve voltar ao estado inicial

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

Funcionalidade: Tratamento de Erros na Interface de Treinamento
  Como um usuário do sistema
  Eu quero receber feedback sobre erros que ocorrem durante o treinamento
  Para poder tomar ações corretivas

  Contexto:
    Dado que estou na página do painel de treinamento

  Cenário: Tratamento de erro ao iniciar treinamento
    Quando eu clico no botão "Novo Treino"
    E eu preencho os campos do formulário com valores válidos
    E o servidor retorna um erro ao tentar iniciar o treinamento
    Então eu devo ver uma mensagem de erro informativa
    E o formulário de treinamento deve continuar visível

  Cenário: Tratamento de erro ao pausar treinamento
    Dado que tenho um treinamento em execução
    Quando eu clico no botão "Pausar Treinamento"
    E o servidor retorna um erro ao tentar pausar o treinamento
    Então eu devo ver uma mensagem de erro informativa
    E o treinamento deve continuar em execução

  Cenário: Tratamento de erro ao salvar treinamento
    Dado que tenho um treinamento em execução
    Quando eu clico no botão "Salvar Treinamento"
    E o servidor retorna um erro ao tentar salvar o treinamento
    Então eu devo ver uma mensagem de erro informativa 