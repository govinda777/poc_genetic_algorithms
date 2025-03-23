# Treinamento e Visualização de Agentes

Este documento explica como funciona o processo de treinamento dos agentes através do algoritmo genético e como você pode assistir às partidas dos agentes em tempo real.

## Processo de Treinamento

### Visão Geral

O treinamento dos agentes para jogar o jogo da cobrinha segue um ciclo evolutivo típico de algoritmos genéticos:

1. **Inicialização**: Uma população inicial de agentes é criada com pesos aleatórios
2. **Avaliação**: Cada agente joga partidas e recebe uma pontuação de fitness
3. **Seleção**: Os melhores agentes são selecionados para reprodução
4. **Cruzamento e Mutação**: Novos agentes são criados combinando e mutando genes
5. **Substituição**: A nova geração substitui a anterior
6. **Repetição**: O processo continua até atingir o número máximo de gerações

### Parâmetros de Treinamento

Os principais parâmetros que afetam o treinamento são:

| Parâmetro | Descrição | Valor Recomendado |
|-----------|-----------|-------------------|
| Tamanho da População | Número de agentes por geração | 50-200 |
| Taxa de Mutação | Probabilidade de mutação de genes | 0.05-0.2 |
| Taxa de Cruzamento | Probabilidade de cruzamento entre agentes | 0.7-0.9 |
| Número de Gerações | Limite de gerações para o treinamento | 100-1000 |
| Limite de Energia | Quantidade de movimentos permitidos por partida | 50-200 |
| Partidas por Agente | Número de jogos avaliados por agente | 1-5 |

### Iniciando um Treinamento

#### Via Interface Gráfica

