import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ProfessoresCadastrarDTO } from '../dtos/ProfessoresCadastrar.dto';

// Cria uma instância do axios e do mock adapter
const api = axios.create();
const mock = new MockAdapter(api);

// Configura o mock para retornar um status 201
mock.onPost('/professores/').reply(201);


export const CadastrarProfessorMock = async (payload: ProfessoresCadastrarDTO) => {
  return await api.post('/professores/', payload).then((response: any) => response);
};

export const GetProfessorMock = async () => {
  return await api.get('/professores/').then((response: any) => response);
};