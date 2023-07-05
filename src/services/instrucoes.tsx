import { InstrucoesCadastrarDTO } from "../pages/cadastroInstrucao/dtos/InstrucoesCadastrar.dto";
import { apiClassroom } from "./api";

export const cadastrarInstrucao= async (payload: InstrucoesCadastrarDTO) => {
  try {
    const response = await apiClassroom.post("/instrucaoCapacitacao/", payload);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const listarInstrucoes = async () => {
  return await apiClassroom
    .get("/instrucaoCapacitacao/")
    .then((response) => response)
    .catch((error) => error);
};

export const listarInstrucoesPorCurso = async (idCurso: string) => {
  return await apiClassroom
    .get("/instrucaoCapacitacao/curso/" + idCurso)
    .then((response) => response)
    .catch((error) => error);
};

export const editarInstrucao = async (
  instrucaoId: string,
  instrucao: Object
) => {
  return await apiClassroom
    .put("/instrucaoCapacitacao/" + instrucaoId, instrucao)
    .then((response) => response)
    .catch((error) => error);
};

export const excluirInstrucao = async (instrucaoId: string) => {
  return await apiClassroom
    .delete("/instrucaoCapacitacao/" + instrucaoId)
    .then((response) => response)
    .catch((error) => error);
};