1. Abra a aplicação web no navegador (http://localhost:8000)
2. No painel lateral esquerdo, localize a seção "Novo Treino"
3. Configure os parâmetros desejados nos campos disponíveis
4. Clique no botão "Iniciar Treinamento"
5. O progresso será exibido em tempo real na interface

#### Via Linha de Comando

```bash
# Navegue até o diretório do projeto
cd poc_genetic_algorithms

# Inicie o treinamento com parâmetros padrão
python -m ga.snake_ga_training

# Ou especifique parâmetros personalizados
python -m ga.snake_ga_training --population 100 --mutation 0.1 --generations 500
```

#### Via Código Python

```python
from ga.snake_ga_training import SnakeTraining

# Configurar o treinamento
training = SnakeTraining(
    population_size=100,
    mutation_rate=0.1,
    crossover_rate=0.8,
    max_generations=500,
    energy_limit=100,
    games_per_agent=3
)

# Iniciar o treinamento
training.start()
```

## Visualização de Partidas

### Modos de Visualização

Existem três modos principais para visualizar as partidas dos agentes:

1. **Visualização em Tempo Real**: Assista às partidas enquanto o treinamento ocorre
2. **Replay do Melhor Agente**: Veja o melhor agente de cada geração em ação
3. **Modo Comparativo**: Compare o desempenho de diferentes agentes lado a lado

### Visualização em Tempo Real

Durante o treinamento, as partidas são automaticamente exibidas no painel direito do dashboard. Por padrão, apenas os 3-5 melhores agentes da geração atual são exibidos para economizar recursos.

#### Controles Disponíveis

- **Velocidade de Simulação**: Ajuste a velocidade das partidas com o controle deslizante
- **Filtro de Agentes**: Escolha quais agentes deseja visualizar (melhores, aleatórios, específicos)
- **Alternar Sensores**: Ative/desative a visualização dos sensores do agente
- **Pausa/Continua**: Pause ou continue a simulação das partidas
- **Avançar Frame**: Avance a simulação quadro a quadro quando pausado

### Visualização do Melhor Agente

Para visualizar apenas o melhor agente de cada geração:

1. No dashboard, clique no botão "Melhor Agente" no painel lateral
2. Selecione a geração que deseja visualizar no seletor de gerações
3. Use os controles de reprodução para iniciar, pausar ou reiniciar a simulação
4. Observe os detalhes da rede neural e as estatísticas sendo atualizadas em tempo real

### Modo de Comparação

Para comparar diferentes agentes:

1. Clique no botão "Comparar Agentes" no dashboard
2. Selecione os agentes que deseja comparar (até 4 simultaneamente)
3. Clique em "Iniciar Comparação"
4. As partidas serão exibidas lado a lado, com estatísticas comparativas abaixo

### Opções de Visualização Avançadas

#### Visualização da Rede Neural

Durante as partidas, é possível visualizar o estado interno da rede neural:

1. Selecione um agente em execução
2. Clique no botão "Ver Rede Neural"
3. Um diagrama da rede será exibido, mostrando:
   - Neurônios e suas ativações (representados por cores)
   - Conexões e seus pesos (espessura e cor das linhas)
   - Entrada dos sensores e saída das decisões

#### Mapas de Calor

Para visualizar padrões de movimento e tomada de decisão:

1. Clique em "Mapa de Calor" no menu de visualização
2. Selecione o tipo de mapa:
   - Mapa de Posições (onde o agente passou mais tempo)
   - Mapa de Decisões (quais movimentos foram escolhidos em cada posição)
   - Mapa de Recompensas (onde o agente obteve maior recompensa)

#### Exportação de Vídeos

Para salvar as partidas como vídeos:

1. Selecione o agente que deseja registrar
2. Clique no botão "Gravar Partida"
3. Escolha o formato de vídeo (GIF, MP4)
4. Após a partida, o vídeo será disponibilizado para download

## Exemplo de Fluxo Completo

Aqui está um exemplo de fluxo completo para treinar e visualizar agentes:

1. **Inicie um novo treinamento**:
   - Configure 100 agentes na população
   - Taxa de mutação de 0.1
   - 300 gerações máximas
   
2. **Durante o treinamento**:
   - Observe os melhores agentes jogando no painel direito
   - Acompanhe a evolução do fitness no gráfico
   - Ajuste a velocidade de simulação conforme necessário

3. **Análise após o treinamento**:
   - Selecione "Visualizar Melhor Agente"
   - Compare o melhor agente da geração 1 com o da geração 300
   - Observe como a estratégia evoluiu
   - Exporte o melhor agente para uso futuro

4. **Experimente com diferentes configurações**:
   - Ajuste parâmetros e inicie um novo treinamento
   - Compare resultados com treinamentos anteriores
   - Encontre as configurações ideais para seu caso de uso

## Dicas para Visualização Eficiente

- **Reduza a quantidade de agentes visíveis** durante o treinamento para melhorar o desempenho
- **Aumente a velocidade de simulação** para treinos longos
- **Salve checkpoints regularmente** para analisar a evolução posteriormente
- **Utilize o modo de comparação** para identificar diferenças sutis entre agentes
- **Ative a visualização dos sensores** para entender melhor a tomada de decisão
- **Ajuste o tamanho do tabuleiro** para visualizações mais claras

## Solução de Problemas

| Problema | Possível Solução |
|----------|------------------|
| Simulação muito lenta | Reduza o número de agentes visíveis, desative sensores |
| Agentes ficando presos em loops | Aumente a penalidade por movimentos circulares |
| Visualização da rede neural confusa | Reduza o número de conexões visíveis, filtre por peso |
| Comportamento inconsistente | Aumente o número de partidas por agente para avaliação |
| Travamentos durante visualização | Reduza a complexidade visual, atualize o navegador |

## Próximos Passos

Após dominar a visualização básica, considere:

- Exportar e importar agentes treinados
- Criar competições entre agentes de diferentes treinamentos
- Personalizar a função de fitness para comportamentos específicos
- Experimentar com diferentes arquiteturas de rede neural
- Contribuir com melhorias para o sistema de visualização