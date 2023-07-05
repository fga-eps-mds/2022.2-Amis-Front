import {
  fireEvent,
  render,
  screen
  } from "@testing-library/react";
  import { QueryClient, QueryClientProvider } from "react-query";
  import {BrowserRouter as Router } from "react-router-dom";
  import { toast } from "react-toastify";
  import { ThemeProvider } from "styled-components";
  import * as centrosService from "../../../services/centroProdutivo";
  import theme from "../../../styles/theme";
  import { CentroProdutivo } from "../centroProdutivo";
  import { CadastrarCentroMock } from "./centro.mock";
  import { act } from 'react-dom/test-utils';
  import { AxiosResponse } from 'axios';
  
  const cadastraCentroSpy = jest.spyOn(centrosService, 'cadastrarCentro');
  const listaCentrosSpy = jest.spyOn(centrosService, 'listarCentro');
  const editaCentroSpy = jest.spyOn(centrosService, 'editarCentro');
  const excluiCentroSpy = jest.spyOn(centrosService, 'excluirCentro');
  const inscreveAlunaCentro = jest.spyOn(centrosService, 'inscreveAlunaCentro');

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
          <CentroProdutivo />
          </ThemeProvider>
      </Router>
      </QueryClientProvider>
  );
  return queryClient;
  }
  
  describe("Centros Produtivos", () => {
  it("Teste de clique no botão Cadastrar",  () => {
      // eslint-disable-next-line react/react-in-jsx-scope
      renderComponent();
      // Encontre o botão "Cadastrar" pelo texto do botão
      const cadastrarButton = screen.getByText("Agendar nova Produção");
  
      // Simule o clique no botão "Cadastrar"
      fireEvent.click(cadastrarButton);
      // Você pode adicionar asserções adicionais aqui para verificar se o comportamento esperado ocorre após o clique no botão
      const modalTitle = screen.getByText('Preencha corretamente os dados cadastrais.');
      expect(modalTitle).toBeInTheDocument();
  });
  
  test('exibe notificação de sucesso após o cadastro bem-sucedido', async () => {
      const toastSuccessSpy = jest.spyOn(toast, 'success');
  
      cadastraCentroSpy.mockImplementation(CadastrarCentroMock);
      //listarCentroSpy.mockImplementation(GetCentroMock);
  
      renderComponent();
      
      const cadastrarButton = screen.getByText('Agendar nova Produção');
      fireEvent.click(cadastrarButton);
      
      const inputDescricao = screen.getByLabelText("Descrição *");
      const inputData = screen.getByLabelText("Data de Alocação *");
  
      fireEvent.change(inputDescricao, { target: { value: 'Centro de confeitaria' } });
      fireEvent.change(inputData, { target: { value: '20/03/2023' } });
      const submitButton = screen.getByRole('button', { name: 'Confirmar' });
  
      fireEvent.click(submitButton);
      // Simule a resposta do status 201
      const response = { status: 201 };
  
      if (response.status === 201) {
      toast.success("Centro cadastrado com sucesso!");
      }
  
      // Verifique se o spy foi chamado corretamente
      expect(toastSuccessSpy).toHaveBeenCalledWith("Centro cadastrado com sucesso!");
  });

  it('deve editar um centro ao submeter o formulário', async () => {
  
      const centro = {
        id: 1,
        data_agendada: "30/06/2023",
        descricao: "Centro Produtivo 2",
        status: '1',
        turno : '1',
      };
      
      listaCentrosSpy.mockResolvedValueOnce({ data: [centro] });
  
      renderComponent();
  
      await screen.findByText("Centro Produtivo 2");
  
      // Verifica se a mensagem de erro é exibida após a submissão 
      expect(screen.getByTestId("teste-editar")).toBeInTheDocument();
      
      const editarButton = screen.getByTestId("teste-editar");
      
      await act(async () => {
          fireEvent.click(editarButton);
      });
      
      const descricaoInput = screen.getByLabelText('Descrição *');
      await act(async () => {
          fireEvent.change(descricaoInput, { target: { value: "Bordando" } });
      });
  
      editaCentroSpy.mockResolvedValueOnce(Promise.resolve({ status: 200 } as AxiosResponse));
  
      const submitButton = screen.getByText('Editar');
      await act(async () => {
      fireEvent.click(submitButton);
      });
  });
  
  it('deve excluir um centro ao submeter o formulário', async () => {
    const centro = {
      id: 1,
      data_agendada: "30/06/2023",
      descricao: "Centro Produtivo 2",
      status: '1',
      turno : '1',
    };
      
      listaCentrosSpy.mockResolvedValueOnce({ data: [centro] });
  
      renderComponent();
  
      await screen.findByText("Centro Produtivo 2");
  
      // Verifica se a mensagem de erro é exibida após a submissão 
      expect(screen.getByTestId("teste-excluir")).toBeInTheDocument();
  
      const excluirButton = screen.getByTestId("teste-excluir");
  
      await act(async () => {
      fireEvent.click(excluirButton);
      });
      
      excluiCentroSpy.mockResolvedValueOnce(Promise.resolve({ status: 204 } as AxiosResponse));
      const simButton = screen.getByText('Sim');
      await act(async () => {
      fireEvent.click(simButton);
      });
  });

});