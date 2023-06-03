import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AlunasCadastrarDTO } from "../dtos/AlunasCadastrar.dto";

// Cria uma instância do axios e do mock adapter
const api = axios.create();
const mock = new MockAdapter(api);

// Configura o mock com uma função de callback para retornar a resposta adequada com base na condição
mock.onPost('/alunas/').reply((config) => {
  const { data } = config;
  const aluna = JSON.parse(data);
  
  // Verifique a condição desejada
  if (aluna.nome && aluna.nome.startsWith('A')) {
    // Condição bem-sucedida, retorna status 201
    return [201, data];
  } else {
    // Condição mal-sucedida, retorna status 200
    return [200, data];
  }
});

export const cadastraAlunaMock = async (payload: AlunasCadastrarDTO) => {
  return await api.post('/alunas/', payload).then((response: any) => response);
};