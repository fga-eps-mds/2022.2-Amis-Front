import { AssistentesCadastrarDTO } from "../pages/assistentes/dtos/AssistentesCadastrar.dto";
import { apiUser } from "./api";
export const cadastrarAssistente = async (payload: AssistentesCadastrarDTO) => {

  try {
    const response = await apiUser.post("/socialWorker/", payload);
    return response;
  } catch (error) {
    //console.error(error);
    return error;
  }
};

export const listarAssistentes = async () => {
  
  return await apiUser
    .get("/socialWorker/")
    .then((response) => response)
    .catch((error) => error);
};

export const editarAssistente = async (
  assistenteId: string,
  assistente: Object
) => {
  return await apiUser
    .put("/socialWorker/" + assistenteId, assistente)
    .then((response) => response)
    .catch((error) => error);
};


export const excluirAssistente = async (assistenteId: string) => {
  return await apiUser
    .delete("/socialWorker/" + assistenteId)
    .then((response) => response)
    .catch((error) => error);
};
