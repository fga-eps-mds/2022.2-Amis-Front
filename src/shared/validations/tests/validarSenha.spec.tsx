import { toast } from "react-toastify";
import { validateSenha } from "../validarSenha";

describe("Validar Senha", () => {
  it("senha válida", () => {
    const validPassword = "password123";
    const isValid = validateSenha(validPassword);
    expect(isValid).toBe(true);
  });

  it("senha pequena", () => {
    const shortPassword = "pass";
    const toastErrorMock = jest.spyOn(toast, "error");
    validateSenha(shortPassword);
    expect(toastErrorMock).toHaveBeenCalledTimes(1);
    expect(toastErrorMock).toHaveBeenCalledWith("Senha muito pequena.");
    toastErrorMock.mockRestore();
  });
});
