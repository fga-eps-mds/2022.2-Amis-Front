import React from "react";
import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { ThemeProvider } from "styled-components";
import { Assistentes } from "../assistentes";
import theme from "../../../styles/theme";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Snapshot", () => {
  it("Deve corresponder ao Snapshot", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <Assistentes />
          </ThemeProvider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Tela Assistentes", () => {
  it("Tabela Assistentes", () => {
    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Assistentes />
        </ThemeProvider>
      </BrowserRouter>
    );

    const buttonCadastrar = getByText(/Cadastrar/);
    void userEvent.click(buttonCadastrar);

    const labelNome = getByLabelText("Nome");
    void userEvent.type(labelNome, "Maria");

    const labelCPF = getByLabelText("CPF (apenas números)");
    void userEvent.type(labelCPF, "63218471001");

    const labelLogin = getByLabelText("Login");
    void userEvent.type(labelLogin, "Maria1971");

    const labelObservacoes = getByLabelText("Observações");
    void userEvent.type(labelObservacoes, "Disponibilidade segundas e terças");

    const labelADM = getByLabelText("Administrador(a)");
    void userEvent.selectOptions(labelADM, ["Sim", "Não"]);

    const buttonCadastrar2 = getByText(/Cadastrar/);
    void userEvent.click(buttonCadastrar2);
  });
});
