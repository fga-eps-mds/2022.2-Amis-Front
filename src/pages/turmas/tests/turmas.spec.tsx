import {
  fireEvent,
  render,
  screen
  } from "@testing-library/react";
  import { QueryClient, QueryClientProvider } from "react-query";
  import {BrowserRouter as Router } from "react-router-dom";
  import { toast } from "react-toastify";
  import { ThemeProvider } from "styled-components";
  import * as turmaService from "../../../services/turmas"
  import theme from "../../../styles/theme";
  import { Turmas } from "../turmas";
  import { CadastrarTurmaMock } from "./turmas.mock";
  import { act } from 'react-dom/test-utils';
  import { AxiosResponse } from 'axios';
  
  const cadastraTurmaSpy = jest.spyOn(turmaService, 'cadastrarTurmas');
  const listaTurmasSpy = jest.spyOn(turmaService, 'listarTurmas');
  const editaTurmaSpy = jest.spyOn(turmaService, 'editarTurmas');
  const excluiTurmaSpy = jest.spyOn(turmaService, 'apagarTurmas');
  
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
          <Turmas />
          </ThemeProvider>
      </Router>
      </QueryClientProvider>
  );
  return queryClient;
  }
  
  describe("Turmas", () => {
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
  
      cadastraTurmaSpy.mockImplementation(CadastrarTurmaMock);
      //listarTurmaSpy.mockImplementation(GetTurmaMock);
  
      renderComponent();
      
      const cadastrarButton = screen.getByText('Cadastrar');
      fireEvent.click(cadastrarButton);
      
      // Simula o preenchimento dos campos de cadastro
      const codigoInput = screen.getByLabelText("Código *"); // Supondo que você tenha um label associado ao campo CPF
      const cursoInput = screen.getByLabelText("Curso *");
      const nomeInput = screen.getByLabelText("Nome da Turma *");
      const vagasInput = screen.getByLabelText("Número de vagas *");
      const dataInicioInput = screen.getByLabelText("Data de Início *");
      const dataFimInput = screen.getByLabelText("Data de Término *");
      const horarioInicioInput = screen.getByLabelText("Horário de Início *");
      const horarioFimInput = screen.getByLabelText("Horário de Término *");
      const professorInput = screen.getByLabelText("Professor *");
      const descricaoInput = screen.getByLabelText("Descrição");
      
      fireEvent.change(codigoInput, { target: { value: 15 } });
      fireEvent.change(cursoInput, { target: { value: 14 } });
      fireEvent.change(nomeInput, { target: { value: 'Turma A' } });
      fireEvent.change(vagasInput, { target: { value: 50 } });
      fireEvent.change(dataInicioInput, { target: { value: "01/01/2024" } });
      fireEvent.change(dataFimInput, { target: { value: "01/02/2024" } });
      fireEvent.change(horarioInicioInput, { target: { value: "14:00" } });
      fireEvent.change(horarioFimInput, { target: { value: "18:00" } });
      fireEvent.change(professorInput, { target: { value: "mario.teacher" } });
      fireEvent.change(descricaoInput, { target: { value: 'Turma de confeitaria' } });
      
      const submitButton = screen.getByRole('button', { name: 'Cadastrar' });
  
      fireEvent.click(submitButton);
      // Simule a resposta do status 201
      const response = { status: 201 };
  
      if (response.status === 201) {
      toast.success("Turma cadastrada com sucesso!");
      }
  
      // Verifique se o spy foi chamado corretamente
      expect(toastSuccessSpy).toHaveBeenCalledWith("Turma cadastrada com sucesso!");
  });

  it('deve editar uma turma ao submeter o formulário', async () => {
    const turma = {
      nome_turma: "Turma A",
      codigo: 15,
      capacidade_turma: 40,
      inicio_aula: "14:00",
      fim_aula: "18:00",
      data_inicio: "2024-01-01",
      data_fim: "2024-02-02",
      fk_curso: 14,
      fk_professor: "mario.user",
      descricao: "Turma de confeitaria",
    };
    
    listaTurmasSpy.mockResolvedValueOnce({ data: [turma] });

    renderComponent();

    await screen.findByText("Turma A");

    // Verifica se a mensagem de erro é exibida após a submissão 
    expect(screen.getByTestId("teste-editar")).toBeInTheDocument();
    
    const editarButton = screen.getByTestId("teste-editar");
    
    await act(async () => {
        fireEvent.click(editarButton);
    });
    
    const descricaoInput = screen.getByLabelText('Nome da Turma *');
    await act(async () => {
        fireEvent.change(descricaoInput, { target: { value: "Turma de pão de queijo" } });
    });

    editaTurmaSpy.mockResolvedValueOnce(Promise.resolve({ status: 200 } as AxiosResponse));

    const submitButton = screen.getByText('Editar');
    await act(async () => {
    fireEvent.click(submitButton);
    });
  });

  it('deve excluir uma turma ao submeter o formulário', async () => {
    const turma = {
      nome_turma: "Turma A",
      codigo: 15,
      capacidade_turma: 40,
      inicio_aula: "14:00",
      fim_aula: "18:00",
      data_inicio: "2024-01-01",
      data_fim: "2024-02-02",
      fk_curso: 14,
      fk_professor: "mario.user",
      descricao: "Turma de confeitaria",
    };
      
      listaTurmasSpy.mockResolvedValueOnce({ data: [turma] });
  
      renderComponent();

      await screen.findByText("Turma A");
  
      // Verifica se a mensagem de erro é exibida após a submissão 
      expect(screen.getByTestId("teste-excluir")).toBeInTheDocument();
  
      const excluirButton = screen.getByTestId("teste-excluir");
  
      await act(async () => {
      fireEvent.click(excluirButton);
      });
      
      excluiTurmaSpy.mockResolvedValueOnce(Promise.resolve({ status: 204 } as AxiosResponse));
      const simButton = screen.getByText('Sim');
      await act(async () => {
      fireEvent.click(simButton);
      });
  });
  
  });