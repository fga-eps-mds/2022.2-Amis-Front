import { AssistentesCadastrarDTO } from "../pages/assistentes/dtos/AssistentesCadastrar.dto";
import api from "./api";

export const cadastrarAssistente = async (payload: AssistentesCadastrarDTO) => {
  return await api
    .post("/socialWorker/", payload)
    .then((response) => response)
    .catch((error) => error);
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
