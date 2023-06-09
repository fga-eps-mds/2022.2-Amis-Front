import { CursosCadastrarDTO } from "../pages/curso/dtos/CursosCadastrar.dto";
import api from "./api";

export const cadastrarCurso = async (payload: CursosCadastrarDTO) => {
  return await api
    .post("/curso/", payload)
    .then((response) => response)
    .catch((error) => error);
};

export const listarCurso = async () => {
  return await api
    .get("/curso/")
    .then((response) => response)
    .catch((error) => error);
};

export const editarCurso = async (cursoId: string, curso: Object) => {
  return await api
    .put("/curso/" + cursoId, curso)
    .then((response) => response)
    .catch((error) => error);
};

export const excluirCurso = async (cursoId: string) => {
  return await api
    .delete("/curso/" + cursoId)
    .then((response) => response)
    .catch((error) => error);
};
