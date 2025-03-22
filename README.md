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

Perfeito! Agora que você está organizando sua POC em `/game`, `/ga` e `/dashboard`, podemos estruturar um **plano passo a passo** para montar um projeto robusto e modular, inspirado diretamente no vídeo do Universo Programado.

---

## 📐 Estrutura Geral do Projeto

```
poc_genetic_algorithms/
├── /game/            # Jogo da cobrinha (interface HTML + JS)
│   └── snake_game.html
│   └── snake.js
│   └── assets/
│
├── /ga/              # Lógica genética e neural (em Python)
│   └── snake_ga.py
│   └── snake_ga_data.py
│   └── snake_ga_training.py
│
├── /dashboard/       # Frontend do painel com React
│   ├── index.jsx
│   ├── core.jsx
│   ├── side_left.jsx
│   ├── side_right.jsx
│   ├── footer.jsx
│   ├── service.js     # Comunicação com GA ou leitura de arquivos
│
├── /components/      # Componentes React reutilizáveis
│   └── chart.jsx
│   └── progressBar.jsx
│
├── /data/            # (opcional) JSONs exportados do GA
├── README.md
└── requirements.txt  # dependências Python
```

---

## ✅ Etapas do Desenvolvimento

### 1. 🎮 `/game/` — Criar o jogo da cobrinha

**Objetivo:** versão visual do jogo onde o agente pode ser testado de forma interativa.

#### Etapas:
1. Criar `snake_game.html` com `<canvas>` e controles básicos.
2. Criar `snake.js` com:
   - Grid 25x25
   - Cobrinha (movimento, colisão, crescimento)
   - Geração de comida aleatória
   - Hooks para leitura de estado: `getSnakeState()` e `applyAction()`
3. Adicionar visualização opcional da direção/ângulo (como no vídeo).
4. Exportar função de `step()` para que o GA possa interagir com o jogo via socket ou API futuramente.

---

### 2. 🧬 `/ga/` — Algoritmo genético com Python

**Objetivo:** Treinar redes neurais com sensores, usando algoritmos genéticos.

#### Arquivos e funções:

#### `snake_ga.py`
- Criação da população
- Codificação da rede neural (vetor de pesos)
- Seleção, crossover, mutação
- Sensores: 
  - distância
  - ângulo
  - sensores em 8 direções
- Avaliação de fitness baseada em:
  - número de comidas
  - energia restante
  - quantidade de movimentos úteis

#### `snake_ga_training.py`
- Regras do treino
- Geração de partidas (N partidas por agente)
- Controle de tempo e energia
- Loop principal do GA

#### `snake_ga_data.py`
- Exportação de:
  - fitness por geração
  - diversidade estimada
  - maior tamanho por geração
  - melhor agente de cada geração (em `.json` ou `.csv`)
- Função para `save_training_session()` para alimentar o dashboard

---

### 3. 🧩 `/dashboard/` — Painel de controle em React

**Objetivo:** Visualizar, em tempo real ou pós-treino, o progresso do aprendizado da IA.

#### Componentes sugeridos:

- `core.jsx`: carrega os dados e distribui nos lados.
- `side_left.jsx`: mostra:
  - Geração
  - Número de indivíduos vivos
  - Diversidade (%)
  - Tempo treinando
- `side_right.jsx`: mostra:
  - Melhor indivíduo (rede neural desenhada)
  - Tamanho e Energia
  - Fitness
- `chart.jsx`: renderiza o gráfico de evolução de fitness/diversidade com Chart.js
- `footer.jsx`: créditos, link para código, etc.
- `service.js`: faz fetch de dados locais ou via websocket/api REST para o GA

---

## 🚀 Roteiro de Desenvolvimento

| Etapa | Tarefa | Pasta | Ferramenta |
|-------|--------|-------|------------|
| 1 | Criar o jogo jogável | `/game` | HTML, JS, Canvas |
| 2 | Criar função `get_state()` e `apply_action()` | `/game` | JS |
| 3 | Implementar rede neural simples (com vetor de pesos) | `/ga` | Python |
| 4 | Criar população inicial e loop do GA | `/ga` | Python |
| 5 | Implementar sensores (distância + ângulo) | `/ga` | Python |
| 6 | Implementar função de `fitness` | `/ga` | Python |
| 7 | Adicionar diversidade e melhor indivíduo por geração | `/ga` | Python |
| 8 | Exportar dados por geração (`json/csv`) | `/ga` | Python |
| 9 | Criar layout do dashboard React | `/dashboard` | ReactJS |
|10 | Integrar `service.js` com JSONs do GA | `/dashboard` | fetch/localStorage |
|11 | Visualizar dados com `chart.jsx` | `/components` | Chart.js |
|12 | Desenhar rede neural do melhor agente | `/dashboard/side_right.jsx` | Canvas ou SVG |
|13 | Opcional: conectar `dashboard` com `GA` ao vivo via socket | full stack | WebSocket/REST |

---

### 🧠 Extras para o Futuro

- **Replay de partidas salvas**
- **Treinamento online via WebWorker/WebSocket**
- **Troca de arquitetura da rede via config**
- **Modo multiplayer (duas IAs competindo)**
- **Salvar/carrear o melhor agente**

## License

Este projeto está licenciado sob a [MIT License](LICENSE).

---

*Sinta-se à vontade para contribuir com melhorias ou reportar problemas. Qualquer dúvida ou sugestão, entre em contato!*
