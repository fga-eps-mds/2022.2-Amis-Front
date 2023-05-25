import { AlunasCadastrarDTO } from "../pages/alunas/dtos/AlunasCadastrar.dto";
import api from "./api";

export const cadastraAluna = async (payload: AlunasCadastrarDTO) => {
  try {
    const response = await api.post("/student/", payload);
    return response;
  } catch (error:any) {
    if (error.response) {
      // Ocorreu um erro com resposta do servidor (por exemplo, status HTTP diferente de 2xx)
      console.log("Erro de resposta do servidor:");
      console.log("Status:", error.response.status);
      console.log("Dados da resposta:", error.response.data);
      console.log("Cabeçalhos da resposta:", error.response.headers);
    } else if (error.request) {
      // A solicitação foi feita, mas não houve resposta do servidor
      console.log("Erro de solicitação:");
      console.log("Erro:", error.request);
    } else {
      // Ocorreu um erro ao configurar a solicitação ou ao processar a resposta
      console.log("Erro durante o processamento da solicitação:");
      console.log("Mensagem de erro:", error.message);
    }
    throw error; // Rejeita a Promise para que o erro seja tratado no chamador
  }
};

export const listarAlunas = async () => {
  
  return await api
    .get("/student/")
    .then((response) => response)
    .catch((error) => error);
};

export const editarAluna = async (
  alunaId: string,
  aluna: Object
) => {
  return await api
    .put("/student/" + alunaId, aluna)
    .then((response) => response)
    .catch((error) => error);
};

export const excluirAluna = async (alunaId: string) => {
  return await api
    .delete("/student/" + alunaId)
    .then((response) => response)
    .catch((error) => error);
};
