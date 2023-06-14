import { Dayjs } from "dayjs";

export interface AssistentesCadastrarDTO {
  nome: string;
  email:string;
  cpf: string;
  login: string;
  dNascimento: string;
  telefone: string;
  observacao: string;
  administrador: boolean;
  senha: string;
}
