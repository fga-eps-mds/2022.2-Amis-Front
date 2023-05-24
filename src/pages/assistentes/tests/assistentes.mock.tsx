import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AssistentesCadastrarDTO } from "../dtos/AssistentesCadastrar.dto";

// Cria uma instância do axios e do mock adapter
const api = axios.create();
const mock = new MockAdapter(api);

// Configura o mock para retornar um status 201
mock.onPost('/assistentes/').reply(201);

const responseData = {
  data: [
    {
      nome: 'John Doe',
      cpf: '123.456.789-00',
      dNascimento: '1990-01-01',
      telefone: '(00) 1234-5678',
      email: 'johndoe@example.com',
      login: 'johndoe',
      observacao: 'Lorem ipsum dolor sit amet',
      administrador: true
    },
    {
      nome: 'Jane Smith',
      cpf: '987.654.321-00',
      dNascimento: '1995-05-05',
      telefone: '(00) 9876-5432',
      email: 'janesmith@example.com',
      login: 'janesmith',
      observacao: 'Consectetur adipiscing elit',
      administrador: false
    }
  ]
};

mock.onGet('/assistentes/').reply(200, responseData);

export const CadastrarAssistenteMock = async (payload: AssistentesCadastrarDTO) => {
  return await api.post('/assistentes/', payload).then((response: any) => response);
};

export const GetAssistenteMock = async () => {
  return await api.get('/assistentes/').then((response: any) => response);
};