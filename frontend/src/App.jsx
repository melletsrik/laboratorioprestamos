import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegistroPrestamo from "./pages/RegistroPrestamo"
import MenuAdmin from "./pages/MenuAdmin"
import MenuAux from "./pages/MenuAux "
import React from "react";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registrar-prestamo" element={<RegistroPrestamo />} />
        <Route path="/menu-admin" element={<MenuAdmin />} />
        <Route path="/menu-aux" element={<MenuAux />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
