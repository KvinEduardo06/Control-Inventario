// PublicRoutes.js
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/public/Login/Login';

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  );
}