import { Dayjs } from "dayjs";

export interface AssistentesCadastrarDTO {
  nome: string;
  cpf: string;
  login: string;
  observacao: string;
  administrador: boolean;
}
