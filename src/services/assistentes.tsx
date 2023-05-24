import { AssistentesCadastrarDTO } from "../pages/assistentes/dtos/AssistentesCadastrar.dto";
import api from "./api";

export const cadastrarAssistente = async (payload: AssistentesCadastrarDTO) => {
  try {
    const response = await api.post("/socialWorker/", payload);
    return response;
  } catch (error:any) {
    if (error.response) {
      // Ocorreu um erro com resposta do servidor (por exemplo, status HTTP diferente de 2xx)
      console.log("Erro de resposta do servidor:");
      console.log("Status:", error.response.status);
      console.log("Dados da resposta:", error.response.data);
      console.log("Cabeçalhos da resposta:", error.response.headers);
    } else if (error.request) {
      // A solicitação foi feita, mas não houve resposta do servidor
      console.log("Erro de solicitação:");
      console.log("Erro:", error.request);
    } else {
      // Ocorreu um erro ao configurar a solicitação ou ao processar a resposta
      console.log("Erro durante o processamento da solicitação:");
      console.log("Mensagem de erro:", error.message);
    }
    throw error; // Rejeita a Promise para que o erro seja tratado no chamador
  }
};



export const listarAssistentes = async () => {
  
  return await api
    .get("/socialWorker/")
    .then((response) => response)
    .catch((error) => error);
};

export const editarAssistente = async (
  assistenteId: string,
  assistente: Object
) => {
  return await api
    .put("/socialWorker/" + assistenteId, assistente)
    .then((response) => response)
    .catch((error) => error);
};

export const excluirAssistente = async (assistenteId: string) => {
  return await api
    .delete("/socialWorker/" + assistenteId)
    .then((response) => response)
    .catch((error) => error);
};
