from behave import given, when, then
from ga.snake_gene import SnakeGene

@given('que o agente está pronto para iniciar o jogo')
def step_impl_agent_ready(context):
    context.agent = SnakeGene()

@when('a partida é iniciada')
def step_impl_start_game(context):
    context.game_data = context.agent.start_new_game()

@then('os dados da partida são transmitidos')
def step_impl_verify_game_data(context):
    assert context.game_data is not None, "Os dados da partida não foram transmitidos"