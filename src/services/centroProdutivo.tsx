import { CentrosCadastrarDTO } from "../pages/centroProdutivo/dtos/CentrosCadastrar.dto";
import { apiClassroom } from "./api";

export const cadastrarCentro = async (payload: CentrosCadastrarDTO) => {
  return await apiClassroom
    .post("/Centro/", payload)
    .then((response) => response)
    .catch((error) => error);
};

export const listarCentro = async () => {
  return await apiClassroom
    .get("/Centro/")
    .then((response) => response)
    .catch((error) => error);
};

export const editarCentro = async (CentroId: string, Centro: Object) => {
  return await apiClassroom
    .put("/Centro/" + CentroId, Centro)
    .then((response) => response)
    .catch((error) => error);
};

export const excluirCentro = async (CentroId: string) => {
  return await apiClassroom
    .delete("/Centro/" + CentroId)
    .then((response) => response)
    .catch((error) => error);
};
