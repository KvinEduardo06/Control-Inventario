import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/private/Dashboard/Dashboard';


export default function PrivateRoutes() {
  return (
    <Routes>
      <Route path="/ComoInventario" element={<Dashboard />} />
      {/* <Route path="Inicio" element={<ChangePassword/>}/> */}
    </Routes>
  );
}
