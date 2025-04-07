import { Routes, Route } from 'react-router-dom';
import Login from '../pages/public/Login/Login';
import SignUp from '../pages/public/SignUp/SignUp';
import ChangePassword from '../pages/public/ChangePassword/ChangePassword';

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/registro" element={<SignUp />} />
      <Route path="CambioContraseña" element={<ChangePassword/>}/>
    </Routes>
  );
}
