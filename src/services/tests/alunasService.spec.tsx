import MockAdapter from "axios-mock-adapter";
import {
  cadastraAluna,
  listarAlunas,
  editarAluna,
  excluirAluna,
} from "../alunas";

import { apiUser } from "../api";

// Criar uma instância do mock para o axios
const mock = new MockAdapter(apiUser);

describe("Testes do serviço de aluna", () => {
  afterEach(() => {
    // Limpar as chamadas e os mocks após cada teste
    mock.reset();
  });

  it("deve cadastrar um aluna", async () => {
    // Dados do payload de teste
    const payload = {
      nome: 'Pedro Teste',
      cpf: '16533777041',
      data_nascimento:'2001-09-06',
      login: 'pedro12345',
      telefone: '61991812098',
      email: 'pedro@gmail.com',
      senha: 'pedro123456',
      status:true,
      idEndereco:0,
      deficiencia:false,
      bairro:'gama',
      cidade:'brasilia',
      cep:'72610500',
      descricao_endereco:'Descricao...',
    };
    

    // Configurar o comportamento simulado da chamada POST
    mock.onPost("/student/", payload).reply(201, {
      // ...dados simulados da resposta
    });

    // Chamar a função de cadastro de aluna
    const response: any = await cadastraAluna(payload);

    // Verificar se a resposta foi bem-sucedida
    expect(response.status).toBe(201);
    // ...outras verificações necessárias nos dados da resposta

  });

  it("deve listar as alunas", async () => {
    // Configurar o comportamento simulado da chamada GET
    mock.onGet("/student/").reply(201, {
      // ...dados simulados da resposta
    });

    // Chamar a função de listagem de aluans
    const response = await listarAlunas();

    // Verificar se a resposta foi bem-sucedida
    expect(response.status).toBe(201);
  });

  it("deve editar um aluna", async () => {
    // ID do aluna a ser editado
    const alunaId = "pedro12345";

    // Dados do aluna para edição
    const aluna = {
      nome: 'Joana',
      cpf: '16533777041',
      data_nascimento:'2001-09-06',
      login: 'pedro12345',
      telefone: '61991812098',
      email: 'pedro@gmail.com',
      senha: 'pedro123456',
      status:true,
      idEndereco:0,
      deficiencia:false,
      bairro:'gama',
      cidade:'brasilia',
      cep:'72610500',
      descricao_endereco:'Descricao...',
    };

    // Configurar o comportamento simulado da chamada PUT
    mock.onPut(`/student/${alunaId}`, aluna).reply(200, {
      // ...dados simulados da resposta
    });

    // Chamar a função de edição de aluna
    const response = await editarAluna(alunaId, aluna);

    // Verificar se a resposta foi bem-sucedida
    expect(response.status).toBe(200);
    // ...outras verificações necessárias nos dados da resposta
  });

  it("deve excluir uma aluna", async () => {
    // ID do aluna a ser editado
    const alunaId = "pedro12345";
    

    // Configurar o comportamento simulado da chamada GET
    mock.onDelete(`/student/${alunaId}`).reply(204, {
      // ...dados simulados da resposta
    });

    // Chamar a função de listagem de alunas
    const response = await excluirAluna(alunaId);

    // Verificar se a resposta foi bem-sucedida
    expect(response.status).toBe(204);
  });

  it("deve lidar com erro ao cadastrar uma aluna", async () => {
    // Dados do payload de teste
    const payload = {
      nome: 'Joana',
      cpf: '000000000000',
      data_nascimento:'2001-09-06',
      login: 'pedro12345',
      telefone: '61991812098',
      email: 'pedro@gmail.com',
      senha: 'pedro123456',
      status:true,
      idEndereco:0,
      deficiencia:false,
      bairro:'gama',
      cidade:'brasilia',
      cep:'72610500',
      descricao_endereco:'Descricao...',
    };

    // Configurar o comportamento simulado da chamada POST com um status de erro 500
    mock.onPost("/student/", payload).reply(422, {
      error: "Erro ao cadastrar a aluna",
    });

    // Chamar a função de cadastro de aluna
    const response: any = await cadastraAluna(payload);

    // Verificar se a resposta foi um erro
    expect(response instanceof Error).toBe(true);
    
    expect(response.message).toBe("Request failed with status code 422");
  });


});