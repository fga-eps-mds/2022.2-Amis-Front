import { AlunasCadastrarDTO } from "../pages/alunas/dtos/AlunasCadastrar.dto";
import api from "./api";

export const cadastraAluna = async (payload: AlunasCadastrarDTO) => {
  //console.log('Dados da requisição:', payload); // Substitua "data" pelos dados que você está enviando
  try {
    const response = await api.post("/student/", payload);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const listarAlunas = async () => {
  
  return await api
    .get("/student/")
    .then((response) => response)
    .catch((error) => error);
};

export const editarAluna = async (
  alunaId: string,
  aluna: Object
) => {
  console.log("O id da aluna:"+alunaId)
  return await api
    .put("/student/" + alunaId, aluna)
    .then((response) => response)
    .catch((error) => error);
};

export const excluirAluna = async (alunaId: string) => {
  return await api
    .delete("/student/" + alunaId)
    .then((response) => response)
    .catch((error) => error);
};
