import { NotaAlunoCadastrarDTO } from "../pages/assistentes/dtos/NotaAlunoCadastrarDTO";
import { CentrosCadastrarDTO } from "../pages/centroProdutivo/dtos/CentrosCadastrar.dto";
import { apiProduction} from "./api";
import { apiUser } from "./api";

export const cadastrarCentro = async (payload: CentrosCadastrarDTO) => {
  return await apiProduction
    .post("/centro/", payload)
    .then((response) => response)
    .catch((error) => error);
};

export const listarCentro = async () => {
  return await apiProduction
    .get("/centro/")
    .then((response) => response)
    .catch((error) => error);
};

export const editarCentro = async (CentroId: string, Centro: Object) => {
  return await apiProduction
    .put("/centro/" + CentroId, Centro)
    .then((response) => response)
    .catch((error) => error);
};

export const excluirCentro = async (CentroId: string) => {
  return await apiProduction
    .delete("/centro/" + CentroId)
    .then((response) => response)
    .catch((error) => error);
};

export const cadastrarNotaAluno = async (payload: NotaAlunoCadastrarDTO) => {

  try{
    const response = await apiUser.post("/alunas/", payload);
    return response;
  } catch (error) {
    //console.error(error)
    return error;
  }

};
