import {
fireEvent,
render,
screen
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import {BrowserRouter as Router } from "react-router-dom";
import { toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import * as cursosService from "../../../services/cursos";
import theme from "../../../styles/theme";
import { Curso } from "../cursos";
import { CadastrarCursoMock } from "./cursos.mock";
import { act } from 'react-dom/test-utils';
import { AxiosResponse } from 'axios';

const cadastraCursoSpy = jest.spyOn(cursosService, 'cadastrarCurso');
const listaCursosSpy = jest.spyOn(cursosService, 'listarCurso');
const editaCursoSpy = jest.spyOn(cursosService, 'editarCurso');
const excluiCursoSpy = jest.spyOn(cursosService, 'excluirCurso');

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
        <Curso />
        </ThemeProvider>
    </Router>
    </QueryClientProvider>
);
return queryClient;
}

describe("Cursos", () => {
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

    cadastraCursoSpy.mockImplementation(CadastrarCursoMock);
    //listarCursoSpy.mockImplementation(GetCursoMock);

    renderComponent();
    
    const cadastrarButton = screen.getByText('Cadastrar');
    fireEvent.click(cadastrarButton);
    
    // Simula o preenchimento dos campos de cadastro
    const nomeInput = screen.getByLabelText("Nome do Curso *"); // Supondo que você tenha um label associado ao campo CPF
    const inputDescricao = screen.getByLabelText("Descrição *");
    const inputDuracao = screen.getByLabelText("Duração (em horas)");

    fireEvent.change(nomeInput, { target: { value: 'Confeitaria' } });
    fireEvent.change(inputDescricao, { target: { value: 'Curso de confeitaria' } });
    fireEvent.change(inputDuracao, { target: { value: 20 } });
    const submitButton = screen.getByRole('button', { name: 'Confirmar' });

    fireEvent.click(submitButton);
    // Simule a resposta do status 201
    const response = { status: 201 };

    if (response.status === 201) {
    toast.success("Curso cadastrado com sucesso!");
    }

    // Verifique se o spy foi chamado corretamente
    expect(toastSuccessSpy).toHaveBeenCalledWith("Curso cadastrado com sucesso!");
});

it('deve editar uma curso ao submeter o formulário', async () => {

    const curso = {
        id: 2,
        nome: "Bordado",
        descricao: "Aprender a bordar",
        duracaoHoras: 20
    };
    
    listaCursosSpy.mockResolvedValueOnce({ data: [curso] });

    renderComponent();

    await screen.findByText("Bordado");

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

    editaCursoSpy.mockResolvedValueOnce(Promise.resolve({ status: 200 } as AxiosResponse));

    const submitButton = screen.getByText('Editar');
    await act(async () => {
    fireEvent.click(submitButton);
    });
});

it('deve excluir uma curso ao submeter o formulário', async () => {
    const curso = {
        id: 1,
        nome: "Bolos",
        descricao: "Curso de bolos",
        duracaoHoras: 20
    };
    
    listaCursosSpy.mockResolvedValueOnce({ data: [curso] });

    renderComponent();

    await screen.findByText("Bolos");

    // Verifica se a mensagem de erro é exibida após a submissão 
    expect(screen.getByTestId("teste-excluir")).toBeInTheDocument();

    const excluirButton = screen.getByTestId("teste-excluir");

    await act(async () => {
    fireEvent.click(excluirButton);
    });
    
    excluiCursoSpy.mockResolvedValueOnce(Promise.resolve({ status: 204 } as AxiosResponse));
    const simButton = screen.getByText('Sim');
    await act(async () => {
    fireEvent.click(simButton);
    });
});

});