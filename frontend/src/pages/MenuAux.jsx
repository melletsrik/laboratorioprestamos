import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function MenuAux() {

  const navegar=useNavigate();

  const handleVerStock = () => {//handle define q hacer cuando se hace clic -> onClick es el evento que se dispara al hacer clic
    navegar("/material");
  };

  const handleRegistrarPrestamo = () => {
    navegar("/registrar-prestamo");
  };
 
  
  return (
    <div className="flex flex-col text-white">
      <header className="w-full size-28 flex items-center justify-center mt-10" style={{ backgroundColor: "var(--color-primary)" }}>
        <h1 className="text-4xl font-bold text-center">MENU PARA AUXILIARES</h1>
      </header>
      <main className="flex flex-1 items-center justify-center">
        <div className="grid grid-cols-3 grid-rows-3 gap-14 p-10">
          <Button onClick={handleRegistrarPrestamo}> Registrar Prestamo</Button> 

          <Button>Registrar Devolucion</Button>

          <Button onClick={handleVerStock}>Ver Stock Materiales</Button>
          
          <Button>Registrar Estudiante</Button>
          <div />
        </div>
      </main>
    </div>
  );
}
