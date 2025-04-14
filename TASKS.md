# Checklist de Tarefas - POC Algoritmos Genéticos

## Revisão e Refatoração
- [ ] Revisão geral de código 
- [ ] Padronização de nomes de arquivos (snage_agent_gene.py vs snake_agent_gene.py)
- [ ] Completar documentação em todos os arquivos principais

## Melhorias na Rede Neural
- [ ] Permitir configuração de camadas ocultas da rede neural
- [ ] Implementar diferentes funções de ativação configuráveis
- [ ] Otimizar processo de inferência

## Dashboard e Visualização
- [ ] Melhoria na visualização dos dados de treinamento
- [ ] Implementar gráficos comparativos entre sessões de treinamento
- [ ] Visualização da topologia da rede neural do melhor agente
- [ ] Adicionar indicadores visuais de sensores no modo de visualização
- [ ] Implementar controles para ajustar velocidade da simulação

## Integração
- [ ] Finalizar comunicação entre backend e frontend via WebSocket
- [ ] Integrar visualização em tempo real do treinamento
- [ ] Integrar feedbacks visuais durante o processo de treinamento

## Jogo e Simulação
- [ ] Implementar modos de dificuldade variável (obstáculos, tamanho do mapa)
- [ ] Adicionar controles de pausa/continuação da simulação
- [ ] Implementar modo de replay de partidas salvas

## Algoritmo Genético
- [ ] Implementar diferentes estratégias de seleção (roleta, torneio)
- [ ] Adicionar controles de diversidade genética
- [ ] Implementar mecanismos para evitar convergência prematura
- [ ] Implementar diferentes funções de fitness
- [ ] Adicionar métricas de avaliação de performance

## Recursos Avançados
- [ ] Implementar modo multiplayer (duas IAs competindo)
- [ ] Exportar e importar agentes treinados (formato JSON/YAML)
- [ ] Tutorial interativo para novos usuários
- [ ] Implementar sistema de salvamento automático de checkpoints durante o treinamento
- [ ] Adicionar visualização de mapas de calor do movimento dos agentes

## Tarefas Concluídas
- [x] Estrutura básica do projeto
- [x] Implementação do jogo da cobrinha 
- [x] API REST para controle de treinamento
- [x] Algoritmo genético básico funcionando
- [x] Interface web básica para visualização

## Métricas para Implementar
- [ ] Performance do Agente
  - [ ] Melhor pontuação
  - [ ] Tempo médio de sobrevivência
  - [ ] Eficiência de movimento
- [ ] Performance do Treinamento
  - [ ] Tempo médio por geração
  - [ ] Ganho de fitness por geração
  - [ ] Diversidade genética
