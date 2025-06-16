import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegistrarPrestamo from "./pages/RegistrarPrestamo"
import MenuAdmin from "./pages/MenuAdmin"
import MenuAux from "./pages/MenuAux";
import RegistrarUsuario from "./pages/RegistrarUsuario";
import RegistrarEstudiante from "./pages/RegistrarEstudiante";
import EliminarUsuario from "./pages/EliminarUsuario";
import GestionarMaterial from "./pages/GestionarMaterial";
import ListadoPrestamos from "./pages/ListadoPrestamos";
import Docente from "./pages/Docentes";
import React from "react";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registrar-prestamo" element={<RegistrarPrestamo />} />
        <Route path="/menu-admin" element={<MenuAdmin />} />
        <Route path="/menu-aux" element={<MenuAux />} />
        <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
        <Route path="/registrar-estudiante" element={<RegistrarEstudiante />} />
        <Route path="/eliminar-usuario" element={<EliminarUsuario />} />
        <Route path="/material" element={<GestionarMaterial />} />
        <Route path="/listado-prestamos" element={<ListadoPrestamos />} />
        <Route path="/docentes" element={<Docente />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
