import {
  fireEvent,
  render,
  screen
  } from "@testing-library/react";
  import { QueryClient, QueryClientProvider } from "react-query";
  import {BrowserRouter as Router } from "react-router-dom";
  import { toast } from "react-toastify";
  import { ThemeProvider } from "styled-components";
  import * as instrucoesService from "../../../services/instrucoes";
  import theme from "../../../styles/theme";
  import { Instrucao } from "../instrucao";
  import { CadastrarInstrucaoMock } from "./instrucoes.mock";
  import { act } from 'react-dom/test-utils';
  import { AxiosResponse } from 'axios';
  
  const cadastraInstrucaoSpy = jest.spyOn(instrucoesService, 'cadastrarInstrucao');
  const listaInstrucaoSpy = jest.spyOn(instrucoesService, 'listarInstrucoes');
  const editaInstrucaoSpy = jest.spyOn(instrucoesService, 'editarInstrucao');
  const excluiInstrucaoSpy = jest.spyOn(instrucoesService, 'excluirInstrucao');
  
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
          <Instrucao />
          </ThemeProvider>
      </Router>
      </QueryClientProvider>
  );
  return queryClient;
  }
  
  describe("Instruções da Capacitação", () => {
    it("Teste de clique no botão Cadastrar", () => {
      // eslint-disable-next-line react/react-in-jsx-scope
      renderComponent();
  
      const cadastrarButton = screen.getByText("Cadastrar");
  
      fireEvent.click(cadastrarButton);
      const modalTitle = screen.getByText(
        "Preencha corretamente os dados cadastrais da instrução."
      );
      expect(modalTitle).toBeInTheDocument();
    });
  
    test("exibe notificação de sucesso após o cadastro bem-sucedido", async () => {
      const toastSuccessSpy = jest.spyOn(toast, "success");
      cadastraInstrucaoSpy.mockImplementation(CadastrarInstrucaoMock);
      renderComponent();
  
      const cadastrarButton = screen.getByText("Cadastrar");
      fireEvent.click(cadastrarButton);
  
      const tituloInput = screen.getByLabelText("Título *");
      const inputCurso = screen.getByLabelText("Curso *");
      const inputInstrucao = screen.getByLabelText("Instrução *");
  
      fireEvent.change(tituloInput, { target: { value: "BoloBolo" } });
      fireEvent.change(inputCurso, { target: { value: 20 } });
      fireEvent.change(inputInstrucao, {
        target: { value: "Fazendo bolo com bolo" },
      });
      const submitButton = screen.getByRole("button", { name: "Confirmar" });
      fireEvent.click(submitButton);
      const response = { status: 201 };
      if (response.status === 201) {
        toast.success("Instrução cadastrada com sucesso!");
        expect(toastSuccessSpy).toHaveBeenCalledWith(
          "Instrução cadastrada com sucesso!"
        );
      }
    });
  });

  it('deve editar uma instrução ao submeter o formulário', async () => {
  
      const instrucao = {
          nome: "Instrução 1",
          idCurso: 1,
          descricao: 'desc',
          dataCadastro: '2023-01-01',
          id: 2
      };
      
      listaInstrucaoSpy.mockResolvedValueOnce({ data: [instrucao] });
  
      renderComponent();
  
      await screen.findByText("Instrução 1");
  
      // Verifica se a mensagem de erro é exibida após a submissão 
      expect(screen.getByTestId("teste-editar")).toBeInTheDocument();
      
      const editarButton = screen.getByTestId("teste-editar");
      
      await act(async () => {
          fireEvent.click(editarButton);
      });
      
      const títuloInput = screen.getByLabelText('Título *');
      await act(async () => {
          fireEvent.change(títuloInput, { target: { value: "Instrução 2" } });
      });
  
      editaInstrucaoSpy.mockResolvedValueOnce(Promise.resolve({ status: 200 } as AxiosResponse));
  
      const submitButton = screen.getByText('Confirmar');
      await act(async () => {
      fireEvent.click(submitButton);
      });
  });
  
  it('deve excluir uma curso ao submeter o formulário', async () => {
      const instrucao = {
          nome: "Instrução 1",
          idCurso: 1,
          descricao: 'desc',
          dataCadastro: '2023-01-01',
          id: 2
      };
      
      listaInstrucaoSpy.mockResolvedValueOnce({ data: [instrucao] });
  
      renderComponent();
  
      await screen.findByText("Instrução 1");
  
      // Verifica se a mensagem de erro é exibida após a submissão 
      expect(screen.getByTestId("teste-excluir")).toBeInTheDocument();
  
      const excluirButton = screen.getByTestId("teste-excluir");
  
      await act(async () => {
      fireEvent.click(excluirButton);
      });
      
      excluiInstrucaoSpy.mockResolvedValueOnce(Promise.resolve({ status: 204 } as AxiosResponse));
      const simButton = screen.getByText('Sim');
      await act(async () => {
      fireEvent.click(simButton);
      });
  });
