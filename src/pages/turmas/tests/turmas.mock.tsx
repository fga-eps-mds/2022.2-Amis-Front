import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { TurmasCadastrarDTO } from '../dtos/TurmasCadastrar.dto';

// Cria uma instância do axios e do mock adapter
const api = axios.create();
const mock = new MockAdapter(api);

// Configura o mock para retornar um status 201
mock.onPost('/classRoom/').reply(201);

export const CadastrarTurmaMock = async (payload: TurmasCadastrarDTO) => {
  return await api.post('/classRoom/', payload).then((response: any) => response);
};

export const ListarTurmasMock = async () => {
    return await api.get("/classRoom/").then((response: any) => response);
  };