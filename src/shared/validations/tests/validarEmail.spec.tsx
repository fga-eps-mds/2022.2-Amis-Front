import { toast } from "react-toastify";
import { validateEmail } from "../validarEmail";

describe("validateEmail", () => {
  it("email valido", () => {
    const validEmail = "test@example.com";
    const isValid = validateEmail(validEmail);
    expect(isValid).toBe(true);
  });

  it("email invalido", () => {
    const invalidEmail = "invalid-email";
    const isValid = validateEmail(invalidEmail);
    expect(isValid).toBe(false);
  });

  it("erro", () => {
    const invalidEmail = "invalid-email";
    const toastErrorMock = jest.spyOn(toast, "error");
    validateEmail(invalidEmail);
    expect(toastErrorMock).toHaveBeenCalledTimes(1);
    expect(toastErrorMock).toHaveBeenCalledWith("O e-mail informado é inválido.");
    toastErrorMock.mockRestore();
  });
});
