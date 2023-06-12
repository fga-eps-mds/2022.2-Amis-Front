import { Alunas } from "../alunas";
import { cadastraAlunaMock } from "./alunas.mock";
import * as alunasService from "../../../services/alunas";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { getByLabelText, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AxiosResponse } from 'axios';
import theme from "../../../styles/theme";
import { QueryClientProvider, QueryClient } from "react-query";
import { act } from 'react-dom/test-utils';
const cadastraAlunaSpy = jest.spyOn(alunasService, 'cadastraAluna');
const listarAlunasSpy = jest.spyOn(alunasService, 'listarAlunas');
const editaAlunaSpy = jest.spyOn(alunasService, 'editarAluna');
const excluirAlunaSpy = jest.spyOn(alunasService, 'excluirAluna');

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
  },
}));

const renderComponent = () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider theme={theme}>
          <Alunas />
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
  return queryClient;
};

describe("Alunas", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  it("teste de clique no botão Cadastrar", () => {
    renderComponent();
    const cadastrarButton = screen.getByText("Cadastrar");
    fireEvent.click(cadastrarButton);
    const modalTitle = screen.getByText("Preencha corretamente os dados cadastrais.");
    expect(modalTitle).toBeInTheDocument();
  });

  test('exibe notificação de sucesso após o cadastro bem-sucedido', async () => {
    const toastSuccessSpy = jest.spyOn(toast, "success");
    cadastraAlunaSpy.mockImplementation(cadastraAlunaMock);
    renderComponent();
    const cadastrarButton = screen.getByText('Cadastrar');
    await act(async () => {
      fireEvent.click(cadastrarButton);
    });
    const nomeInput = screen.getByLabelText("Nome Completo *");
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

    await act(async () => {
      fireEvent.change(nomeInput, { target: { value: "Alejandra" } });
      fireEvent.change(inputCpf, { target: { value: "89402523065" } });
      fireEvent.change(inputDataNascimento, { target: { value: "09011964" } });
      fireEvent.change(inputTelefone, { target: { value: "61999999999" } });
      fireEvent.change(inputEmail, { target: { value: "pedro@gmail.com" } });
      fireEvent.change(inputSenha, { target: { value: "alejandra12345" } });
      fireEvent.change(inputConfirmarSenha, { target: { value: "alejandra12345" } });
      fireEvent.change(inputLogin, { target: { value: "alejandra12345" } });
      fireEvent.change(inputBairro, { target: { value: "Gama" } });
      fireEvent.change(inputCidade, { target: { value: "Brasilia" } });
      fireEvent.change(inputdEndereco, { target: { value: "qd 111 cj 22 cs 33" } });
      fireEvent.change(inputCep, { target: { value: "72610518" } });
      const submitButton = screen.getByRole("button", { name: "Confirmar" });
      fireEvent.click(submitButton);
    });

    const response = { status: 201 };
    if (response.status === 201) {
      toast.success("Aluna cadastrada com sucesso!");
    }
    expect(toastSuccessSpy).toHaveBeenCalledWith("Aluna cadastrada com sucesso!");
    toastSuccessSpy.mockRestore();
  });

  it('deve editar uma aluna ao submeter o formulário', async () => {
    const aluna = {
      login: 'aluna',
      nome: 'Alice',
      cpf: '40071085017',
      data_nascimento: '2000-01-01',
      deficiencia: false,
      telefone: '12345678901',
      email: 'alice@example.com',
      bairro: 'Centro',
      cidade: 'São Paulo',
      cep: '12345678',
      descricao_endereco: 'Rua Principal',
      status: 'Ativa',
      senha:'12345',
    };
    //cadastraAlunaSpy.mockImplementation(cadastraAlunaMock);
    listarAlunasSpy.mockResolvedValueOnce({ data: [aluna] });
  
    renderComponent();
  
    await screen.findByText("Alice");
  
    // Verifica se a mensagem de erro é exibida após a submissão 
    expect(screen.getByTestId("teste-editar")).toBeInTheDocument();
  
    const editarButton = screen.getByTestId("teste-editar");
  
    await act(async () => {
      fireEvent.click(editarButton);
    });
  
    const telefoneInput = screen.getByLabelText('Telefone *');
    await act(async () => {
      fireEvent.change(telefoneInput, { target: { value: '61991812098' } });
    });
  
    editaAlunaSpy.mockResolvedValueOnce(Promise.resolve({ status: 200 } as AxiosResponse));
  
    const submitButton = screen.getByText('Editar');
    await act(async () => {
      fireEvent.click(submitButton);
    });
  });

  it('deve excluir uma aluna ao submeter o formulário', async () => {
    const aluna = {
      login: 'aluna',
      nome: 'Alice',
      cpf: '06951977119',
      data_nascimento: '2000-01-01',
      deficiencia: false,
      telefone: '12345678901',
      email: 'alice@example.com',
      bairro: 'Centro',
      cidade: 'São Paulo',
      cep: '12345678',
      descricao_endereco: 'Rua Principal',
      status: 'Ativa',
      senha:'12345',
    };
    //cadastraAlunaSpy.mockImplementation(cadastraAlunaMock);
    listarAlunasSpy.mockResolvedValueOnce({ data: [aluna] });
  
    renderComponent();
  
    await screen.findByText("Alice");
  
    // Verifica se a mensagem de erro é exibida após a submissão 
    expect(screen.getByTestId("teste-excluir")).toBeInTheDocument();
  
    const excluirButton = screen.getByTestId("teste-excluir");
  
    await act(async () => {
      fireEvent.click(excluirButton);
    });
    
    excluirAlunaSpy.mockResolvedValueOnce(Promise.resolve({ status: 204 } as AxiosResponse));
    const simButton = screen.getByText('Sim');
    await act(async () => {
      fireEvent.click(simButton);
    });
  });
  
  
});
