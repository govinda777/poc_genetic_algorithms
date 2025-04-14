# language: pt

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