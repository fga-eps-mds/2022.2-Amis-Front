export interface ReceitasDTO {
  id?: number;
  nome?: string;
  descricao?: string;
  ingredientes?: Ingredientes[];
  modo_preparo?: string[];
  tempo_preparo?: number;
  rendimento?: number;
  dificuldade?: string;
  categoria?: string;
}

export interface Ingredientes {
  id?: number;
  descricao?: string;
}

export interface ModoPreparo {
  id?: number;
  descricao?: string;
  etapa: string[];
}
