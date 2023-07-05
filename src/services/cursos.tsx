import { CursosCadastrarDTO } from "../pages/curso/dtos/CursosCadastrar.dto";
import { apiClassroom } from "./api";

export const cadastrarCurso = async (payload: CursosCadastrarDTO) => {
  return await apiClassroom
    .post("/curso/", payload)
    .then((response) => response)
    .catch((error) => error);
};

export const listarCurso = async () => {
  return await apiClassroom
    .get("/curso/")
    .then((response) => response)
    .catch((error) => error);
};

export const listarCursoPorId = async (cursoId: string) => {
  return await apiClassroom
    .get("/curso/" + cursoId)
    .then((response) => response)
    .catch((error) => error);
};

export const editarCurso = async (cursoId: string, curso: Object) => {
  return await apiClassroom
    .put("/curso/" + cursoId, curso)
    .then((response) => response)
    .catch((error) => error);
};

export const excluirCurso = async (cursoId: string) => {
  return await apiClassroom
    .delete("/curso/" + cursoId)
    .then((response) => response)
    .catch((error) => error);
};
