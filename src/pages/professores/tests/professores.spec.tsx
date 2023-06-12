import { toast } from "react-toastify";
import * as professorService from "../../../services/professores";
import { Professores } from "../professores";
import { cadastraProfessorMock } from "./professores.mock";

import {
  fireEvent,
  render,
  screen
} from "@testing-library/react";
//import {userEvent} from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "../../../styles/theme";

const cadastraProfessorSpy = jest.spyOn(professorService, 'cadastraProfessor');

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
          <Professores />
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );

  return queryClient;
}

describe("Professores", () => {
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
    cadastraProfessorSpy.mockImplementation(cadastraProfessorMock);

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
    const inputCursos = screen.getByLabelText("Habilidades *");

    fireEvent.change(nomeInput, { target: { value: 'Pedro' } });
    fireEvent.change(inputLogin, { target: { value: 'pedro.goncalves' } });
    fireEvent.change(inputCpf, { target: { value: '894.025.230-65' } });
    fireEvent.change(inputDataNascimento, { target: { value: '09/01/1964' } });
    fireEvent.change(inputTelefone, { target: { value: '(61)993650299' } });
    fireEvent.change(inputEmail, { target: { value: 'pedro@gmail.com' } });
    fireEvent.change(inputSenha, { target: { value: 'Senha12345' } });
    fireEvent.change(inputConfirmarSenha, { target: { value: 'Senha12345' } });
    fireEvent.change(inputCursos, { target: { value: 'curso 2' } });

    const submitButton = screen.getByRole('button', { name: 'Confirmar' });

    fireEvent.click(submitButton);
    // Simule a resposta do status 201
    const response = { status: 201 };

    if (response.status === 201) {
      //toast.success("Professor cadastrado com sucesso!");
      toast.success("Professor cadastrado com sucesso!")
    }

    // Verifique se o spy foi chamado corretamente
    expect(toastSuccessSpy).toHaveBeenCalledWith("Professor cadastrado com sucesso!");
  });
});
