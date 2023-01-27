import { AlunasCadastrarDTO } from "../pages/alunas/dtos/AlunasCadastrarDTO";
import api from "./api";

export const cadastraAluna = async (payload: AlunasCadastrarDTO) => {
  return await api.post("/alunas/", payload).then((response: any) => response);
};

export const listaAlunas = async () => {
  return await api.get("/alunas/").then((response: any) => response);
};

export const apagaAluna = async (alunaId: string) => {
  return await api
    .delete("/alunas/" + alunaId)
    .then((response: any) => response);
};

export const editaAluna = async (
  alunaId: string,
  alunaEdit: AlunasCadastrarDTO
) => {
  return await api
    .put("/alunas/" + alunaId, alunaEdit)
    .then((response: any) => response);
};