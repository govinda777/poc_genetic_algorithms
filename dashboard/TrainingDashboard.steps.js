const { Given, When, Then, Before } = require('@cucumber/cucumber');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const React = require('react');
const expect = require('expect');
const TrainingDashboard = require('./TrainingDashboard').default;

// Mock fetch API
global.fetch = jest.fn();

// Helper para configurar respostas mock do fetch
const mockFetchResponse = (status, data) => {
  global.fetch.mockResolvedValueOnce({
    json: async () => ({ status, ...data }),
    ok: status === 'success'
  });
};

// Estado compartilhado entre os steps
let component;

// Hooks para configuração e limpeza
Before(() => {
  global.fetch.mockClear();
  
  // Configure um mock padrão para o endpoint de status
  global.fetch.mockImplementation((url) => {
    if (url === '/api/train/status') {
      return Promise.resolve({
        json: () => Promise.resolve({
          active: true,
          paused: false,
          data: {
            current: {
              generation: 5,
              best_fitness: 100,
              avg_fitness: 50,
              training_time: '00:05:30'
            }
          }
        })
      });
    }
    return Promise.resolve({
      json: () => Promise.resolve({ status: 'success' })
    });
  });
});

// Steps para o contexto
Given('que estou na página do painel de treinamento', function() {
  component = render(<TrainingDashboard />);
  expect(screen.getByText('Painel de Treinamento')).toBeInTheDocument();
});

Given('que tenho um treinamento em execução', async function() {
  // Primeiro renderizar o componente
  component = render(<TrainingDashboard />);
  
  // Abrir o formulário e iniciar treinamento
  fireEvent.click(screen.getByText('Novo Treino'));
  
  // Configurar o mock para iniciar com sucesso
  mockFetchResponse('success', { message: 'Training started in the background' });
  
  // Clicar no botão para iniciar treinamento
  fireEvent.click(screen.getByText('Iniciar Treinamento'));
  
  // Esperar que o treinamento inicie
  await waitFor(() => {
    expect(screen.getByText('Treinamento em Progresso')).toBeInTheDocument();
  });
});

Given('que tenho um treinamento pausado', async function() {
  // Primeiro configuramos um treinamento em execução
  await Given('que tenho um treinamento em execução');
  
  // Configurar o mock para indicar estado pausado
  global.fetch = jest.fn().mockImplementation((url) => {
    if (url === '/api/train/status') {
      return Promise.resolve({
        json: () => Promise.resolve({
          active: true,
          paused: true,
          data: {
            current: {
              generation: 5,
              best_fitness: 100,
              avg_fitness: 50,
              training_time: '00:05:30'
            }
          }
        })
      });
    }
    return Promise.resolve({
      json: () => Promise.resolve({ status: 'success' })
    });
  });
  
  // Simular a atualização do componente com o novo estado
  component.rerender(<TrainingDashboard />);
});

Given('tenho um treinamento em execução ou concluído', async function() {
  // Reutilizamos o step para um treinamento em execução
  await Given('que tenho um treinamento em execução');
});

Given('estou visualizando o dashboard de treinamento', function() {
  // Verificar se estamos vendo o dashboard de treinamento
  expect(screen.getByText('Treinamento em Progresso')).toBeInTheDocument();
});

Given('que estou visualizando os detalhes do agente', async function() {
  // Primeiro certificamos que estamos no dashboard
  await Given('estou visualizando o dashboard de treinamento');
  
  // Garantir que a aba de visualização do agente está ativa
  fireEvent.click(screen.getByText('Visualizar Agente'));
  
  // Verificar se estamos na visualização correta
  expect(screen.getByText('Detalhes do Agente')).toBeInTheDocument();
});

// Steps para ações
When('eu clico no botão {string}', function(buttonText) {
  fireEvent.click(screen.getByText(buttonText));
});

When('eu preencho os seguintes campos:', function(dataTable) {
  // Converter a tabela em um array de objetos
  const campos = dataTable.hashes();
  
  // Preencher cada campo na tabela
  campos.forEach(campo => {
    fireEvent.change(screen.getByLabelText(`${campo.campo}:`), { 
      target: { value: campo.valor } 
    });
  });
});

When('eu preencho os campos do formulário com valores válidos', function() {
  fireEvent.change(screen.getByLabelText('Número de Épocas:'), { target: { value: '100' } });
  fireEvent.change(screen.getByLabelText('Tamanho da População:'), { target: { value: '100' } });
  fireEvent.change(screen.getByLabelText('Taxa de Mutação:'), { target: { value: '0.1' } });
  fireEvent.change(screen.getByLabelText('Taxa de Crossover:'), { target: { value: '0.7' } });
  fireEvent.change(screen.getByLabelText('Elitismo:'), { target: { value: '0.1' } });
  fireEvent.change(screen.getByLabelText('Jogos por Agente:'), { target: { value: '3' } });
});

