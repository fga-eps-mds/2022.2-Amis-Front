import { AssistentesCadastrarDTO } from "../pages/assistentes/dtos/AssistentesCadastrarDTO";
import api from "./api";

export const cadastrarAssistente = async (payload: AssistentesCadastrarDTO) => {
  return await api.post("/assistentes/", payload).then((response) => response);
};

export const listarAssistentes = async () => {
  return await api.get("/assistentes/").then((response) => response);
};

export const editarAssistente = async (
  assistenteId: string,
  assistente: Object
) => {
  return await api
    .put("/alunas/" + assistenteId, { assistente })
    .then((response) => response);
};

export const excluirAssistente = async (assistenteId: string) => {
  return await api
    .delete("/alunas/" + assistenteId)
    .then((response) => response);
};
