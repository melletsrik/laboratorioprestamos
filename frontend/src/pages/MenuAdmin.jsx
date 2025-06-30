import Button from "../components/Button";
import { Route, useNavigate } from "react-router-dom";
import { LuClipboardList } from "react-icons/lu";
import { LuBookOpen } from "react-icons/lu";
import { FiPackage } from "react-icons/fi";
import { LuGraduationCap } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { LuBookMarked } from "react-icons/lu";
import { LuUserCheck } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";
import { RiFileExcel2Line } from "react-icons/ri";
export default function MenuAdmin() {
  const navegar=useNavigate(); //navega a otra ventana al hacer click al boton
  const menuItems=[ 
    {icon: LuClipboardList, title: "Registrar Prestamo", description: "Crear nuevo prestamo de material",  route:"/registrar-prestamo"},
    {icon: LuBookOpen, title: "Prestamos activos", description:"Ver materiales no devueltos", route:"/prestamo-activos"},
    {icon: FiPackage, title: "Stock Materiales", description:"Inventario y disponibilidad", route:"/material"},
    {icon: LuGraduationCap, title: " Estudiantes", description:"Registrar estudiantes", route:"/registrar-estudiante"},
    {icon: LuUsers, title: "Docentes", description:"Registrar docentes", route:"/docentes"},
    {icon: LuBookMarked, title: "Materias", description:"Registrar materias", route:"/VentanaMateria"},
    {icon: LuUserCheck, title: "Auxiliar", description:"Registrar auxiliares", route:"/VentanaUsuario"},
     {icon: RiFileExcel2Line, title: "Reporte de Préstamos", description:"Ver reportes de préstamos", route:"/ReportePrestamo"}
  ];

  return (
    <div className=" bg-gray-50 min-h-screen  px-7 py-6">
      <header className="bg-red-600 shadow-md rounded-xl px-7 py-6 max-w-7xl mx-auto mb-4 text-center border border-gray-400 ">
        <h1 className="text-4xl font-bold text-white tracking-wide ">MENU PRINCIPAL</h1>
      </header>
      <main className="max-w-7xl mx-auto py-5 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-y-9 gap-x-20">

          {menuItems.map((item, index) =>(
            <button key={index} onClick={()=>navegar(item.route)}
            /*Funciona para cada boton */
              className="flex flex-col items-center text-center p-6 rounded-xl bg-white hover-bg-gray-50 text-gray-700 shadow-md border border-gray-300 transition hover:scale-105">
                
                <div className="bg-red-100 p-3 rounded-full mb-4 ">
                    <item.icon size={36} className="text-red-600"></item.icon>
                </div>
                
                <span className="font-bold text-lg">{item.title}</span>
               <p className="text-sm opacity-80">{item.description}</p> 
            </button>
          ))}
        </div>
        <div className="flex justify-end mt-10 ">
          <button onClick={()=> {  localStorage.clear(); navegar("/"); }}
          className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"> <LuLogOut className="w-5 h-5"></LuLogOut> Cerrar Sesion</button>
        </div>
      </main>
      
    </div>
  );
}
