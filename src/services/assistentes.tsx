import { AssistentesCadastrarDTO } from "../pages/assistentes/dtos/AssistentesCadastrar.dto";
import { baseApi, userApi }  from "./api";

export const cadastrarAssistente = async (payload: AssistentesCadastrarDTO) => {
  return await baseApi
    .post("/socialWorker/", payload)
    .then((response) => response)
    .catch((error) => error);
};

export const listarAssistentes = async () => {
  return await baseApi
    .get("/socialWorker/")
    .then((response) => response)
    .catch((error) => error);
};

export const editarAssistente = async (
  assistenteId: string,
  assistente: Object
) => {
  return await baseApi
    .put("/socialWorker/" + assistenteId, assistente)
    .then((response) => response)
    .catch((error) => error);
};

export const excluirAssistente = async (assistenteId: string) => {
  return await baseApi
    .delete("/socialWorker/" + assistenteId)
    .then((response) => response)
    .catch((error) => error);
};
