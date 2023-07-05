export interface CentrosListarDTO {
    id:number,
    idCentro : number;
    data_agendada: string;
    descricao: string;
    status: boolean;
    vagasRestantes:number;
    turno : number;
  }