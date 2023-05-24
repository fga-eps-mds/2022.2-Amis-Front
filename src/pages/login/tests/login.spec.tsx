function soma(a: number, b: number) {
    return a + b;
  }
  
  test('Teste de soma', () => {
    const resultado = soma(2, 3);
    expect(resultado).toBe(5);
  });

// import { BrowserRouter } from "react-router-dom";
// import renderer from "react-test-renderer";
// import { ThemeProvider } from "styled-components";
// import { Login } from "../login";
// import theme from "../../../styles/theme";

// describe("Snapshot", () => {
//   it("Deve corresponder ao Snapshot", () => {
//     const tree = renderer
//       .create(
//         <BrowserRouter>
//           <ThemeProvider theme={theme}>
//             <Login />
//           </ThemeProvider>
//         </BrowserRouter>
//       )
//       .toJSON();
//     expect(tree).toMatchSnapshot();
//   });
// });
