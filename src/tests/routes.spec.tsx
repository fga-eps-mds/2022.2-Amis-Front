import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "styled-components";
import AppRoutes from "../routes";
import theme from "../styles/theme";
import { render } from "@testing-library/react";




const renderComponent = async()=> {
  const queryClient = new QueryClient ();
  render(
    // eslint-disable-next-line react/react-in-jsx-scope
    <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <AppRoutes />
          </ThemeProvider>
    </QueryClientProvider>
  );
  return queryClient;
}

describe("AppRoutes", () => {
  it("Teste para renderizar o componente",  () => {
    // eslint-disable-next-line react/react-in-jsx-scope
    renderComponent();
  });
});
