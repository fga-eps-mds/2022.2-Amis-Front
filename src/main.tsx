import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import GlobalStyle from "./styles/globalStyle";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./services/queryClient";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <GlobalStyle />
    </QueryClientProvider>
  </React.StrictMode>
);
