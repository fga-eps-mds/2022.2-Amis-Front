import React from "react";
import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

interface Props {
  label: keyof Value;
  registeredName?: string;
}

interface Value {
  cpf: string;
  data_agendada : string;
  data_agendadaEdit: string;
  data_nascimento: string;
  telefone: string;
  cep: string;
  data_inicio: string;
  data_fim: string;
  inicio_aula: string;
  fim_aula: string;
  cpfEdit: string;
  data_nascimentoEdit: string;
  telefoneEdit: string;
  cepEdit: string;
}

const ValueMask: React.FC<Props> = ({ label, registeredName }) => {
  const value: Value = {
    cpf: "CPF",
    data_agendada : "Data de Alocação",
    data_agendadaEdit : "Data de Alocação",
    data_nascimento: "Data de Nascimento",
    telefone: "Telefone",
    cep: "CEP",
    data_inicio: "Data de Início",
    data_fim: "Data de Término",
    inicio_aula: "Horário de Início",
    fim_aula: "Horário de Término",
    cpfEdit: "CPF",
    data_nascimentoEdit: "Data de Nascimento",
    telefoneEdit: "Telefone",
    cepEdit: "CEP",
  };
  const { register, setValue } = useFormContext();

  const formatValue = (value: string) => {
    if (!value) {
      return ""; // Retorna um valor vazio se o valor fornecido for nulo ou vazio
    }
    // Remove caracteres não numéricos
    let formattedValue = "";
    const numericValue = value.replace(/\D/g, "");

    if (label === "cpf" || label === "cpfEdit") {
      // Aplica a máscara de CPF
      const cpfRegex = /^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/;
      const parts = numericValue.match(cpfRegex);

      if (parts) {
        formattedValue = `${parts[1]}${parts[2] ? `.${parts[2]}` : ""}${
          parts[3] ? `.${parts[3]}` : ""
        }${parts[4] ? `-${parts[4]}` : ""}`;
      }
      return formattedValue;
    }

    if (label === "fim_aula" || label === "inicio_aula") {
      // Aplica a máscara de hora
      const horaRegex = /^(\d{0,2})(\d{0,2})$/;
      const parts = numericValue.match(horaRegex);

      if (parts) {
        formattedValue = `${parts[1]}${parts[2] ? `:${parts[2]}` : ""}`;
      }
      return formattedValue;
    }

    // eslint-disable-next-line no-constant-condition
    if (
      label === "data_agendada" ||
      label === "data_nascimento" ||
      label === "data_inicio" ||
      label === "data_fim" ||
      label === "data_nascimentoEdit" ||
      label === "data_agendadaEdit"
    ) {
      // Aplica a máscara de data de nascimento
      const dataNascimentoRegex = /^(\d{0,2})(\d{0,2})(\d{0,4})$/;
      const parts = numericValue.match(dataNascimentoRegex);

      if (parts) {
        // formattedValue = `(${parts[0]})`;
        formattedValue = `${parts[1]}${parts[2] ? `/${parts[2]}` : ""}${
          parts[3] ? `/${parts[3]}` : ""
        }`;
      }
      return formattedValue;
    }

    if (label === "telefone" || label === "telefoneEdit") {
      // Aplica a máscara de telefone
      const telefoneRegex = /^(\d{0,2})(\d{0,5})(\d{0,4})$/;
      const parts = numericValue.match(telefoneRegex);

      if (parts) {
        const ddd = parts[1] ? `(${parts[1]}` : " ";
        const numero = parts[2] ? `) ${parts[2]}` : "";
        const digito = parts[3] ? `-${parts[3]}` : "";
        formattedValue = `${ddd}${numero}${digito}`;
      }
      return formattedValue;
    }

    if (label === "cep" || label === "cepEdit") {
      const cepRegex = /^(\d{0,2})(\d{0,3})(\d{0,3})$/;
      const parts = numericValue.match(cepRegex);

      if (parts) {
        const bloco1 = parts[1] ? `${parts[1]}` : "";
        const bloco2 = parts[2] ? `.${parts[2]}` : "";
        const bloco3 = parts[3] ? `-${parts[3]}` : "";

        formattedValue = `${bloco1}${bloco2}${bloco3}`;
      }

      return formattedValue;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const formattedValue = formatValue(value);

    setValue(label, formattedValue);
  };

  return (
    <TextField
      id={`outlined-${label}`}
      label={value[label]}
      required={true}
      {...register(registeredName ?? label)} // Registra o campo com o rótulo correspondente no formulário
      inputProps={{ maxLength: 15 }}
      onChange={handleInputChange}
      sx={{ width: "100%", background: "#F5F4FF" }}
    />
  );
};

export default ValueMask;