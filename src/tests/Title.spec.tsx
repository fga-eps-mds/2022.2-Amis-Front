import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Theme from "../styles/theme";
import Title from "../shared/components/Title/Title";

describe("Title", () => {
  it("Testando renderização do component de Título", () => {
    const testTitle = "Titulo de teste";
    render(
      <ThemeProvider theme={Theme}>
        <Title fontSize={24} fontWeight={400}>
          {testTitle}
        </Title>
      </ThemeProvider>
    );

    const title = screen.getByText(testTitle);
    expect(title).toBeInTheDocument();
  });
});
