import { ProfessoresCadastrarDTO } from "../pages/professores/dtos/ProfessoresCadastrar.dto";
import api from "./api";

export const cadastraProfessor = async (payload: ProfessoresCadastrarDTO) => {
  try {
    const response = await api.post("/teacher/", payload);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const listaProfessores = async () => {
  return await api.get("/teacher/").then((response: any) => response);
};

export const apagaProfessor = async (professorId: string) => {
  return await api
    .delete("/teacher/" + professorId)
    .then((response: any) => response);
};

export const editaProfessor = async (
  professorId: string,
  professorEdit: ProfessoresCadastrarDTO
) => {
  //console.log("professor id:"+professorId)
  return await api
    .put("/teacher/" + professorId, professorEdit)
    .then((response: any) => response);
};
