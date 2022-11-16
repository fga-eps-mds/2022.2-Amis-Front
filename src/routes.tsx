import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { Receitas } from "./pages/receitas/receitas"

export default function AppRoutes() {
  return (
    <Router>
        <Routes>
          <Route path="/receitas" element={<Receitas />} />
        </Routes>
    </Router>
  );
}
