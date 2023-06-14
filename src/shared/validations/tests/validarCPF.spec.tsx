import { toast } from "react-toastify";
import { validateCPF } from "../validarCPF";

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("Validar CPF", () => {
  it("CPF válido", () => {
    const cpf = "123.456.789-09";
    const result = validateCPF(cpf);
    expect(result).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("CPF inválido", () => {
    const cpf = "11111111111";
    const result = validateCPF(cpf);
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("O CPF informado é inválido.");
  });
});