When('o servidor retorna um erro ao tentar iniciar o treinamento', function() {
  global.fetch.mockClear();
  mockFetchResponse('error', { message: 'Erro ao iniciar treinamento' });
});

When('o servidor retorna um erro ao tentar pausar o treinamento', function() {
  global.fetch.mockClear();
  mockFetchResponse('error', { message: 'Erro ao pausar treinamento' });
});

When('o servidor retorna um erro ao tentar salvar o treinamento', function() {
  global.fetch.mockClear();
  mockFetchResponse('error', { message: 'Erro ao salvar treinamento' });
});

When('eu clico na aba {string}', function(abaText) {
  fireEvent.click(screen.getByText(abaText));
});

When('eu alterno entre as diferentes abas de visualização', function() {
  // Clicar nas diferentes abas para alternar entre visualizações
  fireEvent.click(screen.getByText('Visualizar Agente'));
  fireEvent.click(screen.getByText('Visualizar DNA'));
  fireEvent.click(screen.getByText('Visualizar Rede Neural'));
});

// Steps para verificações
Then('eu devo ver o formulário de configuração de treinamento', function() {
  expect(screen.getByText('Configuração do Treinamento')).toBeInTheDocument();
});

Then('o formulário deve conter os campos:', function(dataTable) {
  const campos = dataTable.hashes();
  campos.forEach(campo => {
    expect(screen.getByLabelText(`${campo.campo}:`)).toBeInTheDocument();
  });
});

Then('o formulário deve conter os botões:', function(dataTable) {
  const botoes = dataTable.hashes();
  botoes.forEach(botao => {
    expect(screen.getByText(botao.botão)).toBeInTheDocument();
  });
});

Then('uma requisição para iniciar o treinamento deve ser enviada à API', function() {
  expect(global.fetch).toHaveBeenCalledWith('/api/train', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: expect.any(String)
  });
});

Then('eu devo ver a mensagem {string}', async function(message) {
  await waitFor(() => {
    expect(screen.getByText(message)).toBeInTheDocument();
  });
});

Then('eu devo ver a seção de progresso do treinamento', function() {
  expect(screen.getByText('Treinamento em Progresso')).toBeInTheDocument();
});

Then('o formulário não deve ser enviado devido a validação HTML5', function() {
  expect(global.fetch).not.toHaveBeenCalled();
});

Then('nenhuma requisição deve ser enviada à API', function() {
  expect(global.fetch).not.toHaveBeenCalled();
});

Then('uma requisição para pausar o treinamento deve ser enviada à API', function() {
  expect(global.fetch).toHaveBeenCalledWith('/api/train/pause', {
    method: 'POST',
  });
});

Then('o status do treinamento deve mudar para {string}', function(status) {
  expect(screen.getByText(`Status: ${status}`)).toBeInTheDocument();
});

Then('uma requisição para continuar o treinamento deve ser enviada à API', function() {
  expect(global.fetch).toHaveBeenCalledWith('/api/train/continue', {
    method: 'POST',
  });
});

Then('uma requisição para salvar o treinamento deve ser enviada à API', function() {
  expect(global.fetch).toHaveBeenCalledWith('/api/train/save', {
    method: 'POST',
  });
});

Then('uma requisição para parar o treinamento deve ser enviada à API', function() {
  expect(global.fetch).toHaveBeenCalledWith('/api/train/stop', {
    method: 'POST',
  });
});

Then('o painel deve voltar ao estado inicial', function() {
  expect(screen.getByText('Novo Treino')).toBeInTheDocument();
  expect(screen.queryByText('Treinamento em Progresso')).not.toBeInTheDocument();
});

Then('eu devo ver a seção {string}', function(sectionTitle) {
  expect(screen.getByText(sectionTitle)).toBeInTheDocument();
});

Then('eu devo ver as seguintes informações:', function(dataTable) {
  const informacoes = dataTable.hashes();
  informacoes.forEach(info => {
    expect(screen.getByText(new RegExp(info.informação))).toBeInTheDocument();
  });
});

Then('eu devo ver os dados detalhados do treinamento em formato JSON', function() {
  expect(screen.getByText('Resultados do Treinamento')).toBeInTheDocument();
  // Verificar se existe um elemento <pre> que contém dados JSON
  const jsonContainer = screen.getByText(/"current":/).parentElement;
  expect(jsonContainer).toBeInTheDocument();
});

Then('eu devo ver um iframe com a simulação do jogo da cobrinha', function() {
  const iframe = screen.getByTitle('Simulação do Agente');
  expect(iframe).toBeInTheDocument();
  expect(iframe).toHaveAttribute('src', '/game/snake_game.html');
});

