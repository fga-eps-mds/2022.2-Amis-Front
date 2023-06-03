import removeSpecialCharacters from "../removeSpecialCharacters";

describe("Removendo caracteres especiais", () => {
  it("removendo caracteres", () => {
    const input = "abc./-() 123";
    const expectedResult = "abc123";
    const result = removeSpecialCharacters(input);
    expect(result).toBe(expectedResult);
  });

  it("retorna vazio", () => {
    const input = 123;
    const expectedResult = "";
    const result = removeSpecialCharacters(input);
    expect(result).toBe(expectedResult);
  });
});
