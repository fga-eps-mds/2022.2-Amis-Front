import { QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { ThemeProvider } from "styled-components";
import AppRoutes from "../routes";
import { queryClient } from "../services/queryClient";
import theme from "../styles/theme";

describe("Snapshot", () => {
  it("Deve corresponder ao Snapshot", () => {
    const tree = renderer
      .create(
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <AppRoutes />
          </ThemeProvider>
        </QueryClientProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
