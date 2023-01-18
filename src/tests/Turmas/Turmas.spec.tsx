import { Turmas } from "../../pages/turmas/turmas";
import {
  getByAltText,
  getByLabelText,
  getByPlaceholderText,
  getByRole,
  getByTestId,
  render,
  screen,
  waitFor
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";

describe("turmas", () => {
  it("Turmas", async () => {
    // eslint-disable-next-line react/react-in-jsx-scope
    const { getByText, queryByText, getByLabelText, findByText, debug } =
      render(
        // eslint-disable-next-line react/react-in-jsx-scope
        <Router>
          <Turmas />
        </Router>
      );

    await waitFor(() => {
      const descricao = getByLabelText("descricao");
      const capacidade = getByLabelText("capacidade");
      const horarioInicio = getByLabelText("horarioInicio");
      const horarioFim = getByLabelText("horarioFim");
      const dataInicio = getByLabelText("dataInicio");
      const dataFim = getByLabelText("dataFim");
      const turno = getByLabelText("turno");

      void userEvent.type(descricao, "Turma 2");
      void userEvent.type(capacidade, "542");
      void userEvent.type(horarioInicio, "12:20");
      void userEvent.type(horarioFim, "04:30");
      void userEvent.type(dataInicio, "20/12/2023");
      void userEvent.type(dataFim, "20/09/2024");
      void userEvent.type(turno, "Tarde");

      const addButtonCadastrar = getByText("Cadastrar");
      void userEvent.click(addButtonCadastrar);
    });

    await waitFor(() => {
      const addButtonCadastrar = getByText("Cadastrar");
      void userEvent.click(addButtonCadastrar);
      expect(getByLabelText("Turno")).toBeInTheDocument();
    });
  });
});