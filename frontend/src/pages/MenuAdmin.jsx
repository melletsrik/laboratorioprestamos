import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
export default function MenuAdmin() {

  const navegar=useNavigate();

  const handleVerStock = () => {
    navegar("/material");
  };
  const handleRegistrarUsuario = () => {
    navegar("/registrar-usuario");
  };
  const handleVentanaDocente = () => {
    navegar("/docentes");
  };

  return (
    <div className="flex flex-col text-white">
      <header
        className="w-full size-28 flex items-center justify-center mt-10"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <h1 className="text-4xl font-bold text-center">MENU PRINCIPAL</h1>
      </header>

      <main className="flex flex-1 items-center justify-center text-white">
        <div className="grid grid-cols-3 grid-rows-3 gap-14 p-10 ">
          <Button>Registrar Prestamo</Button>
          <Button>Registrar Devolucion</Button>
          <Button onClick={handleVerStock}> Stock Materiales</Button>
          <Button>Registrar Estudiante</Button>
          <Button onClick={handleVentanaDocente}>Ventana Docente</Button>
          <Button>Agregar Materia</Button>
          <Button onClick={handleRegistrarUsuario}>Ventana Auxiliar</Button>
          <Button>Agregar Material</Button>
          <div />
        </div>
      </main>
    </div>
  );
}