Then('eu devo ver uma mensagem de erro informativa', async function() {
  await waitFor(() => {
    const errorMessageElement = screen.getByText(/Erro ao/);
    expect(errorMessageElement).toBeInTheDocument();
  });
});

Then('o formulário de treinamento deve continuar visível', function() {
  expect(screen.getByText('Configuração do Treinamento')).toBeInTheDocument();
});

Then('o treinamento deve continuar em execução', function() {
  expect(screen.getByText('Treinamento em Progresso')).toBeInTheDocument();
});

// Novos steps para o Dashboard de Visualização

Then('eu devo ver a seção de detalhes do agente', function() {
  expect(screen.getByText('Detalhes do Agente')).toBeInTheDocument();
});

Then('eu devo ver os seguintes detalhes do agente:', function(dataTable) {
  const detalhes = dataTable.hashes();
  detalhes.forEach(detalhe => {
    expect(screen.getByText(new RegExp(detalhe.detalhe))).toBeInTheDocument();
  });
});

Then('eu devo ver a simulação do agente em tempo real', function() {
  const simulacao = screen.getByTitle('Simulação do Agente');
  expect(simulacao).toBeInTheDocument();
});

Then('eu devo ver a seção de visualização do DNA', function() {
  expect(screen.getByText('Visualização do DNA')).toBeInTheDocument();
});

Then('eu devo ver a representação gráfica do DNA do agente', function() {
  // Verificar se existe o container para a visualização do DNA
  const dnaContainer = screen.getByTestId('dna-visualization');
  expect(dnaContainer).toBeInTheDocument();
});

Then('eu devo ver os valores dos genes exibidos em formato legível', function() {
  // Verificar se existem elementos que mostram valores de genes
  const genesValues = screen.getByTestId('gene-values');
  expect(genesValues).toBeInTheDocument();
});

Then('eu devo poder identificar os genes ativos e inativos', function() {
  // Verificar se existem elementos que indicam genes ativos e inativos
  const activeGenes = screen.getAllByTestId('active-gene');
  const inactiveGenes = screen.getAllByTestId('inactive-gene');
  
  expect(activeGenes.length).toBeGreaterThan(0);
  expect(inactiveGenes.length).toBeGreaterThan(0);
});

Then('eu devo ver a representação visual da rede neural', function() {
  // Verificar se existe o container para a visualização da rede neural
  const nnContainer = screen.getByTestId('neural-network-visualization');
  expect(nnContainer).toBeInTheDocument();
});

Then('eu devo ver os neurônios e suas conexões', function() {
  // Verificar se existem elementos que representam neurônios e conexões
  const neurons = screen.getAllByTestId('neuron');
  const connections = screen.getAllByTestId('connection');
  
  expect(neurons.length).toBeGreaterThan(0);
  expect(connections.length).toBeGreaterThan(0);
});

Then('os neurônios ativos devem ser destacados visualmente', function() {
  // Verificar se existem neurônios com destaque visual de ativação
  const activeNeurons = screen.getAllByTestId('active-neuron');
  expect(activeNeurons.length).toBeGreaterThan(0);
});

Then('eu devo ver os pesos das conexões entre neurônios', function() {
  // Verificar se existem elementos que mostram pesos das conexões
  const weights = screen.getAllByTestId('connection-weight');
  expect(weights.length).toBeGreaterThan(0);
});

Then('cada visualização deve ser atualizada corretamente', function() {
  // Verificar se todas as visualizações estão presentes e atualizadas
  const agentView = screen.queryByText('Detalhes do Agente');
  const dnaView = screen.queryByText('Visualização do DNA');
  const nnView = screen.queryByText('Visualização da Rede Neural');
  
  // Pelo menos uma das visualizações deve estar ativa
  expect(agentView !== null || dnaView !== null || nnView !== null).toBeTruthy();
});

Then('os dados exibidos devem corresponder ao agente selecionado', function() {
  // Verificar se os dados exibidos correspondem ao agente selecionado
  // Isso normalmente requer verificação de um ID ou outro identificador
  const agentId = screen.getByTestId('agent-id');
  expect(agentId).toBeInTheDocument();
});

Then('eu devo ver as seguintes métricas:', function(dataTable) {
  const metricas = dataTable.hashes();
  metricas.forEach(metrica => {
    expect(screen.getByText(new RegExp(metrica.métrica))).toBeInTheDocument();
  });
});

Then('as métricas devem ser apresentadas em formato gráfico', function() {
  // Verificar se existem elementos gráficos para as métricas
  const graphs = screen.getAllByTestId('metric-graph');
  expect(graphs.length).toBeGreaterThan(0);
});

Then('devo poder ver a evolução das métricas ao longo do tempo', function() {
  // Verificar se existe um elemento que mostra a evolução temporal
  const timeGraph = screen.getByTestId('time-evolution-graph');
  expect(timeGraph).toBeInTheDocument();
}); 