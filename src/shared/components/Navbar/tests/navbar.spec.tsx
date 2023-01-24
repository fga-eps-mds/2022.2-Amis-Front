import { QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { ThemeProvider } from "styled-components";
import { queryClient } from "../../../../services/queryClient";
import theme from "../../../../styles/theme";
import { Navbar } from "../navbar";

describe("Snapshot", () => {
  it("Deve corresponder ao Snapshot", () => {
    const tree = renderer
      .create(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <Navbar />
            </ThemeProvider>
          </BrowserRouter>
        </QueryClientProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
