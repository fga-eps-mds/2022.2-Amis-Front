import React from "react";
import { ThemeProvider } from "styled-components";
import Theme from "./styles/theme";
import AppRoutes from "./routes";

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
