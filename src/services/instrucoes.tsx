import { responsiveFontSizes } from "@mui/material";
import { InstrucoesCadastrarDTO } from "../pages/cadastroInstrucao/dtos/InstrucoesCadastrar.dto";
import { apiClassroom } from "./api";

export const cadastrarInstrucao = async (payload: InstrucoesCadastrarDTO) => {
  return await apiClassroom
    .post("/instrucaoCapacitacao/", payload)
    .then((response) => response)
    .catch((error) => error);
};

export const listarInstrucoes = async () => {
  return await apiClassroom
    .get("/instrucaoCapacitacao/")
    .then((response) => response)
    .catch((error) => error);
};
