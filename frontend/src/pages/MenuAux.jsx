import Button from "../components/Button";

export default function MenuAux() {
  return (
    <div className="flex flex-col text-white">
      <header className="w-full size-28 flex items-center justify-center mt-10" style={{ backgroundColor: "var(--color-primary)" }}>
        <h1 className="text-4xl font-bold text-center">MENU PARA AUXILIARES</h1>
      </header>
      <main className="flex flex-1 items-center justify-center">
        <div className="grid grid-cols-3 grid-rows-3 gap-14 p-10">
          <Button>Registrar Prestamo</Button>
          <Button>Registrar Devolucion</Button>
          <Button>Ver Stock Materiales</Button>
          <Button>Registrar Estudiante</Button>
          <div />
        </div>
      </main>
    </div>
  );
}
