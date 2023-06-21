export interface TurmasListarDTO {
  id:number;
  codigo: number;
  nome_turma: string;
  data_inicio: string;
  data_fim: string;
  inicio_aula: string;
  fim_aula: string;
  capacidade_turma: number;
  fk_curso: number;
  fk_professor: string;
  descricao: string;
}