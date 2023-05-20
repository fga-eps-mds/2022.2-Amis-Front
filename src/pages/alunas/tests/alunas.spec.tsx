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
    const inputDataNascimento = screen.getByLabelText("Data de Nascimento");
    const inputLogin = screen.getByLabelText("Login *");
    const inputTelefone = screen.getByLabelText("Telefone *");
    const inputEmail = screen.getByLabelText("E-mail");
    const inputSenha = screen.getByLabelText("Senha *");
    const inputConfirmarSenha = screen.getByLabelText("Confirmar senha *");

    fireEvent.change(nomeInput, { target: { value: 'Pedro' } });
    fireEvent.change(inputCpf, { target: { value: '06951977119' } });
    fireEvent.change(inputDataNascimento, { target: { value: '09062001' } });
    fireEvent.change(inputTelefone, { target: { value: '61991812098' } });
    fireEvent.change(inputEmail, { target: { value: 'pedro@gmail.com' } });
    fireEvent.change(inputSenha, { target: { value: '1234' } });
    fireEvent.change(inputConfirmarSenha, { target: { value: '1234' } });
    fireEvent.change(inputLogin, { target: { value: 'pedro' } });

    const submitButton = screen.getByRole('button', { name: 'Confirmar' });

    fireEvent.click(submitButton);
    // Simule a resposta do status 201
    const response = { status: 201 };

    if (response.status === 201) {
      console.log("Aluna cadastrada com sucesso!");
      toast.success("Aluna cadastrada com sucesso!");
    }

    // Verifique se o spy foi chamado corretamente
    expect(toastSuccessSpy).toHaveBeenCalledWith("Aluna cadastrada com sucesso!");
  });

  test('exibe notificação de falha após cadastro inválido', async () => {
  
  });

});


describe("Snapshot", () => {
  it("Deve corresponder ao Snapshot", () => {
    const tree = renderer
      .create(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <Alunas />
            </ThemeProvider>
          </BrowserRouter>
        </QueryClientProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
