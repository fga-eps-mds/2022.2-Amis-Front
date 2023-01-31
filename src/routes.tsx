import React from "react";
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

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/receitas" element={<Receitas />} />
        <Route path="/alunas" element={<Alunas />} />
        <Route path="/assistentes" element={<Assistentes />} />
        <Route path="/turmas" element={<Turmas />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
