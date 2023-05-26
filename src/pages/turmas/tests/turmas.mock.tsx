import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Cria uma instância do axios e do mock adapter
const api = axios.create();
const mock = new MockAdapter(api);

// Configura o mock para retornar um status 201
mock.onPost('/student/').reply(200);

export const listarAlunasMock = async () => {
    return await api.get("/student/").then((response: any) => response);
  };