function soma(a: number, b: number) {
    return a + b;
  }
  
  test('Teste de soma', () => {
    const resultado = soma(2, 3);
    expect(resultado).toBe(5);
  });

// import { QueryClientProvider } from "react-query";
// import { BrowserRouter } from "react-router-dom";
// import renderer from "react-test-renderer";
// import { ThemeProvider } from "styled-components";
// import { queryClient } from "../../../services/queryClient";
// import theme from "../../../styles/theme";
// import { Home } from "../home";

// describe("Snapshot", () => {
//   it("Deve corresponder ao Snapshot", () => {
//     const tree = renderer
//       .create(
//         <QueryClientProvider client={queryClient}>
//           <BrowserRouter>
//             <ThemeProvider theme={theme}>
//               <Home />
//             </ThemeProvider>
//           </BrowserRouter>
//         </QueryClientProvider>
//       )
//       .toJSON();
//     expect(tree).toMatchSnapshot();
//   });
// });
