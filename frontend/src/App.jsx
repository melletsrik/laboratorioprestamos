import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrarPrestamo from "./pages/RegistrarPrestamo"
import ListadoPrestamos from "./pages/ListadoPrestamos";
import Login from "./pages/Login";
import MenuAdmin from "./pages/MenuAdmin"
import MenuAux from "./pages/MenuAux";
import RegistrarEstudiante from "./pages/RegistrarEstudiante";
import GestionarMaterial from "./pages/GestionarMaterial";
import Docente from "./pages/Docentes";
import VentanaUsuario from "./pages/VentanaUsuario";
import VentanaMateria from "./pages/VentanaMateria";
import ReportePrestamo from "./pages/ReportePrestamo";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registrar-prestamo" element={<RegistrarPrestamo />} />
        <Route path="/listado-prestamos" element={<ListadoPrestamos />} />
        <Route path="/menu-admin" element={<MenuAdmin />} />
        <Route path="/menu-aux" element={<MenuAux />} />
        <Route path="/registrar-estudiante" element={<RegistrarEstudiante />} />
        <Route path="/material" element={<GestionarMaterial />} />
        <Route path="/docentes" element={<Docente />} />
        <Route path= "/VentanaUsuario" element={<VentanaUsuario />} />
        <Route path="/VentanaMateria" element={<VentanaMateria/>} />
         <Route path="/ReportePrestamo" element={<ReportePrestamo/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
