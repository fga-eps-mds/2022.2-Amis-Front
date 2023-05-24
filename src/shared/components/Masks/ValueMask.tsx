import React from 'react';
import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';

interface Props {
  label: keyof Value;
}

interface Value {
  cpf: string;
  dNascimento: string;
  telefone: string;
}

const ValueMask: React.FC<Props> = ({ label }) => {
  const value: Value = {
    cpf: 'CPF',
    dNascimento: 'Data de Nascimento',
    telefone: 'Telefone'
  };
  const { register, setValue } = useFormContext();

  const formatValue = (value: string) => {
    // Remove caracteres não numéricos
    let formattedValue = '';
    const numericValue = value.replace(/\D/g, '');

    if(label === 'cpf'){
      // Aplica a máscara de CPF
      const cpfRegex = /^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/;
      const parts = numericValue.match(cpfRegex);
      
      if (parts) {
        formattedValue = `${parts[1]}${parts[2] ? `.${parts[2]}` : ''}${parts[3] ? `.${parts[3]}` : ''}${parts[4] ? `-${parts[4]}` : ''}`;
      }
      return formattedValue;
    }
    if(label === 'dNascimento'){
      // Aplica a máscara de data de nascimento
      const dataNascimentoRegex = /^(\d{0,2})(\d{0,2})(\d{0,4})$/;
      const parts = numericValue.match(dataNascimentoRegex);
      
      if (parts) {
        // formattedValue = `(${parts[0]})`;
        formattedValue = `${parts[1]}${parts[2] ? `/${parts[2]}` : ''}${parts[3] ? `/${parts[3]}` : ''}`;
      }
      return formattedValue;

    }
    if(label === 'telefone'){
      // Aplica a máscara de telefone
      const telefoneRegex = /^(\d{0,2})(\d{0,5})(\d{0,4})$/;
      const parts = numericValue.match(telefoneRegex);
      
      if (parts) {
        formattedValue = `(${parts[1]}) ${parts[2] ? `${parts[2]}` : ''}-${parts[3] ? `${parts[3]}` : ''}`;
      }
    return formattedValue;
    }

    
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const formattedValue = formatValue(value);

    setValue(label, formattedValue); // Atualiza o valor do campo com o rótulo correspondente
  };

  return (
    <TextField
      id={`outlined-${label}`}
      label={value[label]}
      required={true}
      {...register(label)} // Registra o campo com o rótulo correspondente no formulário
      inputProps={{ maxLength: 15 }}
      onChange={handleInputChange}
      sx={{ width: '100%', background: '#F5F4FF' }}
    />
  );
};

export default ValueMask;
