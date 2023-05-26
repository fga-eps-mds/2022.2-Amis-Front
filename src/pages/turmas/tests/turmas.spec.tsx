import { render } from "@testing-library/react";
import { Turmas } from "../turmas";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "../../../styles/theme";
import * as turmasService from "../../../services/turmas";
import { listarAlunasMock } from "./turmas.mock";

const listarAlunasSpy = jest.spyOn(turmasService, 'listarAlunas');
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
          <Turmas />
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
  return queryClient;
}

describe("Turmas", () => {
  it("Teste para renderizar o componente",  () => {
    listarAlunasSpy.mockImplementation(listarAlunasMock);
    // eslint-disable-next-line react/react-in-jsx-scope
    renderComponent();
  });
});
