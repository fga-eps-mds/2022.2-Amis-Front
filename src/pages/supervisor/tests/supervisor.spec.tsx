import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import * as supervisorService from "../../../services/supervisor";
import theme from "../../../styles/theme";
import { act } from "react-dom/test-utils";
import { AxiosResponse } from "axios";
import { Supervisor } from "../supervisor";
import { CadastrarSupervisorMock, GetSupervisorMock } from "./supervisor.mock";
import { SupervisorDTO } from "../dtos/SupervisorDTO";

const cadastrarSupervisorSpy = jest.spyOn(
  supervisorService,
  "cadastrarSupervisor"
);
const listarSupervisorSpy = jest.spyOn(supervisorService, "listarSupervisor");
const editarSupervisorSpy = jest.spyOn(supervisorService, "editarSupervisor");
const excluirSupervisorSpy = jest.spyOn(supervisorService, "excluirSupervisor");

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const renderComponent = async () => {
  const queryClient = new QueryClient();
  render(
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider theme={theme}>
          <Supervisor />
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
  return queryClient;
};

describe("Supervisor", () => {
  it("Teste de clique no botão Cadastrar", async () => {
    await renderComponent();
    // Encontre o botão "Cadastrar" pelo texto do botão
    const cadastrarButton = screen.getByText("Cadastrar");

    // Simule o clique no botão "Cadastrar"
    fireEvent.click(cadastrarButton);
    // Você pode adicionar asserções adicionais aqui para verificar se o comportamento esperado ocorre após o clique no botão
    const modalTitle = screen.getByText(
      "Preencha corretamente os dados cadastrais."
    );
    expect(modalTitle).toBeInTheDocument();
  });

  test("exibe notificação de sucesso após o cadastro bem-sucedido", async () => {
    const toastSuccessSpy = jest.spyOn(toast, "success");

    cadastrarSupervisorSpy.mockImplementation(CadastrarSupervisorMock);
    listarSupervisorSpy.mockImplementation(GetSupervisorMock);

    await renderComponent();

    const cadastrarButton = screen.getByText("Cadastrar");
    fireEvent.click(cadastrarButton);

    // Simula o preenchimento dos campos de cadastro
    const nomeInput = screen.getByLabelText("Nome Completo *");
    const emailInput = screen.getByLabelText("Email *");
    const loginInput = screen.getByLabelText("Login *");
    const senhaInput = screen.getByLabelText("Senha *");
    const senhaConfirmadaInput = screen.getByLabelText("Confirmar Senha *");
    const dataNascimentoInput = screen.getByLabelText("Data de Nascimento *");
    const telefoneInput = screen.getByLabelText("Telefone *");
    console.log({
      senhaInput,
      senhaConfirmadaInput,
    });

    await act(() => {
      fireEvent.change(nomeInput, {
        target: { value: "Nome Completo De Alguem" },
      });
      fireEvent.change(emailInput, {
        target: { value: "test@gmail.com" },
      });
      fireEvent.change(loginInput, { target: { value: "testLogin" } });
      fireEvent.change(senhaInput, { target: { value: "senhaMuitoForte123" } });
      fireEvent.change(senhaConfirmadaInput, {
        target: { value: "senhaMuitoForte123" },
      });
      fireEvent.change(dataNascimentoInput, {
        target: { value: "21052003" },
      });
      fireEvent.change(telefoneInput, {
        target: { value: "61912341234" },
      });
      const submitButton = screen.getByRole("button", { name: "Confirmar" });
      fireEvent.click(submitButton);
    });

    // Verifique se o spy foi chamado corretamente
    expect(toastSuccessSpy).toHaveBeenCalledWith(
      "Curso cadastrado com sucesso!"
    );
  });

  it("deve editar um supervisor ao submeter o formulário", async () => {
    const supervisor: SupervisorDTO = {
      nome: "Bordado",
      cpf: "12345678910",
      email: "test@gmail.com",
      telefone: "12345678910",
      data_nascimento: "2021-10-10",
      senha: "senha",
      senhaConfirmada: "senha",
      login: "login",
    };

    listarSupervisorSpy.mockResolvedValueOnce({
      data: [supervisor],
    } as AxiosResponse);

    await renderComponent();

    await screen.findByText("Bordado");
    // await screen.findByTestId("teste-editar");

    // Verifica se a mensagem de erro é exibida após a submissão
    expect(screen.getByTestId("teste-editar")).toBeInTheDocument();

    const editarButton = screen.getByTestId("teste-editar");

    await act(async () => {
      fireEvent.click(editarButton);
    });

    const nomeInput = screen.getByLabelText("Nome Completo *");
    const emailInput = screen.getByLabelText("Email *");
    const loginInput = screen.getByLabelText("Login *");
    const dataNascimentoInput = screen.getByLabelText("Data de Nascimento *");
    const telefoneInput = screen.getByLabelText("Telefone *");

    fireEvent.change(nomeInput, {
      target: { value: "Nome Completo De Alguem" },
    });
    fireEvent.change(emailInput, {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(loginInput, { target: { value: "testLogin" } });
    fireEvent.change(dataNascimentoInput, {
      target: { value: "21052003" },
    });
    fireEvent.change(telefoneInput, {
      target: { value: "61912341234" },
    });

    editarSupervisorSpy.mockResolvedValueOnce(
      Promise.resolve({ status: 200 } as AxiosResponse)
    );

    const submitButton = screen.getByText("Editar");
    await act(async () => {
      fireEvent.click(submitButton);
    });
  });

  it("deve excluir um supervisor ao submeter o formulário", async () => {
    const supervisor: SupervisorDTO = {
      nome: "Bordado",
      cpf: "12345678910",
      email: "test@gmail.com",
      telefone: "12345678910",
      data_nascimento: "2021-10-10",
      login: "test",
      senha: "senha",
      senhaConfirmada: "senha",
    };

    listarSupervisorSpy.mockResolvedValueOnce({
      data: [supervisor],
    } as AxiosResponse);

    await renderComponent();

    await screen.findByText("Ações");
    await screen.findByTestId("teste-excluir");

    // Verifica se a mensagem de erro é exibida após a submissão
    expect(screen.getByTestId("teste-excluir")).toBeInTheDocument();

    const excluirButton = screen.getByTestId("teste-excluir");

    await act(async () => {
      fireEvent.click(excluirButton);
    });

    excluirSupervisorSpy.mockResolvedValueOnce(Promise.resolve());
    const simButton = screen.getByText("Sim");
    await act(async () => {
      fireEvent.click(simButton);
    });
  });

  it("deve aparecer um erro caso a confirmação de senha não bata", async () => {
    const toastErrorSpy = jest.spyOn(toast, "error");

    cadastrarSupervisorSpy.mockImplementation(CadastrarSupervisorMock);
    listarSupervisorSpy.mockImplementation(GetSupervisorMock);

    await renderComponent();

    const cadastrarButton = screen.getByText("Cadastrar");
    fireEvent.click(cadastrarButton);

    // Simula o preenchimento dos campos de cadastro
    const nomeInput = screen.getByLabelText("Nome Completo *");
    const emailInput = screen.getByLabelText("Email *");
    const loginInput = screen.getByLabelText("Login *");
    const senhaInput = screen.getByLabelText("Senha *");
    const senhaConfirmadaInput = screen.getByLabelText("Confirmar Senha *");
    const dataNascimentoInput = screen.getByLabelText("Data de Nascimento *");
    const telefoneInput = screen.getByLabelText("Telefone *");

    await act(() => {
      fireEvent.change(nomeInput, {
        target: { value: "Nome Completo De Alguem" },
      });
      fireEvent.change(emailInput, {
        target: { value: "test@gmail.com" },
      });
      fireEvent.change(loginInput, { target: { value: "testLogin" } });
      fireEvent.change(senhaInput, { target: { value: "senhaMuitoForte123" } });
      fireEvent.change(senhaConfirmadaInput, {
        target: { value: "senhaDiferente123" },
      });
      fireEvent.change(dataNascimentoInput, {
        target: { value: "21052003" },
      });
      fireEvent.change(telefoneInput, {
        target: { value: "61912341234" },
      });

      const submitButton = screen.getByRole("button", { name: "Confirmar" });

      fireEvent.click(submitButton);
    });

    // Verifique se o spy foi chamado corretamente
    expect(toastErrorSpy).toHaveBeenCalledWith("As senhas não coincidem");
  });
});
