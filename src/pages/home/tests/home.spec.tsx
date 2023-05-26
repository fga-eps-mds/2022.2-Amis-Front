import { render } from "@testing-library/react";
import { Home } from "../home";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "../../../styles/theme";


const renderComponent = async()=> {
  const queryClient = new QueryClient ();
  render(
    // eslint-disable-next-line react/react-in-jsx-scope
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider theme={theme}>
          <Home />
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
  return queryClient;
}

describe("Home", () => {
  it("Teste para renderizar o componente",  () => {
    // eslint-disable-next-line react/react-in-jsx-scope
    renderComponent();
  });
});
