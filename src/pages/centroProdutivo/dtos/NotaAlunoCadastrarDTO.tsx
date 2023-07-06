import {Dayjs} from "dayjs";

export interface NotaAlunoCadastrarDTO {
    nome: string;
    comentario: string;
    frequencia: number;
    nota: number;
    qtdProduzida: number;
    qtdDesejada: number;
}