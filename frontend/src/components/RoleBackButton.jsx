import { useNavigate } from 'react-router-dom';
import { Auth } from '../utils/auth';
import { IoArrowBackCircleOutline } from "react-icons/io5";

export default function RoleBackButton() {
  const navigate = useNavigate();
  const rol = Auth.getRol();

  const handleBack = () => {
    if (rol === 'admin') {
      navigate('/menu-admin');
    } else if (rol === 'auxiliar') {
      navigate('/menu-aux');
    } else {
      navigate('/login');
    }
  };

  return (
    <button onClick={handleBack} className="text-gray-600 hover:text-gray-800">
      <IoArrowBackCircleOutline className="w-6 h-6" />
    </button>
  );
}
