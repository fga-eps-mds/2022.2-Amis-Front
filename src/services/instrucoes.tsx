import { InstrucoesCadastrarDTO } from "../pages/cadastroInstrucao/dtos/InstrucoesCadastrar.dto";
import { apiClassroom } from "./api";

export const listarInstrucoes = async () => {
    return await apiClassroom
      .get("/instrucaoCapacitacao/")
      .then((response) => response)
      .catch((error) => error);
  };