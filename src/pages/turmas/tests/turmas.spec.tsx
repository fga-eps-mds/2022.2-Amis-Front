import { Turmas } from "../turmas";
import {
  getByAltText,
  getByLabelText,
  getByPlaceholderText,
  getByRole,
  getByTestId,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { Component} from "react";
import { BrowserRouter, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "../../../styles/theme";
import renderer from "react-test-renderer";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../../../services/queryClient";

describe("Snapshot", () => {
  it("Deve corresponder ao Snapshot", () => {
    const tree = renderer
      .create(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <Turmas />
            </ThemeProvider>
          </BrowserRouter>
        </QueryClientProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Tela Turmas", () => {
  it("Tabela Turmas", async () => {
    const { getByLabelText, queryByText, getByText, findByText, debug } = 
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

    const inputTurma = getByLabelText("Turma");
    const inputNumeroVagas = getByLabelText("Número de vagas");
    //const inputDataInicio = getByLabelText("Data de Início");

    void userEvent.type(inputTurma, "Turma 12");
    void userEvent.type(inputNumeroVagas, "35");
    //void userEvent.type(inputDataInicio, "12/03/2023");

    const addButtonCadastrar = getByText("Cadastrar Turma");
    void userEvent.click(addButtonCadastrar);

    await waitFor(() => {
      const inputDataTermino = getByLabelText("Data de Término");
      const inputHorarioInicio = getByLabelText("Horário de Início");
      const inputHorarioTermino = getByLabelText("Horário de Término");
      // const inputTurno = getByLabelText("Turno");
      void userEvent.type(inputDataTermino, "12/04/2023");
      void userEvent.type(inputHorarioInicio, "10:30");
      void userEvent.type(inputHorarioTermino, "11:30");
      // void userEvent.type(inputTurno, "1");
    });

    await waitFor(() => {
      const addButtonCadastrar = getByText("Cadastrar");
      void userEvent.click(addButtonCadastrar);
      expect(getByLabelText("Turma")).toBeInTheDocument();
    });
  });
});

 //   const buttonCadastrar = getByText("Cadastrar");
 //   void userEvent.click(buttonCadastrar);

 //   const labelTurma = getByLabelText("Turma");
 //   void userEvent.type(labelTurma, "turma");
 //   const labelCapacidade = getByLabelText("Número de vagas");
 //   void userEvent.type(labelCapacidade, "10");
 //   const labelTurno = getByLabelText("Turno");
 //   void userEvent.type(labelTurno, "Tarde");
 // });
//});
