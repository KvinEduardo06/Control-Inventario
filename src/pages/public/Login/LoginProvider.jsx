import { createContext, useState, useContext, useEffect } from 'react';
import { auth, googleProvider } from '../../../FireBase/firebase';
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Crear el contexto
const LoginContext = createContext();

// Hook para usar el contexto
export const useLogin = () => {
  return useContext(LoginContext);
};

// Proveedor de autenticación
export const LoginProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar si el usuario ya está logueado al cargar
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    const token = localStorage.getItem('token');
    
    if (userInfo && token) {
      setCurrentUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  // Login manual con email/password
  const login = (email, password) => {
    const token = btoa(JSON.stringify({
      usuario: email.split('@')[0],
      email: email
    }));
    
    const userInfo = {
      displayName: email.split('@')[0],
      email: email
    };
    
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setCurrentUser(userInfo);
    
    return true;
  };

  // Login con Google
  const loginWithGoogle = async () => {
    setLoading(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const token = btoa(JSON.stringify({
        usuario: user.displayName,
        email: user.email,
        uid: user.uid
      }));

      const userInfo = {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL
      };

      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setCurrentUser(userInfo);
      
      Swal.fire({
        title: `¡Bienvenido, ${user.displayName || "usuario"}!`,
        text: 'Has iniciado sesión con Google correctamente.',
        icon: 'success',
        confirmButtonText: 'Continuar'
      });
      
      return true;
    } catch (error) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        console.warn('El usuario canceló el inicio de sesión con Google.');
      } else {
        console.error("Error al iniciar sesión con Google:", error);
        Swal.fire('Oops...', 'Hubo un error al iniciar sesión con Google.', 'error');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      setCurrentUser(null);
      navigate('/');
      return true;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      return false;
    }
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Valor del contexto
  const value = {
    currentUser,
    loading,
    login,
    loginWithGoogle,
    logout,
    isAuthenticated
  };

  return (
    <LoginContext.Provider value={value}>
      {!loading && children}
    </LoginContext.Provider>
  );
};