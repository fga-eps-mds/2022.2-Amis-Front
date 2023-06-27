import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AssistentesCadastrarDTO } from "../dtos/AssistentesCadastrar.dto";

// Cria uma instância do axios e do mock adapter
const api = axios.create();
const mock = new MockAdapter(api);

// Configura o mock para retornar um status 201
mock.onPost('/assistentes/').reply(201);

export const CadastrarAssistenteMock = async (payload: AssistentesCadastrarDTO) => {
  return await api.post('/assistentes/', payload).then((response: any) => response);
};