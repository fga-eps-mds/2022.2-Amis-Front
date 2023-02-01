import { Receitas } from "../receitas";
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
import { BrowserRouter, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "../../../styles/theme";
import renderer from "react-test-renderer";
import { QueryClientProvider } from "react-query";
import { queryClient } from "../../../services/queryClient";

//describe("receitas", () => {
//it("Receitas", async () => {
    // eslint-disable-next-line react/react-in-jsx-scope
//  const { getByText, queryByText, getByLabelText, findByText, debug } =
//    render(
        // eslint-disable-next-line react/react-in-jsx-scope
//      <QueryClientProvider client={queryClient}>
//        <Router>
//          <ThemeProvider theme={theme}>
//            <Receitas />
//          </ThemeProvider>
//        </Router>
//      </QueryClientProvider>
//    );

//  const inputNome = getByLabelText("Nome");
//  const inputIngrediente = getByLabelText("Ingrediente");

//  void userEvent.type(inputNome, "Pão de queijo");
//  void userEvent.type(inputIngrediente, "Farinha");

//  const addButtonCadastrar = getByText("Cadastrar Receita");
//  void userEvent.click(addButtonCadastrar);

//  await waitFor(() => {
//  const inputModoPreparo = getByLabelText("Modo de preparo");
//    void userEvent.type(inputModoPreparo, "Assar por 30 minutos");
//  });

//  await waitFor(() => {
//    const addButtonCadastrar = getByText("Cadastrar");
//    void userEvent.click(addButtonCadastrar);
//    expect(getByLabelText("Modo de preparo")).toBeInTheDocument();
//    });
//  });
//});


describe("Snapshot", () => {
  it("Deve corresponder ao Snapshot", () => {
    const tree = renderer
      .create(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <Receitas />
            </ThemeProvider>
          </BrowserRouter>
        </QueryClientProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
