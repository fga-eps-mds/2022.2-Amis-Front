import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ProfessoresCadastrarDTO } from "../dtos/ProfessoresCadastrar.dto";

// Cria uma instância do axios e do mock adapter
const api = axios.create();
const mock = new MockAdapter(api);

// Configura o mock para retornar um status 201
mock.onPost('/teacher/').reply(201);

export const cadastraProfessorMock = async (payload: ProfessoresCadastrarDTO) => {
  //console.log("Passei aq")
  return await api.post('/teacher/', payload).then((response: any) => response);
};