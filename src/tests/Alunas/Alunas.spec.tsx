import { Alunas } from "../../pages/alunas/alunas";
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
import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "../../styles/theme";

describe("alunas", () => {
  it("Alunas", async () => {
    // eslint-disable-next-line react/react-in-jsx-scope
    const { getByText, queryByText, getByLabelText, findByText, debug } =
      render(
        // eslint-disable-next-line react/react-in-jsx-scope
        <Router>
          <ThemeProvider theme={theme}>
            <Alunas />
          </ThemeProvider>
        </Router>
      );

    const inputNome = getByLabelText("Nome");
    const inputCpf = getByLabelText("CPF");
    const inputNascimento = getByLabelText("Data Nascimento");

    void userEvent.type(inputNome, "kalebe");
    void userEvent.type(inputCpf, "432432");
    void userEvent.type(inputNascimento, "123");

    const addButtonCadastrar = getByText("Cadastrar Aluno(a)");
    void userEvent.click(addButtonCadastrar);

    await waitFor(() => {
      const inputRg = getByLabelText("RG");
      const inputNomePai = getByLabelText("Nome do pai");
      const inputNomeMae = getByLabelText("Nome da mãe");
      // const inputDeficiencia = getByLabelText("Possui deficiência?");
      void userEvent.type(inputRg, "123123");
      void userEvent.type(inputNomePai, "kalebe");
      void userEvent.type(inputNomeMae, "kalebe");
      // void userEvent.type(inputDeficiencia, "Sim");
    });

    await waitFor(() => {
      const addButtonCadastrar = getByText("Cadastrar");
      void userEvent.click(addButtonCadastrar);
      expect(getByLabelText("Nome do pai")).toBeInTheDocument();
    });
  });
});
