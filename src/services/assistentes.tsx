import { AssistentesCadastrarDTO } from "../pages/assistentes/dtos/AssistentesCadastrar.dto";
import api from "./api";

export const cadastrarAssistente = async (payload: AssistentesCadastrarDTO) => {

  try {
    const response = await api.post("/socialWorker/", payload);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const listarAssistentes = async () => {
  
  return await api
    .get("/socialWorker/")
    .then((response) => response)
    .catch((error) => error);
};

export const editarAssistente = async (assistenteId: string, assistente: Object) => {
  console.log("put vai ser: /socialWorker/" + assistenteId);

  try {
    const response = await api.put("/socialWorker/" + assistenteId, assistente);
    return response.data; // ou retorne apenas 'response' se quiser acessar também os cabeçalhos e status da resposta
  } catch (error) {
    if (error.response) {
      // Erro de resposta do servidor (ex: 4xx, 5xx)
      console.error("Erro de resposta do servidor:", error.response.data);
      return error.response.data; // ou retorne apenas 'error.response' se quiser acessar também os cabeçalhos e status da resposta
    } else if (error.request) {
      // Erro de requisição (ex: sem resposta do servidor)
      console.error("Erro de requisição:", error.request);
      return "Erro de requisição. Verifique sua conexão de rede.";
    } else {
      // Outros erros
      console.error("Erro:", error.message);
      return "Ocorreu um erro. Tente novamente mais tarde.";
    }
  }
};


export const excluirAssistente = async (assistenteId: string) => {
  return await api
    .delete("/socialWorker/" + assistenteId)
    .then((response) => response)
    .catch((error) => error);
};
