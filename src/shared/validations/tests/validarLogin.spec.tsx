import { toast } from "react-toastify";
import { validateLogin } from "../validarLogin";

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("Validar login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("login válido", () => {
    const login = "validlogin";
    const result = validateLogin(login);
    expect(result).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("login pequeno", () => {
    const login = "short";
    const result = validateLogin(login);
    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith("Login muito pequeno.");
  });
});
