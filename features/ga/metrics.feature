# Language: pt-BR

Feature: Metrics

  Scenario: Calcular o fitness da população
    Given uma população de 100 indivíduos
    And eles jogam 3 partidas
    When o fitness é calculado
    Then o fitness é mostrado na tela
    | Indivíduo | Partidas | Pontos | Mortes | Tempo Total |
    | Indivíduo 1 | 3 | 2 | 10 | 10s |
    | Indivíduo 2 | 3 | 1 | 11 | 15s |
    | Indivíduo 3 | 3 | 0 | 2 | 20s |
    | Indivíduo 4 | 3 | 0 | 2 | 20s |
    | Indivíduo 5 | 3 | 0 | 2 | 20s |
    | Indivíduo 6 | 3 | 0 | 2 | 20s |
    | Indivíduo 7 | 3 | 0 | 2 | 20s |
    | Indivíduo 8 | 3 | 0 | 2 | 20s |
    | Indivíduo 9 | 3 | 0 | 2 | 20s |
