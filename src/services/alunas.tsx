import { AlunasCadastrarDTO } from "../pages/alunas/dtos/AlunasCadastrar.dto";
import { apiUser } from "./api";

export const cadastraAluna = async (payload: AlunasCadastrarDTO) => {
  try {
    const response = await apiUser.post("/student/", payload);
    return response;
  } catch (error) {
    return error;
  }
};

export const listarAlunas = async () => {
  
  return await apiUser
    .get("/student/")
    .then((response) => response)
    .catch((error) => error);
};

export const listaAlunaAtual = async (alunaId:string) => {
  
  return await apiUser
    .get("/student/"+alunaId)
    .then((response) => response)
    .catch((error) => error);
};


export const editarAluna = async (alunaId: string, aluna: Object) => {
  //console.log("Aluna id vai serrr:"+alunaId);
  try {
    const response = await apiUser.put("/student/" + alunaId, aluna);
    return response;
  } catch (error:any) {
    //console.error("Ocorreu um erro ao editar a aluna:", error.message);
    
    if (error.response) {
      // O servidor retornou um código de status de erro
      //console.error("Código de status:", error.response.status);
      //console.error("Mensagem do servidor:", error.response.data);
    } else if (error.request) {
      // A requisição foi feita, mas não houve resposta do servidor
      //console.error("A requisição foi feita, mas não houve resposta do servidor.");
    } else {
      // Ocorreu um erro durante a configuração da requisição
      //console.error("Ocorreu um erro durante a configuração da requisição:", error.message);
    }
    
    throw new Error("Ocorreu um erro ao editar a aluna. Por favor, tente novamente.");
  }
};

export const excluirAluna = async (alunaId: string) => {
  return await apiUser
    .delete("/student/" + alunaId)
    .then((response) => response)
    .catch((error) => error);
};
