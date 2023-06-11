import { AlunasCadastrarDTO } from "../pages/alunas/dtos/AlunasCadastrar.dto";
import { baseApi, userApi } from "./api";

export const cadastraAluna = async (payload: AlunasCadastrarDTO) => {
  //console.log('Dados da requisição:', payload); // Substitua "data" pelos dados que você está enviando
  return await baseApi.post("/student/", payload).then((response: any) => response);
};

export const listaAlunas = async () => {
  return await baseApi.get("/student/").then((response: any) => response);
};

export const apagaAluna = async (alunaLogin: string) => {
  return await baseApi
    .delete("/student/" + alunaLogin)
    .then((response: any) => response);
};

export const editaAluna = async (
  alunaId: string,
  alunaEdit: AlunasCadastrarDTO
) => {
  return await baseApi
    .put("/student/" + alunaId, alunaEdit)
    .then((response: any) => response);
};