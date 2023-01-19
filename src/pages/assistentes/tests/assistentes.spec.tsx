import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { ThemeProvider } from "styled-components";
import theme from "../../../styles/theme";
import { Assistentes } from "../assistentes";

describe("Snapshot", () => {
  it("Deve corresponder ao Snapshot", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <Assistentes />
          </ThemeProvider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
