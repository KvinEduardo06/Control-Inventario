import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// URL base para las peticiones API
const BASE_URL = import.meta.env.VITE_API_URL;

// Crear el contexto de autenticación
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Estado para almacenar los permisos/menu del usuario
  const [userMenu, setUserMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar los permisos al montar el componente
  useEffect(() => {
    fetchUserMenu();
  }, []);

  // Función para obtener el menú/permisos del usuario
  const fetchUserMenu = async () => {
    try {
      setLoading(true);
      
      // Obtener el token de autenticación
      const token = localStorage.getItem('apiToken');
      
      if (!token) {
        throw new Error("No se encontró el token de autenticación");
      }
      
      // Configurar los headers con el token Bearer
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Realizar la petición para obtener el menú/permisos
      const response = await axios.get(`${BASE_URL}rol/verMenu`, config);
      
      // Guardar el menú/permisos en el estado
      setUserMenu(response.data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar el menú del usuario:", err);
      setError("Error al cargar permisos del usuario");
    } finally {
      setLoading(false);
    }
  };

  // Función para verificar si el usuario tiene permiso para una acción específica
  const hasPermission = (moduleName, actionName, method = null, path = null) => {
    if (!userMenu) return false;
    
    // Buscar el módulo
    const module = userMenu.find(item => item.nombre === moduleName);
    if (!module) return false;
    
    // Buscar el submódulo si existe
    const submodules = module.submodulos || [];
    
    // Buscar la acción en cada submódulo
    for (const submodule of submodules) {
      const actions = submodule.acciones || [];
      
      // Buscar la acción que coincida con los criterios
      const hasAction = actions.some(action => {
        // Si se especificó un nombre de acción, verificarlo
        if (actionName && action.nombre !== actionName) return false;
        
        // Si se especificó un método, verificarlo
        if (method && action.metodo !== method.toUpperCase()) return false;
        
        // Si se especificó una ruta, verificarla
        if (path && action.ruta !== path) return false;
        
        // Si todas las condiciones coinciden, el usuario tiene permiso
        return true;
      });
      
      if (hasAction) return true;
    }
    
    return false;
  };

  // Función para verificar si el usuario tiene acceso a una ruta específica
  const hasRouteAccess = (routePath) => {
    if (!userMenu) return false;
    
    // Verificar en todos los módulos y submódulos
    for (const module of userMenu) {
      const submodules = module.submodulos || [];
      
      for (const submodule of submodules) {
        const actions = submodule.acciones || [];
        
        // Si alguna acción coincide con la ruta, el usuario tiene acceso
        if (actions.some(action => action.ruta === routePath)) {
          return true;
        }
      }
    }
    
    return false;
  };

  // Función para verificar si el usuario puede ver el Rol (específicamente)
  const canManageRoles = () => {
    return hasPermission("Seguridad", null, null, "rol/");
  };

  return (
    <AuthContext.Provider value={{ 
      userMenu, 
      loading, 
      error, 
      hasPermission, 
      hasRouteAccess,
      canManageRoles,
      refreshPermissions: fetchUserMenu 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export default AuthContext;