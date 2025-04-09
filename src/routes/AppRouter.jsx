import { BrowserRouter } from 'react-router-dom';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';
// import PrivateRoutes from './PrivateRoutes'; // si ya lo tenés

export default function AppRouter() {
  return (
    <BrowserRouter>
      {/* Acá podés manejar con lógica si mostrar públicas o privadas */}
      <PublicRoutes />
      <PrivateRoutes/>
    </BrowserRouter>
  );
}
