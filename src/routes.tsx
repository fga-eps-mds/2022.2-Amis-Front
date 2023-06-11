import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Alunas } from "./pages/alunas/alunas";
import { Instrucao } from "./pages/cadastroInstrucao/instrucao";
import { Home } from "./pages/home/home";
import { Login } from "./pages/login/login";
import { Receitas } from "./pages/receitas/receitas";
import { Assistentes } from "./pages/assistentes/assistentes";
import { Turmas } from "./pages/turmas/turmas";
import { AuthContext } from "./context/AuthProvider";
import { Backdrop, CircularProgress } from "@mui/material";
import { ReceitasInstrucao } from "./pages/receitas/receitasInstrucao";
import { Curso } from "./pages/curso/cursos";

interface Props {
  component: React.ComponentType;
  path?: string;
}

export const PrivateRoute: React.FC<Props> = ({
  component: RouteComponent,
}) => {
  const auth = useContext(AuthContext);

  if (auth.loading) {
    return (
      <Backdrop open={true} sx={{ backgroundColor: "#da4d3d" }}>
        <CircularProgress size={50} sx={{ color: "#fff" }} />
      </Backdrop>
    );
  }
  console.log(auth.user)
  return auth.isAuthenticated ? <RouteComponent /> : <Navigate to="/" />;
};

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/receitas" element={<Receitas />} />
        <Route path="/alunas" element={<PrivateRoute component={Alunas} />} />
        <Route path="/instrucoes" element={<PrivateRoute component={Instrucao}/>} />
        <Route
          path="/assistentes"
          element={<PrivateRoute component={Assistentes}/>}
        />
        <Route path="/turmas" element={<PrivateRoute component={Turmas} />} />
        <Route path="/curso" element={<PrivateRoute component={Curso} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/receita/:index" element={<ReceitasInstrucao />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
