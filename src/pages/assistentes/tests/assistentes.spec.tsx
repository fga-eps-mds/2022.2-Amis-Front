import { Assistentes } from "../assistentes";
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

describe("Assistentes", () => {
  it("Assistentes", async () => {
    const { getByLabelText, queryByText, getByText, findByText, debug } = 
    render(
      // eslint-disable-next-line react/react-in-jsx-scope
      <QueryClientProvider client={queryClient}>
        <Router>
          <ThemeProvider theme={theme}>
            <Assistentes />
          </ThemeProvider>
        </Router>
      </QueryClientProvider>
    );

    const inputNome = getByLabelText("Nome");
    const inputCpf = getByLabelText("CPF");

    void userEvent.type(inputNome, "Lucia");
    void userEvent.type(inputCpf, "54776233468");

    const addButtonCadastrar = getByText("Cadastrar Assistente");
    void userEvent.click(addButtonCadastrar);

    await waitFor(() => {
      const inputLogin = getByLabelText("Login");
      const inputObservacao = getByLabelText("Observações");
      // const inputTurno = getByLabelText("Turno");
      void userEvent.type(inputLogin, "Lucia@gmail.com");
      void userEvent.type(inputObservacao, "Não trabalha aos domingos");
      // void userEvent.type(inputTurno, "1");
    });

    await waitFor(() => {
      const addButtonCadastrar = getByText("Cadastrar");
      void userEvent.click(addButtonCadastrar);
      expect(getByLabelText("Data de Início")).toBeInTheDocument();
    });
  });
});

describe("Snapshot", () => {
  it("Deve corresponder ao Snapshot", () => {
    const tree = renderer
      .create(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <Assistentes />
            </ThemeProvider>
          </BrowserRouter>
        </QueryClientProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
