import MockAdapter from "axios-mock-adapter";
import {
  cadastrarAssistente,
  listarAssistentes,
  editarAssistente,
  excluirAssistente,
} from "../assistentes";

import api from "../api";

// Criar uma instância do mock para o axios
const mock = new MockAdapter(api);

describe("Testes do serviço de assistentes", () => {
  afterEach(() => {
    // Limpar as chamadas e os mocks após cada teste
    mock.reset();
  });

  it("deve cadastrar um assistente", async () => {
    // Dados do payload de teste
    const payload = {
      nome: 'Joana',
      cpf: '88749602047',
      dNascimento:'2001-09-06',
      login: 'pedro12345',
      telefone: '61991812098',
      email: 'pedro@gmail.com',
      senha: 'pedro123456',
      administrador:true,
      observacao:'nenhuma',
    };
    

    // Configurar o comportamento simulado da chamada POST
    mock.onPost("/socialWorker/", payload).reply(201, {
      // ...dados simulados da resposta
    });

    // Chamar a função de cadastro de assistente
    const response = await cadastrarAssistente(payload);

    // Verificar se a resposta foi bem-sucedida
    expect(response.status).toBe(201);
    // ...outras verificações necessárias nos dados da resposta

  });

  it("deve listar os assistentes", async () => {
    // Configurar o comportamento simulado da chamada GET
    mock.onGet("/socialWorker/").reply(201, {
      // ...dados simulados da resposta
    });

    // Chamar a função de listagem de assistentes
    const response = await listarAssistentes();

    // Verificar se a resposta foi bem-sucedida
    expect(response.status).toBe(201);
  });

  it("deve editar um assistente", async () => {
    // ID do assistente a ser editado
    const assistenteId = "pedro12345";

    // Dados do assistente para edição
    const assistente = {
      nome: 'Joana',
      cpf: '88749602047',
      dNascimento:'2001-09-06',
      login: 'pedro12345',
      telefone: '61991812098',
      email: 'pedro@gmail.com',
      senha: 'pedro123456',
      administrador:true,
      observacao:'nenhuma',
    };

    // Configurar o comportamento simulado da chamada PUT
    mock.onPut(`/socialWorker/${assistenteId}`, assistente).reply(200, {
      // ...dados simulados da resposta
    });

    // Chamar a função de edição de assistente
    const response = await editarAssistente(assistenteId, assistente);

    // Verificar se a resposta foi bem-sucedida
    expect(response.status).toBe(200);
    // ...outras verificações necessárias nos dados da resposta
  });

  it("deve excluir um assistentes", async () => {
    // ID do assistente a ser editado
    const assistenteId = "pedro12345";
    

    // Configurar o comportamento simulado da chamada GET
    mock.onDelete(`/socialWorker/${assistenteId}`).reply(204, {
      // ...dados simulados da resposta
    });

    // Chamar a função de listagem de assistentes
    const response = await excluirAssistente(assistenteId);

    // Verificar se a resposta foi bem-sucedida
    expect(response.status).toBe(204);
  });

  it("deve lidar com erro ao cadastrar um assistente", async () => {
    // Dados do payload de teste
    const payload = {
      nome: 'Joana',
      cpf: '000000000000',
      dNascimento:'2001-09-06',
      login: 'pedro12345',
      telefone: '61991812098',
      email: 'pedro@gmail.com',
      senha: 'pedro123456',
      administrador:true,
      observacao:'nenhuma',
    };

    // Configurar o comportamento simulado da chamada POST com um status de erro 500
    mock.onPost("/socialWorker/", payload).reply(500, {
      error: "Erro ao cadastrar o assistente",
    });

    // Chamar a função de cadastro de assistente
    const response = await cadastrarAssistente(payload);

    // Verificar se a resposta foi um erro
    expect(response instanceof Error).toBe(true);
    expect(response.message).toBe("Request failed with status code 500");
  });


});