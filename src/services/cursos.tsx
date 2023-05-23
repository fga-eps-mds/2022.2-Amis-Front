import { CursosCadastrarDTO } from "../pages/curso/dtos/CursosCadastrar.dto";
import api from "./api";

export const cadastrarCurso = async (payload: CursosCadastrarDTO) => {
    return await api
      .post("/curso/", payload)
      .then((response) => response)
      .catch((error) => error);
  };