import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { InstrucoesCadastrarDTO } from '../dtos/InstrucoesCadastrar.dto';

// Cria uma instância do axios e do mock adapter
const api = axios.create();
const mock = new MockAdapter(api);

// Configura o mock para retornar um status 201
mock.onPost('/instrucaoCapacitacao/').reply(201);


export const CadastrarInstrucaoMock = async (payload: InstrucoesCadastrarDTO) => {
  return await api.post('/instrucaoCapacitacao/', payload).then((response: any) => response);
};

export const GetInstrucoesMock = async () => {
  return await api.get('/instrucaoCapacitacao/').then((response: any) => response);
};