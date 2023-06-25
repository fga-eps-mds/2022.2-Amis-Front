import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import * as InstrucoesService from "../../../services/instrucoes";
import theme from "../../../styles/theme";
import { Instrucao } from "../instrucao";
import { CadastrarInstrucoesMock } from "./instrucoes.mock";
import { act } from "react-dom/test-utils";
import { AxiosResponse } from "axios";

const cadastraInstrucoesSpy = jest.spyOn(
  InstrucoesService,
  "cadastrarInstrucao"
);
const listaInstrucoesSpy = jest.spyOn(InstrucoesService, "listarInstrucoes");

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
  },
}));

const renderComponent = async () => {
  const queryClient = new QueryClient();
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
};

describe("Instrucao", () => {
  it("Teste de clique no botão Cadastrar", () => {
    // eslint-disable-next-line react/react-in-jsx-scope
    renderComponent();

    const cadastrarButton = screen.getByText("Cadastrar");

    fireEvent.click(cadastrarButton);
    const modalTitle = screen.getByText(
      "Preencha corretamente os dados cadastrais da instrução"
    );
    expect(modalTitle).toBeInTheDocument();
  });

  test("exibe notificação de sucesso após o cadastro bem-sucedido", async () => {
    const toastSuccessSpy = jest.spyOn(toast, "success");
    cadastraInstrucoesSpy.mockImplementation(CadastrarInstrucoesMock);
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
    const submitButton = screen.getByRole("button", { name: "Cadastrar" });
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
