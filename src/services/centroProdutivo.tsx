import { NotaAlunoCadastrarDTO } from "../pages/centroProdutivo/dtos/NotaAlunoCadastrarDTO";
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

export const listarAlunasCentro = async (CentroId: string) => {
  console.log("O id que chegou:"+CentroId);
  return await apiProduction
    .get("/centro/" + CentroId+"/inscricoes/")
    .then((response) => response)
    .catch((error) => error);
};

export const gerarRelatorio = async (payload: any) => {
  return await apiProduction
    .post("/relatorio/", payload)
    .then((response) => response)
    .catch((error) => error);
};