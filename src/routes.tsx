import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Alunas } from "./pages/alunas/alunas";
import { Home } from "./pages/home/home";
import { Login } from "./pages/login/login";
import { Receitas } from "./pages/receitas/receitas";
import { Assistentes } from "./pages/assistentes/assistentes";
import { Turmas } from "./pages/turmas/turmas";
import { Professores } from "./pages/professores/professores";
import { AuthContext } from "./context/AuthProvider";
import { Backdrop, CircularProgress } from "@mui/material";
import { ReceitasInstrucao } from "./pages/receitas/receitasInstrucao";
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

  return auth.isAuthenticated ? <RouteComponent /> : <Navigate to="/" />;
};

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/receitas" element={<Receitas />} />
        {/* <Route path="/alunas" element={<PrivateRoute component={Alunas} />} /> */}

        <Route path="/alunas" element={<Alunas />} />
        <Route path="/assistentes"element={<Assistentes />}
        />
        <Route path="/professores" element={<Professores />} />
        <Route path="/turmas" element={<Turmas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/receita/:index" element={<ReceitasInstrucao />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
