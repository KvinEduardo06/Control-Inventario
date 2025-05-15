import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/private/Dashboard/Dashboard';
import SignUp from '../pages/private/SignUp/SignUp';
import ChangePassword from '../pages/public/ChangePassword/ChangePassword';
import ProtectedRoute from './../components/Protected/ProtectedRoute';
import InventoryOverview from '../pages/private/InventoryOverview/InventoryOverview';
import Roles from '../pages/private/Roles/Roles';

export default function PrivateRoutes() {
  return (
    <Routes>
      <Route
        path="/ComoInventario"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {/* Rutas anidadas dentro del Dashboard */}
        <Route path="dashboard" element={<InventoryOverview />} />

        <Route path="empleado" element={<SignUp />} />
                <Route path="rol" element={<Roles />} />

      </Route>

      <Route
        path="/change-password/:token"
        element={
          <ChangePassword />
        }
      />
    </Routes>
  );
}