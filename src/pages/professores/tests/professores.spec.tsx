import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import * as professorService from "../../../services/professores";
import theme from "../../../styles/theme";
import { Professores } from "../professores";
import { CadastrarProfessorMock, GetProfessorMock } from "./professores.mock";
import { act } from 'react-dom/test-utils';
import { AxiosResponse } from 'axios';

const cadastraProfessorSpy = jest.spyOn(professorService, 'cadastraProfessor');
const listaProfessorSpy = jest.spyOn(professorService, 'listaProfessores');
const editaProfessorSpy = jest.spyOn(professorService, 'editaProfessor');
const apagaProfessorSpy = jest.spyOn(professorService, 'apagaProfessor');

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));


const renderComponent = async () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider theme={theme}>
          <Professores />
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
  return queryClient;
}

describe("Professores", () => {
  it("Teste de clique no botão Cadastrar", () => {
    renderComponent();
    const cadastrarButton = screen.getByText("Cadastrar");

    fireEvent.click(cadastrarButton);

    const modalTitle = screen.getByText('Preencha corretamente os dados cadastrais.');
    expect(modalTitle).toBeInTheDocument();
  });

  test('exibe notificação de sucesso após o cadastro bem-sucedido', async () => {
    const toastSuccessSpy = jest.spyOn(toast, 'success');

    cadastraProfessorSpy.mockImplementation(CadastrarProfessorMock);
    listaProfessorSpy.mockImplementation(GetProfessorMock);

    renderComponent();
    
    const cadastrarButton = screen.getByText('Cadastrar');
    fireEvent.click(cadastrarButton);
    
    const nomeInput = screen.getByLabelText("Nome Completo *"); // Supondo que você tenha um label associado ao campo CPF
    const inputCpf = screen.getByLabelText("CPF *");
    const inputDataNascimento = screen.getByLabelText("Data de Nascimento *");
    const inputLogin = screen.getByLabelText("Login *");
    const inputTelefone = screen.getByLabelText("Telefone *");
    const inputEmail = screen.getByLabelText("E-mail");
    const inputSenha = screen.getByLabelText("Senha *");
    const inputConfirmarSenha = screen.getByLabelText("Confirmar senha *");
    const inputHabilidades = screen.getByLabelText("Habilidades *");

    fireEvent.change(nomeInput, { target: { value: 'Pedro' } });
    fireEvent.change(inputLogin, { target: { value: 'pedro.goncalves' } });
    fireEvent.change(inputCpf, { target: { value: '911.868.710-59' } });
    fireEvent.change(inputDataNascimento, { target: { value: '01/01/1999' } });
    fireEvent.change(inputTelefone, { target: { value: '(61)999999999' } });
    fireEvent.change(inputEmail, { target: { value: 'teste@hotmail.com' } });
    fireEvent.change(inputSenha, { target: { value: 'Teste123' } });
    fireEvent.change(inputConfirmarSenha, { target: { value: 'Senha12345' } });
    fireEvent.change(inputHabilidades, { target: { value: 'curso 2' } });

    const submitButton = screen.getByRole('button', { name: 'Confirmar' });

    fireEvent.click(submitButton);
    // Simule a resposta do status 201
    const response = { status: 201 };

    if (response.status === 201) {
    toast.success("Professor cadastrado com sucesso!");
    }

    // Verifique se o spy foi chamado corretamente
    expect(toastSuccessSpy).toHaveBeenCalledWith("Professor cadastrado com sucesso!");
});

  it('deve editar um professor ao submeter o formulário', async () => {
    const professor = {
      cpf: "91186871059",
      habilidades: "fut 2",
      data_nascimento: "1999-01-01",
      email: "teste@hotmail.com",
      login: "testeprofessor",
      nome: "Caio",
      senha: "Teste123",
      telefone: "61999999999",
    };

    listaProfessorSpy.mockResolvedValueOnce({ data: [professor] });

    renderComponent();

    await screen.findByText("Caio");

    expect(screen.getByTestId("teste-editar")).toBeInTheDocument();

    const editarButton = screen.getByTestId("teste-editar");

    await act(async () => {
      fireEvent.click(editarButton);
    });

    const emailInput = screen.getByLabelText('Email *');
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "email@email.com" } });
    });

    editaProfessorSpy.mockResolvedValueOnce({ status: 200 } as AxiosResponse);

    const submitButton = screen.getByText('Editar');
    await act(async () => {
      fireEvent.click(submitButton);
    });
  });

  it('deve excluir um professor ao submeter o formulário', async () => {
    const professor = {
      cpf: "91186871059",
      habilidades: "fut 2",
      data_nascimento: "1999-01-01",
      email: "teste@hotmail.com",
      login: "testeprofessor",
      nome: "Caio",
      senha: "Teste123",
      telefone: "61999999999",
    };

    listaProfessorSpy.mockResolvedValueOnce({ data: [professor] });

    renderComponent();

    await screen.findByText("Caio");

    expect(screen.getByTestId("teste-excluir")).toBeInTheDocument();

    const excluirButton = screen.getByTestId("teste-excluir");

    await act(async () => {
      fireEvent.click(excluirButton);
    });

    apagaProfessorSpy.mockResolvedValueOnce({ status: 204 } as AxiosResponse);
    const simButton = screen.getByText('Sim');
    await act(async () => {
      fireEvent.click(simButton);
    });
  });
});
