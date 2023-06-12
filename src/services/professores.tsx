import { ProfessoresCadastrarDTO } from "../pages/professores/dtos/ProfessoresCadastrar.dto";
import { apiUser } from "./api";

export const cadastraProfessor = async (payload: ProfessoresCadastrarDTO) => {
  try {
    const response = await apiUser.post("/teacher/", payload);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const listaProfessores = async () => {
  return await apiUser.get("/teacher/").then((response: any) => response);
};

export const apagaProfessor = async (professorId: string) => {
  return await apiUser
    .delete("/teacher/" + professorId)
    .then((response: any) => response);
};

export const editaProfessor = async (
  professorId: string,
  professorEdit: ProfessoresCadastrarDTO
) => {
  //console.log("professor id:"+professorId)
  return await apiUser
    .put("/teacher/" + professorId, professorEdit)
    .then((response: any) => response);
};
