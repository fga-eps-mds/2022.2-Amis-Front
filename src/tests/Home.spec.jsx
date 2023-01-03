import React from "react";
import { render } from "@testing-library/react";
import Title from "../shared/components/Title";

describe("Title", () => {
  it("Testando texto do Título", () => {
    render(<Title>Titulo de Teste</Title>);
    const title = screen.getByTestId("Titulo do teste");

    expect(title).toBeInTheDocument();
  });
});
