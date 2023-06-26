import { TurmasCadastrarDTO } from "../pages/turmas/dtos/TurmasCadastrar.dto";
import { TurmasMatricularDTO } from "../pages/turmas/dtos/TurmasMatricular.dto";
import { apiClassroom, apiUser } from "./api";

export const cadastrarTurmas = async (payload: TurmasCadastrarDTO) => {
  return await apiClassroom
    .post("/classRoom/", payload)
    .then((response: any) => response);
};

export const listarTurmas = async () => {
  return await apiClassroom
    .get("/classRoom/")
    .then((response: any) => response);
};

export const listarTurma = async (turmaId: Number) => {
  //console.log("Aquii")
  return await apiClassroom
    .get("/classRoom/" + turmaId)
    .then((response: any) => response);
};

export const apagarTurmas = async (turmaId: string) => {
  return await apiClassroom

    .delete("/classRoom/" + turmaId)
    .then((response: any) => response);
};

export const editarTurmas = async (
  turmaId: string,
  turmaEdit: TurmasCadastrarDTO
) => {
  try {
    const response = await apiClassroom
      .put("/classRoom/" + turmaId, turmaEdit)
      .then((response: any) => response);
    return response;
  } catch (error: any) {
    if (error.response) {
      // Ocorreu um erro de resposta da API
      const { status, data } = error.response;
      if (status === 422) {
        console.error(error.response);
        throw new Error(`Erro ao cadastrar a turma. Dados inválidos: ${data}`);
      } else {
        console.error(error.response);
        Error(
          `Erro ao cadastrar a turma. Código de status: ${status}. Detalhes: ${data}`
        );
      }
    } else if (error.request) {
      // A requisição foi feita, mas não houve resposta da API
      console.error(error);
      throw new Error(
        "Não foi possível cadastrar a turma. Por favor, verifique sua conexão de rede e tente novamente."
      );
    } else {
      // Ocorreu algum erro durante o processamento da requisição
      throw new Error(
        "Ocorreu um erro ao processar a requisição. Por favor, tente novamente mais tarde."
      );
    }
  }
};

export const cadastrarAluna = async (payload: TurmasMatricularDTO) => {
//console.log("O payload"+payload.codigoTurma);
  return await apiClassroom
    .post("/register/", payload)
    .then((response: any) => response);
};

export const desmatricularAluna = async (idTurma: number, idAluna: string) => {
  return await apiClassroom
    .delete(`/register/78?codigoTurma=${idTurma}&idAluna=${idAluna}`)
    .then((response: any) => response);
};

export const listarAlunasNaTurma = async (idTurma: number) => {
  try {
    const response =await apiClassroom
    .get("/register/" + idTurma)
    .then((response: any) => response);
    return response;
  }
  catch(error: any) {
    if (error.response) {
      // Ocorreu um erro de resposta da API
      const { status, data } = error.response;
      if (status === 422) {
        //console.error(error.response);
        throw new Error(`Erro ao cadastrar a turma. Dados inválidos: ${data}`);
      } else {
        //console.error(error.response);
        Error(
          `Erro ao cadastrar a turma. Código de status: ${status}. Detalhes: ${data}`
        );
      }
    } else if (error.request) {
      // A requisição foi feita, mas não houve resposta da API
      //console.error(error);
      throw new Error(
        "Não foi possível cadastrar a turma. Por favor, verifique sua conexão de rede e tente novamente."
      );
    } else {
      // Ocorreu algum erro durante o processamento da requisição
      throw new Error(
        "Ocorreu um erro ao processar a requisição. Por favor, tente novamente mais tarde."
      );
    }
    return error.response;
  }
};

export const listarAlunas = async () => {
  return await apiUser.get("/student/").then((response: any) => response);
};

export const listarVagasTurma = async (idTurmaVagas: number) => {
  return await apiClassroom
    .get("/register/turma/" + idTurmaVagas)
    .then((response: any) => response);
};

export const confereTurmaMatricula = async (idTurmaVagas: string) => {
  return await apiClassroom
    .get("/matricula/turma/" + idTurmaVagas)
    .then(
      (response: any) =>
        response.data.vagasTotais > response.data.vagasDisponiveis
    );
};
