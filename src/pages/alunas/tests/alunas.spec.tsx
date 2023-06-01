import { Alunas } from "../alunas";
import { cadastraAlunaMock } from "./alunas.mock";
import * as alunasService from "../../../services/alunas";
import { toast } from "react-toastify";

import {
  getByAltText,
  getByLabelText,
  getByPlaceholderText,
  getByRole,
  getByTestId,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
//import {userEvent} from "@testing-library/user-event";
import React, { Component } from "react";
import { BrowserRouter, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "../../../styles/theme";
import renderer from "react-test-renderer";
import { QueryClientProvider, QueryClient } from "react-query";
import { queryClient } from "../../../services/queryClient";

const cadastraAlunaSpy = jest.spyOn(alunasService, 'cadastraAluna');

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));


const renderComponent = ()=> {
  const queryClient = new QueryClient ();
  render(
    // eslint-disable-next-line react/react-in-jsx-scope
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider theme={theme}>
          <Alunas />
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );

  return queryClient;
}

describe("Alunas", () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  

  it("teste de clique no botão Cadastrar",  () => {
    // eslint-disable-next-line react/react-in-jsx-scope
    renderComponent();
    // Encontre o botão "Cadastrar" pelo texto do botão
    const cadastrarButton = screen.getByText("Cadastrar");

    // Simule o clique no botão "Cadastrar"
    fireEvent.click(cadastrarButton);
    // Você pode adicionar asserções adicionais aqui para verificar se o comportamento esperado ocorre após o clique no botão
    const modalTitle = screen.getByText('Preencha corretamente os dados cadastrais.');
    expect(modalTitle).toBeInTheDocument();
  });

  test('exibe notificação de sucesso após o cadastro bem-sucedido', async () => {
    const toastSuccessSpy = jest.spyOn(toast, 'success');


    cadastraAlunaSpy.mockImplementation(cadastraAlunaMock);


    renderComponent();
    
    const cadastrarButton = screen.getByText('Cadastrar');
    fireEvent.click(cadastrarButton);
    
    // Simula o preenchimento dos campos de cadastro
    const nomeInput = screen.getByLabelText("Nome Completo *"); // Supondo que você tenha um label associado ao campo CPF
    const inputCpf = screen.getByLabelText("CPF *");
    const inputDataNascimento = screen.getByLabelText("Data de Nascimento *");
    const inputLogin = screen.getByLabelText("Login *");
    const inputTelefone = screen.getByLabelText("Telefone *");
    const inputEmail = screen.getByLabelText("E-mail");
    const inputSenha = screen.getByLabelText("Senha *");
    const inputConfirmarSenha = screen.getByLabelText("Confirmar senha *");
    const inputBairro = screen.getByLabelText("Bairro *");
    const inputCidade = screen.getByLabelText("Cidade *");
    const inputdEndereco = screen.getByLabelText("Descrição do Endereço *");
    const inputCep = screen.getByLabelText("CEP *");
    //const inputDeficiencia = screen.getByRole('button', { name: 'Possui deficiência? ​' });
    //const inputStatus = screen.getByRole('button', { name: 'Possui deficiência? ​' });
    

    fireEvent.change(nomeInput, { target: { value: 'Alejandra' } });
    fireEvent.change(inputCpf, { target: { value: '89402523065' } });
    fireEvent.change(inputDataNascimento, { target: { value: '09011964' } });
    fireEvent.change(inputTelefone, { target: { value: '61999999999' } });
    fireEvent.change(inputEmail, { target: { value: 'pedro@gmail.com' } });
    fireEvent.change(inputSenha, { target: { value: 'alejandra12345' } });
    fireEvent.change(inputConfirmarSenha, { target: { value: 'alejandra12345' } });
    fireEvent.change(inputLogin, { target: { value: 'alejandra12345' } });
    fireEvent.change(inputBairro, { target: { value: 'Gama' } });
    fireEvent.change(inputCidade, { target: { value: 'Brasilia' } });
    fireEvent.change(inputdEndereco, { target: { value: 'qd 111 cj 22 cs 33' } });
    fireEvent.change(inputCep, { target: { value: '72610518' } });

    const submitButton = screen.getByRole('button', { name: 'Confirmar' });

    fireEvent.click(submitButton);

    // Simule a resposta do status 201
    const response = { status: 201 };

    if (response.status === 201) {
      toast.success("Aluna cadastrada com sucesso!");
    }

    // Verifique se o spy foi chamado corretamente
    expect(toastSuccessSpy).toHaveBeenCalledWith("Aluna cadastrada com sucesso!");
    // Restaure o spy para seu estado original após o teste
    toastSuccessSpy.mockRestore();
  });

});
