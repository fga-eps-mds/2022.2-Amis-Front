import { Dayjs } from "dayjs";

export interface TurmasCadastrarDTO {
  nome: string;
  nomeSocial: string;
  cpf: string;
  dNascimento: Dayjs;
  idEndereco: number;
  senha: string;
  admin: boolean;
  login: string;
  obs: string;
  email: string;
}
