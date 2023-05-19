import React from 'react';
import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';

const CPFMask = () => {
  const { register, setValue } = useFormContext();
  const formatCPF = (value: any) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');

    // Aplica a máscara de CPF
    const cpfRegex = /^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/;
    const parts = numericValue.match(cpfRegex);
    let formattedCPF = '';

    if (parts) {
        formattedCPF = `${parts[1]}${parts[2] ? `.${parts[2]}` : ''}${parts[3] ? `.${parts[3]}` : ''}${parts[4] ? `-${parts[4]}` : ''}`;
      }

    return formattedCPF;
  };

  const handleInputChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    const formattedValue = formatCPF(value);

    //event.target.value = formattedValue;
    setValue('cpf', formattedValue); // Atualiza o valor do campo "cpf" no formulário
  };

  return (
    <TextField
      id="outlined-cpf"
      label="CPF"
      required={true}      
      {...register('cpf')} // Registra o campo 'cpf' no formulário
      inputProps={{ maxLength: 14 }}
      onChange={handleInputChange}
      sx={{ width: '100%', background: '#F5F4FF' }}
    />
  );
};

export default CPFMask;