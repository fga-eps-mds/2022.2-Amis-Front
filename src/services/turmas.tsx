import { TurmasCadastrarDTO } from "../pages/turmas/dtos/TurmasCadastrar.dto";
import { TurmasMatricularDTO } from "../pages/turmas/dtos/TurmasMatricular.dto";
import api from "./api";

// export const cadastrarTurmas = async (payload: TurmasCadastrarDTO) => {
//   return await api
//     .post("/classRoom/", payload)
//     .then((response: any) => response);
// };

export const cadastrarTurmas = async (payload: TurmasCadastrarDTO) => {
  try {
    const response = await api.post("/classRoom/", payload);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Ocorreu um erro de resposta da API
      const { status, data } = error.response;
      throw new Error(
        `Erro ao cadastrar a turma. Código de status: ${status}. Detalhes: ${data}`
      );
    } else if (error.request) {
      // A requisição foi feita, mas não houve resposta da API
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

export const listarTurmas = async () => {
  return await api.get("/classRoom/").then((response: any) => response);
};

export const apagarTurmas = async (turmaId: string) => {
  return await api
    .delete("/classRoom/" + turmaId)
    .then((response: any) => response);
};

export const editarTurmas = async (
  turmaId: string,
  turmaEdit: TurmasCadastrarDTO
) => {
  return await api
    .put("/classRoom/" + turmaId, turmaEdit)
    .then((response: any) => response);
};

// export const cadastrarAluna = async (payload: TurmasMatricularDTO) => {
//   return await api
//     .post("/matricula/", payload)
//     .then((response: any) => response);
// };

// export const desmatricularAluna = async (idTurma: number, idAluna: number) => {
//   return await api
//     .delete("/matricula/" + idTurma + "/" + idAluna)
//     .then((response: any) => response);
// };

// export const listarAlunasNaTurma = async (idTurma: number) => {
//   return await api
//     .get("/matricula/" + idTurma)
//     .then((response: any) => response);
// };

// export const listarAlunas = async () => {
//   return await api.get("/alunas/").then((response: any) => response);
// };

export const listarVagasTurma = async (idTurmaVagas: number) => {
  return await api
    .get("/matricula/turma/" + idTurmaVagas)
    .then((response: any) => response);
};

export const confereTurmaMatricula = async (idTurmaVagas: string) => {
  return await api
    .get("/matricula/turma/" + idTurmaVagas)
    .then(
      (response: any) =>
        response.data.vagasTotais > response.data.vagasDisponiveis
    );
};
