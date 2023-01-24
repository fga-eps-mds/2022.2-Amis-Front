import React from "react";
import { ThemeProvider } from "styled-components";
import Theme from "./styles/theme";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;
