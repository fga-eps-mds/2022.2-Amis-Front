import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { CentrosCadastrarDTO } from '../dtos/CentrosCadastrar.dto';

// Cria uma instância do axios e do mock adapter
const api = axios.create();
const mock = new MockAdapter(api);

// Configura o mock para retornar um status 201
mock.onPost('/centroProdutivo/').reply(201);


export const CadastrarCentroMock = async (payload: CentrosCadastrarDTO) => {
  return await api.post('/centroProdutivo/', payload).then((response: any) => response);
};

export const GetCentroMock = async () => {
  return await api.get('/centroProdutivo/').then((response: any) => response);
};