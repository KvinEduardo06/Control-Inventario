import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crear el contexto
export const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [permisosMap, setPermisosMap] = useState({});
  const [permisosCompletos, setPermisosCompletos] = useState([]); // Nueva estructura completa
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener la URL base desde variables de entorno
  const BASE_URL = import.meta.env.VITE_API_URL_PUBLIC || 'http://172.16.20.149:4000/api';

  useEffect(() => {
    cargarPermisos();
  }, []);

  const cargarPermisos = async () => {
    const token = localStorage.getItem('apiToken');
    
    if (!token) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Configurar los headers con el token Bearer
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      // Realizar la petición para obtener los permisos del usuario
      const response = await axios.get(`${BASE_URL}/usuario/verMenu/`, config);
      
      // Procesar los permisos
      const menu = response.data;
      const permisosExtraidos = extraerPermisos(menu);
      const permisosCompletosExtraidos = extraerPermisosCompletos(menu);
      
      setPermisos(permisosExtraidos);
      setPermisosCompletos(permisosCompletosExtraidos);
      
      // Crear un mapa para búsqueda rápida de permisos
      const mapaPermisos = crearMapaPermisos(permisosExtraidos);
      setPermisosMap(mapaPermisos);
      
      // console.log('Permisos cargados:', permisosExtraidos);
      // console.log('Permisos completos:', permisosCompletosExtraidos);
      
      setError(null);
    } catch (err) {
      console.error('Error al cargar permisos:', err);
      setError('No se pudieron cargar los permisos. Por favor, inicia sesión nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Convierte la estructura compleja en arrays para fácil acceso (versión simple)
  const extraerPermisos = (menu) => {
    const permisos = [];

    menu.forEach(modulo => {
      modulo.submodulos.forEach(sub => {
        sub.acciones.forEach(accion => {
          permisos.push({
            modulo: modulo.nombre,
            submodulo: sub.nombre,
            accion: accion.nombre.toLowerCase(),
            metodo: accion.metodo.toUpperCase(),
            ruta: accion.ruta
          });
        });
      });
    });

    return permisos;
  };

  // Nueva función que preserva toda la información del backend
  const extraerPermisosCompletos = (menu) => {
    const permisos = [];

    menu.forEach(modulo => {
      modulo.submodulos.forEach(sub => {
        sub.acciones.forEach(accion => {
          permisos.push({
            modulo: modulo.nombre,
            submodulo: sub.nombre,
            accion: accion.nombre.toLowerCase(),
            accionOriginal: accion.nombre, // Preservar el nombre original del backend
            metodo: accion.metodo.toUpperCase(),
            ruta: accion.ruta,
            // Preservar cualquier otra información del backend
            ...accion
          });
        });
      });
    });

    return permisos;
  };

  // Crea un objeto mapa para búsqueda rápida de permisos
  const crearMapaPermisos = (permisos) => {
    const mapa = {};
    
    permisos.forEach(p => {
      // Normalizar todo a minúsculas para hacer comparaciones case-insensitive
      const key = `${p.modulo.toLowerCase()}|${p.submodulo.toLowerCase()}|${p.accion.toLowerCase()}`;
      mapa[key] = true;
    });
    
    return mapa;
  };

  // Nueva función para obtener información completa de una acción
  const obtenerInfoAccion = (modulo, submodulo, accion) => {
    return permisosCompletos.find(p => 
      p.modulo.toLowerCase() === modulo.toLowerCase() && 
      p.submodulo.toLowerCase() === submodulo.toLowerCase() && 
      p.accion.toLowerCase() === accion.toLowerCase()
    );
  };

  // Verifica si el usuario tiene un permiso específico
  const tienePermiso = (modulo, submodulo, accion) => {
    if (!modulo || !submodulo || !accion) return false;
    
    // Buscar en el mapa de permisos (más eficiente) - normalizar a minúsculas
    const key = `${modulo.toLowerCase()}|${submodulo.toLowerCase()}|${accion.toLowerCase()}`;
    return !!permisosMap[key];
  };

  // Verifica si el usuario tiene permiso para una acción específica por método HTTP
  const tienePermisoMetodo = (modulo, submodulo, metodo) => {
    if (!modulo || !submodulo || !metodo) return false;
    
    return permisos.some(p => 
      p.modulo.toLowerCase() === modulo.toLowerCase() && 
      p.submodulo.toLowerCase() === submodulo.toLowerCase() && 
      p.metodo === metodo.toUpperCase()
    );
  };

  // Verifica si el usuario tiene permiso para crear
  const puedeCrear = (modulo, submodulo) => {
    return tienePermiso(modulo, submodulo, 'crear') || 
           tienePermisoMetodo(modulo, submodulo, 'POST');
  };

  // Verifica si el usuario tiene permiso para ver
  const puedeVer = (modulo, submodulo) => {
    return tienePermiso(modulo, submodulo, 'ver') || 
           tienePermisoMetodo(modulo, submodulo, 'GET');
  };

  // Verifica si el usuario tiene permiso para editar
  const puedeEditar = (modulo, submodulo) => {
    return tienePermiso(modulo, submodulo, 'editar') || 
           tienePermisoMetodo(modulo, submodulo, 'PUT');
  };

  // Verifica si el usuario tiene permiso para eliminar
  const puedeEliminar = (modulo, submodulo) => {
    return tienePermiso(modulo, submodulo, 'eliminar') || 
           tienePermisoMetodo(modulo, submodulo, 'DELETE');
  };

  // Iniciar sesión
  const login = async (credenciales) => {
    try {
      const response = await axios.post(`${BASE_URL}/public/auth/login`, credenciales);
      const { token, usuario } = response.data;
      
      // Guardar el token en localStorage
      localStorage.setItem('apiToken', token);
      
      // Establecer el usuario
      setUser(usuario);
      
      // Cargar permisos
      await cargarPermisos();
      
      return true;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('apiToken');
    setUser(null);
    setPermisos([]);
    setPermisosCompletos([]);
    setPermisosMap({});
  };

  // Valor del contexto
  const value = {
    user,
    permisos,
    permisosCompletos, // Exportar los permisos completos
    loading,
    error,
    login,
    logout,
    cargarPermisos,
    tienePermiso,
    tienePermisoMetodo,
    obtenerInfoAccion, // Nueva función para obtener info completa
    puedeCrear,
    puedeVer,
    puedeEditar,
    puedeEliminar
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;