# poc_genetic_algorithms

Este é um projeto de prova de conceito (POC) para estudar **algoritmos genéticos** aplicados ao treinamento de AIs em jogos. A ideia central é treinar agentes capazes de jogar (usando as teclas: Cima, Baixo, Esquerda, Direita) através de técnicas evolutivas, inspiradas no vídeo [Rede Neural aprendendo a jogar o jogo da cobrinha (SNAKE)](https://youtu.be/awz1ghokP3k?si=eEdP3qjcGEfEMdqY).

## How to Config Env

1. **Pré-requisitos:**
   - **Node.js** ou qualquer servidor HTTP simples para servir o jogo (ex.: [http-server](https://www.npmjs.com/package/http-server) ou o servidor embutido do Python).
   - Navegador moderno (Chrome, Firefox, etc.).
   - (Opcional) Ambiente Python para rodar scripts de treinamento ou simulações.

2. **Passos de Configuração:**
   - Clone este repositório:
     ```bash
     git clone https://github.com/seu-usuario/poc_genetic_algorithms.git
     ```
   - Instale as dependências (caso utilize Node.js):
     ```bash
     cd poc_genetic_algorithms
     npm install
     ```
   - Inicie o servidor local:
     - Usando Node.js:
       ```bash
       npx http-server .
       ```
     - Ou usando Python (para Python 3):
       ```bash
       python -m http.server 8000
       ```
   - Acesse o jogo abrindo `index.html` no navegador ou navegando para `http://localhost:8000`.

3. **Arquivos de Configuração:**
   - `config.json`: Parâmetros para o algoritmo genético (taxa de mutação, tamanho da população, energia inicial, etc.).
   - `game-config.js`: Configurações específicas do jogo (dimensões do tabuleiro, velocidade da cobrinha, etc.).

## Games List

O projeto atualmente inclui:
- **Snake Game**: O clássico jogo da cobrinha, onde o agente deve coletar alimentos sem colidir com as paredes ou com o próprio corpo.
- *(Possível expansão)*: Outros jogos podem ser integrados para testar diferentes estratégias de treinamento de IA.

## Estrutura do Projeto

- `index.html`: Arquivo principal contendo o jogo em HTML.
- `js/`: Scripts JavaScript com a lógica do jogo e implementação dos algoritmos genéticos.
- `css/`: Folhas de estilo para a interface do jogo.
- `assets/`: Recursos visuais (imagens, ícones, etc.).
- `configs/`: Arquivos de configuração para o jogo e o algoritmo.
- `README.md`: Este arquivo de documentação.

## Resumo do Vídeo "Rede Neural aprendendo a jogar o jogo da cobrinha (SNAKE)"

- Introdução ao projeto, explicando o objetivo de usar uma inteligência artificial para aprender a jogar o clássico jogo da cobrinha. São apresentados os conceitos básicos do jogo e a importância do treinamento.
  
- Apresentação da estratégia do **ciclo hamiltoniano**, que percorre todo o tabuleiro, mas mostra-se ineficiente por exigir milhares de movimentos para concluir uma partida.

- Introdução do conceito de **energia** para limitar os movimentos do agente, evitando loops infinitos. A cobrinha perde energia a cada movimento e a repõe ao consumir comida.

-  Exploração de diferentes abordagens para a "visão" da comida:
  - Uso de coordenadas absolutas (x e y);
  - Distâncias e sensores;
  - Abordagem com **coordenadas polares relativas à cabeça**, que demonstrou ser a mais eficiente e generalizável para tabuleiros de diferentes tamanhos.

-  Inicialmente, a rede neural é treinada com dois inputs: distância e ângulo até a comida. Testes revelam que, em alguns casos, apenas o ângulo já é suficiente para a IA aprender a perseguição, melhorando a generalização.

- Com o aumento do tamanho da cobrinha, são adicionados sensores (em 8 direções) para detectar obstáculos (parede e o próprio corpo), permitindo que a IA adapte sua estratégia e evite colisões.

- No modo completo (comida + obstáculos), a avaliação de desempenho é feita em três partidas por geração para reduzir variações aleatórias na pontuação, garantindo uma avaliação mais robusta do comportamento do agente.

- Ajustes na pontuação, incorporando a energia restante para incentivar movimentos mais curtos e eficientes, resultando em estratégias como zigue-zague e varredura de ciclo.

- Simplificação da rede neural (remoção de sensores de distância) demonstra que uma configuração mais enxuta pode levar a melhor performance, com a cobrinha alcançando recordes de desempenho (até 176 comidas coletadas).

## Futuras Melhorias

- Adicionar novos jogos e desafios (obstáculos, teletransportes, etc.) para diversificar os cenários de treinamento.
- Refinar os parâmetros do algoritmo genético para melhorar a convergência e o desempenho da IA.
- Integrar métodos híbridos (ex.: aprendizagem por reforço) para complementar os algoritmos genéticos.

## License

Este projeto está licenciado sob a [MIT License](LICENSE).

---

*Sinta-se à vontade para contribuir com melhorias ou reportar problemas. Qualquer dúvida ou sugestão, entre em contato!*
