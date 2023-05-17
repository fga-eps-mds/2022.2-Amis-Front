import React from 'react';
import { TextField } from '@mui/material';

const CPFMask = () => {
  const formatCPF = (value: any) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');

    // Aplica a máscara de CPF
    const cpfRegex = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;
    const formattedValue = numericValue.replace(cpfRegex, '$1.$2.$3-$4');

    return formattedValue;
  };

  const handleInputChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    const formattedValue = formatCPF(value);
    event.target.value = formattedValue;
  };

  return (
    <TextField
      id="outlined-cpf"
      label="CPF"
      required={true}
      inputProps={{ maxLength: 14 }}
      onChange={handleInputChange}
      variant="outlined"
      sx={{ width: '100%', background: '#F5F4FF' }}
    />
  );
};

export default CPFMask;
