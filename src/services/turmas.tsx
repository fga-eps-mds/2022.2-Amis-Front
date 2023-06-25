import { TurmasCadastrarDTO } from "../pages/turmas/dtos/TurmasCadastrar.dto";
import { TurmasMatricularDTO } from "../pages/turmas/dtos/TurmasMatricular.dto";
import { apiClassroom } from "./api";

export const cadastrarTurmas = async (payload: TurmasCadastrarDTO) => {
  return await apiClassroom.post("/turmas/", payload).then((response: any) => response);
};

export const listarTurmas = async () => {
  return await apiClassroom.get("/turmas/").then((response: any) => response);
};

export const apagarTurmas = async (turmaId: string) => {
  return await apiClassroom
    .delete("/turmas/" + turmaId)
    .then((response: any) => response);
};

export const editarTurmas = async (
  turmaId: string,
  turmaEdit: TurmasCadastrarDTO
) => {
  return await apiClassroom
    .put("/turmas/" + turmaId, turmaEdit)
    .then((response: any) => response);
};

export const cadastrarAluna = async (payload: TurmasMatricularDTO) => {
  return await apiClassroom
    .post("/matricula/", payload)
    .then((response: any) => response);
};

export const desmatricularAluna = async (idTurma: number, idAluna: number) => {
  return await apiClassroom
    .delete("/matricula/" + idTurma + "/" + idAluna)
    .then((response: any) => response);
};

export const listarAlunasNaTurma = async (idTurma: number) => {
  return await apiClassroom
    .get("/matricula/" + idTurma)
    .then((response: any) => response);
};

export const listarAlunas = async () => {
  return await apiClassroom.get("/student/").then((response: any) => response);
};

export const listarVagasTurma = async (idTurmaVagas: number) => {
  return await apiClassroom
    .get("/matricula/turma/" + idTurmaVagas)
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
