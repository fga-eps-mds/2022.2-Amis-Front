import { ProfessoresCadastrarDTO } from "../pages/professores/dtos/ProfessoresCadastrar.dto";
import api from "./api";

export const cadastraProfessor = async (payload: ProfessoresCadastrarDTO) => {
  return await api.post("/professores/", payload).then((response: any) => response);
};

export const listaProfessores = async () => {
  return await api.get("/professores/").then((response: any) => response);
};

export const apagaProfessor = async (professorId: string) => {
  return await api
    .delete("/professores/" + professorId)
    .then((response: any) => response);
};

export const editaProfessor = async (
  professorId: string,
  professorEdit: ProfessoresCadastrarDTO
) => {
  return await api
    .put("/professores/" + professorId, professorEdit)
    .then((response: any) => response);
};