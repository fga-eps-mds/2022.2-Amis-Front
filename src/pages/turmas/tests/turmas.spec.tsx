import React from "react";
import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { ThemeProvider } from "styled-components";
import { Turmas } from "../turmas";
import theme from "../../../styles/theme";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Snapshot", () => {
  it("Deve corresponder ao Snapshot", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <Turmas />
          </ThemeProvider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Tela Turmas", () => {
  it("Tabela Turmas", () => {
    const { getByLabelText, getByText } = render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <Turmas />
        </ThemeProvider>
      </BrowserRouter>
    );

    const buttonCadastrar = getByText("Cadastrar");
    void userEvent.click(buttonCadastrar);

    const labelTurma = getByLabelText("Turma");
    void userEvent.type(labelTurma, "turma");
    const labelCapacidade = getByLabelText("Número de vagas");
    void userEvent.type(labelCapacidade, "10");
    const labelTurno = getByLabelText("Turno");
    void userEvent.type(labelTurno, "Tarde");
  });
});
