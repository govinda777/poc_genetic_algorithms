Feature: Iniciar um Novo Jogo
  Como jogador, desejo iniciar um novo jogo para começar a jogar.

  Scenario: Iniciar jogo com sucesso
    Given que eu estou na tela inicial
    When eu inicio um novo jogo
    Then o jogo deve iniciar e o tabuleiro deve ser exibido

  Scenario: Tentativa de iniciar jogo sem recursos disponíveis
    Given que os recursos do jogo estão indisponíveis
    When eu tento iniciar um novo jogo
    Then uma mensagem de erro deve ser exibida