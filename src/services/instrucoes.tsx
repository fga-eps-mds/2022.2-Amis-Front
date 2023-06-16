import { responsiveFontSizes } from "@mui/material";
import { InstrucoesCadastrarDTO } from "../pages/cadastroInstrucao/dtos/InstrucoesCadastrar.dto";
import { Instrucao } from "../pages/cadastroInstrucao/instrucao";
import api from "./api";

export const cadastrarInstrucao = async (payload: InstrucoesCadastrarDTO) => {
  return await api
    .post("/instrucoes/", payload)
    .then((response) => response)
    .catch((error) => error);
};

export const listarInstrucao = async () => {
  return await api
    .get("/instrucoes/")
    .then((response) => response)
    .catch((error) => error);
};

export const editarInstrucao = async (
  instrucaoId: string,
  instrucao: Object
) => {
  return await api
    .put("/instrucoes/" + instrucaoId, instrucao)
    .then((response) => response)
    .catch((error) => error);
};

export const excluirInstrucao = async (instrucaoId: string) => {
  return await api
    .put("/instrucoes/" + instrucaoId)
    .then((response) => response)
    .catch((error) => error);
};
