export interface CentrosListarDTO {
  id: number,
  idCentro: number;
  data_agendada: string;
  descricao: string;
  status: number;
  vagasRestantes: number;
  turno: number;
}