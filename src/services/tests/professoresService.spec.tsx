import MockAdapter from "axios-mock-adapter";
import {
  cadastraProfessor,
  listaProfessores,
  editaProfessor,
  apagaProfessor,
} from "../professores";

import api from "../api";

// Criar uma instância do mock para o axios
const mock = new MockAdapter(api);

describe("Testes do serviço de professor", () => {
  afterEach(() => {
    // Limpar as chamadas e os mocks após cada teste
    mock.reset();
  });

  it("deve cadastrar um professor", async () => {
    // Dados do payload de teste
    const payload = {
      codigo: 1,
      nome: 'Lorrayne',
      cpf: '01293459038',
      data_nascimento:'2001-09-06',
      login: 'lorrayne.cardozo',
      telefone: '61993650299',
      email: 'lorrayne@gmail.com',
      senha: 'Senha123',
      senha_confirmada: 'Senha123',
      cursos: 'curso 1',
    };
    

    // Configurar o comportamento simulado da chamada POST
    mock.onPost("/teacher/", payload).reply(201, {
      // ...dados simulados da resposta
    });

    // Chamar a função de cadastro de professor
    const response: any = await cadastraProfessor(payload);

    // Verificar se a resposta foi bem-sucedida
    expect(response.status).toBe(201);
    // ...outras verificações necessárias nos dados da resposta

  });

  it("deve listar os professores", async () => {
    // Configurar o comportamento simulado da chamada GET
    mock.onGet("/teacher/").reply(201, {
      // ...dados simulados da resposta
    });

    // Chamar a função de listagem de aluans
    const response = await listaProfessores();

    // Verificar se a resposta foi bem-sucedida
    expect(response.status).toBe(201);
  });

  it("deve editar um professor", async () => {
    // ID do professor a ser editado
    const professorId = "1";

    // Dados do professor para edição
    const professor = {
      codigo: 1,
      nome: 'Lorrayne',
      cpf: '01293459038',
      data_nascimento:'2001-09-06',
      login: 'lorrayne.cardozo',
      telefone: '61993650299',
      email: 'lorrayne@gmail.com',
      senha: 'Senha123',
      senha_confirmada: 'Senha123',
      cursos: 'curso 1',
    };

    // Configurar o comportamento simulado da chamada PUT
    mock.onPut(`/teacher/${professorId}`, professor).reply(200, {
      // ...dados simulados da resposta
    });

    // Chamar a função de edição de professor
    const response = await editaProfessor(professorId, professor);

    // Verificar se a resposta foi bem-sucedida
    expect(response.status).toBe(200);
    // ...outras verificações necessárias nos dados da resposta
  });

  it("deve excluir um professor", async () => {
    // ID do professor a ser editado
    const professorId = "pedro12345";
    

    // Configurar o comportamento simulado da chamada GET
    mock.onDelete(`/teacher/${professorId}`).reply(204, {
      // ...dados simulados da resposta
    });

    // Chamar a função de listagem de professores
    const response = await apagaProfessor(professorId);

    // Verificar se a resposta foi bem-sucedida
    expect(response.status).toBe(204);
  });

  it("deve lidar com erro ao cadastrar um professor", async () => {
    // Dados do payload de teste
    const payload = {
      codigo: 1,
      nome: 'Maria',
      cpf: '000000000000',
      data_nascimento:'2000-09-06',
      login: 'm',
      telefone: '6199999999',
      email: 'maria@gmail.com',
      senha: 'Senha123',
      senha_confirmada: 'Senha123',
      cursos: 'curso 1',
    };

    // Configurar o comportamento simulado da chamada POST com um status de erro 500
    mock.onPost("/teacher/", payload).reply(500, {
      error: "Erro ao cadastrar o professor.",
    });

    // Chamar a função de cadastro de professor
    const response: any = await cadastraProfessor(payload);

    // Verificar se a resposta foi um erro
    expect(response instanceof Error).toBe(true);
    expect(response.message).toBe("Request failed with status code 500");
  });


});