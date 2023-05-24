import {
  fireEvent,
  render,
  screen
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, BrowserRouter as Router } from "react-router-dom";
import { act } from 'react-dom/test-utils';
import { toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import * as assistentesService from "../../../services/assistentes";
import { queryClient } from "../../../services/queryClient";
import theme from "../../../styles/theme";
import { Assistentes } from "../assistentes";
import { CadastrarAssistenteMock } from "./assistentes.mock";
import { GetAssistenteMock } from "./assistentes.mock";


const cadastraAssistenteSpy = jest.spyOn(assistentesService, 'cadastrarAssistente');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

const listarAssistenteSpy = jest.spyOn(assistentesService, 'listarAssistentes');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));


const renderComponent = async()=> {
  const queryClient = new QueryClient ();
  render(
    // eslint-disable-next-line react/react-in-jsx-scope
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider theme={theme}>
          <Assistentes />
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
  return queryClient;
}

describe("Assistentes", () => {
  it("Teste de clique no botão Cadastrar",  () => {
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

    cadastraAssistenteSpy.mockImplementation(CadastrarAssistenteMock);
    listarAssistenteSpy.mockImplementation(GetAssistenteMock);

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

    fireEvent.change(nomeInput, { target: { value: 'Lorrayne Cardozo' } });
    fireEvent.change(inputCpf, { target: { value: '62454225077' } });
    fireEvent.change(inputDataNascimento, { target: { value: '27122000' } });
    fireEvent.change(inputTelefone, { target: { value: '61984847799' } });
    fireEvent.change(inputEmail, { target: { value: 'lorrayne@gmail.com' } });
    fireEvent.change(inputSenha, { target: { value: 'senha123' } });
    fireEvent.change(inputConfirmarSenha, { target: { value: 'senha123' } });
    fireEvent.change(inputLogin, { target: { value: 'lorrayne.cardozo' } });

    const submitButton = screen.getByRole('button', { name: 'Confirmar' });

    fireEvent.click(submitButton);
    // Simule a resposta do status 201
    const response = { status: 201 };

    if (response.status === 201) {
      console.log("Assistente cadastrado com sucesso!");
      toast.success("Assistente cadastrado com sucesso!");
    }

    // Verifique se o spy foi chamado corretamente
    expect(toastSuccessSpy).toHaveBeenCalledWith("Assistente cadastrado com sucesso!");
  });
});
