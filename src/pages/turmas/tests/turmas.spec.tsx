import React from "react";
import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { ThemeProvider } from "styled-components";
import { Turmas } from "../turmas";
import theme from "../../../styles/theme";

describe("Snapshot", () => {
  it("Deve corresponder ao Snapshot", () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <Turmas />
          </ThemeProvider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
