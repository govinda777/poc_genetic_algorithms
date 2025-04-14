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

  Scenario: Iniciar jogo com configuração avançada
    Given que a configuração avançada está definida
    When eu inicio um novo jogo
    Then o jogo deve iniciar com as configurações avançadas aplicadas

  Scenario: Iniciar jogo com configuração avançada inválida
    Given que a configuração avançada está inválida
    When eu inicio um novo jogo
    Then uma mensagem de erro de configuração deve ser exibida

  Scenario: Iniciar jogo com dificuldade configurada
    Given que a dificuldade está definida como "medio"
    When eu inicio um novo jogo
    Then o jogo deve iniciar no modo "medio"