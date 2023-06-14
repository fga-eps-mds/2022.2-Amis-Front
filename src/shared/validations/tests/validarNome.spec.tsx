import { toast } from "react-toastify";
import { validateNome } from "../validarNome";

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("Validar Nome", () => {
  it("nome válido", () => {
    const nome = "John Doe";
    const result = validateNome(nome);
    expect(result).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("nome inválido", () => {
    const nome = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit";
    
    const result = validateNome(nome);
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Nome inválido.");
  });
});
