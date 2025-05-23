import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RegistroPrestamo from "./pages/RegistroPrestamo"
import Menu from "./pages/Menu"; 
import React from "react";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registrar-prestamo" element={<RegistroPrestamo />} />
        <Route path="/menu" element={<Menu />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
