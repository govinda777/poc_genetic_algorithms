# Documentação: Passos dos Agentes para Iniciar uma Partida

Este documento descreve o processo completo que os agentes realizam para iniciar, executar e finalizar uma partida.

## Fluxo do Processo

### 1. Iniciar uma partida
- O agente executa e interage com o jogo
- Comando: `open game/snake_game.html?agent_id={agent_id}`
- O parâmetro `agent_id` identifica unicamente o agente que está jogando

### 2. Processo de transmissão da partida
- Inicia-se a captura dos estados do jogo
- Os movimentos e decisões do agente são registrados em tempo real
- Os dados são transmitidos para processamento

### 3. Coleta e processamento de dados
- Durante a partida, métricas de performance são coletadas:
  - Pontuação
  - Tempo de jogo
  - Padrões de movimento
  - Colisões
- Os dados são processados para avaliação do agente

### 4. Armazenamento de dados
- Todos os dados da partida são salvos no arquivo `snake_ga_data.py`
- Este arquivo mantém o histórico de desempenho para análise posterior

### 5. Finalização da partida
- A partida termina quando o agente perde ou atinge um objetivo específico
- O sistema registra o resultado final
- Os recursos são liberados para a próxima execução

## Observações Importantes

* Cada agente possui um ID único para rastreamento de desempenho
* Os dados coletados são utilizados para otimização dos algoritmos genéticos
* Múltiplos agentes podem jogar em sequência para treinamento em lote
