export interface AlunasListarDTO {
  id: number;
  login: string;
  nome: string;
  cpf: string;
  data_nascimento: string;
  telefone: string;
  email:string;
  status: boolean;
  deficiencia: boolean,
  bairro: string,
  cidade: string,
  cep:string,
  descricao_endereco: string,
}
