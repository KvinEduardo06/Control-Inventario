import { Routes, Route } from 'react-router-dom';
import Login from './pages/public/Login/Login';
import PublicRoutes from './routes/PublicRoutes';
import PrivateRoutes from './routes/PrivateRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './pages/private/context/AuthContext'; // <-- importar el provider

function App() {
  return (
    <AuthProvider> {/* Proveer el contexto a toda la app */}
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />

        {/* Rutas privadas */}
        <Route path="/*" element={<PrivateRoutes />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
