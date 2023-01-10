import { Dayjs } from "dayjs";

export interface TurmasCadastrarDTO {
  nome: string;
  descricao: string;
  numeroVagas: number;
  vagasPrenchidas: number;
  horario: Dayjs;
  turno: string;
}
