import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalStyle from "./styles/globalStyle";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./services/queryClient";
import { AuthProvider } from "./context/AuthProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <GlobalStyle />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
