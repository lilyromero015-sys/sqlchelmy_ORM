
import { Link, Routes, Route, Navigate } from "react-router-dom";

import Productos from "./pages/productos";
import Categorias from "./pages/categorias";
import Entradas from "./pages/entradas";

function App() {
  return (
    <div>
      <nav className="flex flex-wrap gap-4 bg-indigo-700 p-4">
        <Link
          to="/productos"
          className="font-semibold text-white hover:text-indigo-200"
        >
          Productos
        </Link>

        <Link
          to="/categorias"
          className="font-semibold text-white hover:text-indigo-200"
        >
          Categorías
        </Link>

        <Link
          to="/entradas"
          className="font-semibold text-white hover:text-indigo-200"
        >
          Entradas
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/productos" replace />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/entradas" element={<Entradas />} />
      </Routes>
    </div>
  );
}

export default App;
