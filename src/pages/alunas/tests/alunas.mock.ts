import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AlunasCadastrarDTO } from "../dtos/AlunasCadastrar.dto";

// Cria uma instância do axios e do mock adapter
const api = axios.create();
const mock = new MockAdapter(api);

// Configura o mock para retornar um status 201
mock.onPost('/alunas/').reply(201);

export const cadastraAlunaMock = async (payload: AlunasCadastrarDTO) => {
  return await api.post('/alunas/', payload).then((response: any) => response);
};