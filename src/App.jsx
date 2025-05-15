import { Routes, Route } from 'react-router-dom';
import Login from './pages/public/Login/Login';
import PublicRoutes from './routes/PublicRoutes';
import PrivateRoutes from './routes/PrivateRoutes';
import { toast } from 'react-toastify';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <><Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Login />} />

      {/* Rutas privadas */}
      <Route path="/*" element={<PrivateRoutes />} />

    </Routes><ToastContainer position="top-right" autoClose={3000} /></>

  );
}

export default App;
