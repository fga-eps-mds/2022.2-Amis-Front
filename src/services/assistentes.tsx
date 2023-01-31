import { AssistentesCadastrarDTO } from "../pages/assistentes/dtos/AssistentesCadastrar.dto";
import api from "./api";

export const cadastrarAssistente = async (payload: AssistentesCadastrarDTO) => {
  return await api
    .post("/assistentes/", payload, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzUxMzk1MzIsInN1YiI6ImthbGViZTFAZ21haWwuY29tIn0.xbx6FBAzfpxLZiGcSRCtPkTkaE1PlSobYv-cjOMc1flqO84F3BI-uvA4vr5pAyzmCFMRwhegisJugG5Zb8fxKA",
      },
    })
    .then((response) => response)
    .catch((error) => error);
};

export const listarAssistentes = async () => {
  return await api
    .get("/assistentes/", {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzUxODY4NzMsInN1YiI6ImthbGViZTFAZ21haWwuY29tIn0.PnwAQOmX6y2swkTJSvNSdaxIOTcbVAuMrP_bS2axE5FJoFt3GY88tbZvw8Fq5NnRWfDH48HLxmrDVFw-xTxdQA",
      },
    })
    .then((response) => response)
    .catch((error) => error);
};

export const editarAssistente = async (
  assistenteId: string,
  assistente: Object
) => {
  return await api
    .put("/assistentes/" + assistenteId, assistente, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzUxMzk1MzIsInN1YiI6ImthbGViZTFAZ21haWwuY29tIn0.xbx6FBAzfpxLZiGcSRCtPkTkaE1PlSobYv-cjOMc1flqO84F3BI-uvA4vr5pAyzmCFMRwhegisJugG5Zb8fxKA",
      },
    })
    .then((response) => response)
    .catch((error) => error);
};

export const excluirAssistente = async (assistenteId: string) => {
  return await api
    .delete("/assistentes/" + assistenteId, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzUxMzk1MzIsInN1YiI6ImthbGViZTFAZ21haWwuY29tIn0.xbx6FBAzfpxLZiGcSRCtPkTkaE1PlSobYv-cjOMc1flqO84F3BI-uvA4vr5pAyzmCFMRwhegisJugG5Zb8fxKA",
      },
    })
    .then((response) => response)
    .catch((error) => error);
};
