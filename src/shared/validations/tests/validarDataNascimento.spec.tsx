import { toast } from "react-toastify";
import { validateDate, validateAge } from "../validarDataNascimento";

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("Validar data de nascimento", () => {
  it("data válida", () => {
    const date = "12/05/1990";
    const result = validateDate(date);
    expect(result).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("formato inválido", () => {
    const date = "12-05-1990";
    const result = validateDate(date);
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      "Formato de data inválido. Use o formato dd/mm/aaaa."
    );
  });

  it("data inexistente", () => {
    const date = "30/02/1990";
    const result = validateDate(date);
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Data de nascimento inválida.");
  });
});

describe("validateAge", () => {
  it("idade inválida", () => {
    const today = new Date();
    const seventeenYearsAgo = new Date(
      today.getFullYear() - 17,
      today.getMonth(),
      today.getDate()
    );
    const result = validateAge(seventeenYearsAgo);
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      "É necessário ter mais de 18 anos para este cadastro."
    );
  });
});
