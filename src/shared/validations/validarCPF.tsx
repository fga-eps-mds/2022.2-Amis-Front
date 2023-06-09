import { toast } from "react-toastify";

const validarCPF = (cpf:any) => {
  cpf = cpf.replace(/[^\d]/g, ''); // Remove caracteres não numéricos

  // Verifica se o CPF possui 11 dígitos
  if (cpf.length !== 11) {
      return false;
  }

  // Verifica se todos os dígitos são iguais (ex: 11111111111)
  if (/^(\d)\1+$/.test(cpf)) {
      return false;
  }

  // Calcula o primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
      remainder = 0;
  }
  if (remainder !== parseInt(cpf.charAt(9))) {
      return false;
  }

  // Calcula o segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
      remainder = 0;
  }
  if (remainder !== parseInt(cpf.charAt(10))) {
      return false;
  }

  return true; // CPF válido
};

export const validateCPF = (cpf: string): boolean => {

  const cpfEhValido = validarCPF(cpf);
  if (!cpfEhValido) {
      toast.error("O CPF informado é inválido.");
      return false;
  }
  return true;
};