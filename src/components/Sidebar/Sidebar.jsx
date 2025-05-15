import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Package,
  Clipboard,
  RefreshCw,
  FileText,
  Settings,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  ChevronRight,
  Shield,
  Hash,
  ChevronDown
} from "lucide-react";
import "./Sidebar.css";
import axios from 'axios';

export default function Sidebar({
  collapsed,
  setCollapsed
}) {
  // Estado para el modo oscuro
  const [darkMode, setDarkMode] = useState(false);
  // Estado para confirmación de cierre de sesión
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // Estado para el ítem sobre el que está el hover
  const [hoveredItem, setHoveredItem] = useState(null);
  // Estado para los módulos del menú
  const [menuModules, setMenuModules] = useState([]);
  // Estado para control de carga
  const [loading, setLoading] = useState(true);
  // Estado para errores
  const [error, setError] = useState(null);
  // Estado para controlar qué módulos están expandidos
  const [expandedModules, setExpandedModules] = useState({});

  // Agregar el hook useNavigate para la redirección después del logout
  const navigate = useNavigate();

  // Obtener la ruta actual usando useLocation de react-router-dom
  const location = useLocation();
  const currentPath = location.pathname;

  // Función para obtener el ícono según el nombre del módulo o submódulo
  const getIconForModule = (name) => {
    // Map de nombres de módulos a íconos
    const iconMap = {
      "Seguridad": <Shield size={20} />,
      "usuario": <User size={20} />,
      "rol": <Shield size={20} />,
      "Dashboard": <Package size={20} />,
      "Inventario": <Clipboard size={20} />,
      "Movimientos": <RefreshCw size={20} />,
      "Reportes": <FileText size={20} />,
      "Configuración": <Settings size={20} />,
      "Empleados": <User size={20} />
    };

    // Retorna el ícono correspondiente o un ícono por defecto
    return iconMap[name] || <Hash size={20} />;
  };

  // Función para cargar las opciones del menú desde el backend
  useEffect(() => {
    const fetchMenuOptions = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('apiToken');

        if (!token) {
          throw new Error('No se encontró token de autenticación');
        }

        // console.log("TOKEN ENVIADO:", token);

        const response = await axios.get('http://172.16.20.149:4000/api/private/rol/verMenu', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.data;
        // console.log("Datos recibidos del API:", data);
        
        // Mantener la estructura jerárquica
        const transformedMenuModules = data.map(module => ({
          name: module.nombre,
          icon: getIconForModule(module.nombre),
          submodules: module.submodulos?.map(submodule => ({
            name: submodule.nombre,
            path: `/ComoInventario/${submodule.nombre.toLowerCase()}`,
            icon: getIconForModule(submodule.nombre)
          })) || []
        }));

        setMenuModules(transformedMenuModules);
        
        // Inicializar el estado de expandido basado en la ruta actual
        const initialExpandedState = {};
        transformedMenuModules.forEach(module => {
          const hasActiveSubmodule = module.submodules.some(
            submodule => currentPath === submodule.path
          );
          initialExpandedState[module.name] = hasActiveSubmodule;
        });
        setExpandedModules(initialExpandedState);
        
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar el menú:", err);
        setError(err.response?.data?.message || err.message);
        setLoading(false);

        // Cargar menú por defecto en caso de error
        setMenuModules([
          { 
            name: 'Dashboard', 
            icon: <Package size={20} />,
            submodules: [] 
          },
          { 
            name: 'Inventario', 
            icon: <Clipboard size={20} />,
            submodules: [] 
          }
        ]);
      }
    };

    fetchMenuOptions();
  }, [currentPath]);

  // Efecto para cargar la preferencia guardada del usuario
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  // Función para alternar el modo oscuro
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    // Guardar preferencia en localStorage
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");

    // Aplicar/quitar clase al body para efectos globales
    if (newDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  // Función para mostrar el modal de confirmación
  const promptLogout = () => {
    setShowLogoutConfirm(true);
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Borrar el token y todos los datos de localStorage
    localStorage.clear();

    // Cerrar el modal de confirmación
    setShowLogoutConfirm(false);

    // Redireccionar al usuario a la página de login
    navigate('/login');
  };

  // Función para expandir/colapsar un módulo
  const toggleModule = (moduleName) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleName]: !prev[moduleName]
    }));
  };

  // Verificar si un submódulo está activo
  const isSubmoduleActive = (path) => {
    return currentPath === path;
  };

  return (
    <div
      className={`${collapsed ? "sidebar-collapsed" : "sidebar-expanded"} 
        d-flex flex-column ${darkMode ? "bg-dark text-light" : "bg-light text-dark"}`}
    >
      <div
        className={`p-3 d-flex align-items-center justify-content-between border-bottom 
          ${darkMode ? "border-secondary" : "border-secondary"}`}
      >
        {!collapsed && <h2 className="fs-4 fw-bold mb-0">COMO-INV</h2>}
        <div className="d-flex">
          {/* Botón de modo oscuro */}
          <button
            onClick={toggleDarkMode}
            className={`btn ${darkMode ? "btn-outline-light" : "btn-outline-dark"} p-1 me-2`}
            title={darkMode ? "Modo claro" : "Modo oscuro"}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Botón de colapsar */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`btn ${darkMode ? "btn-outline-light" : "btn-outline-dark"} p-1`}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      <div className="d-flex flex-column flex-grow-1 overflow-auto">
        <nav className="mt-3 flex-grow-1">
          {loading ? (
            <div className="text-center p-3">Cargando menú...</div>
          ) : error ? (
            <div className="text-center text-danger p-3">Error: {error}</div>
          ) : (
            menuModules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="module-container">
                {/* Módulo principal */}
                <div 
                  onClick={() => toggleModule(module.name)}
                  className={`nav-item module-header d-flex align-items-center px-3 py-2 w-100 text-decoration-none
                    ${darkMode ? 'nav-item-dark' : 'nav-item'}`}
                >
                  <div className="nav-icon">{module.icon}</div>
                  {!collapsed && (
                    <>
                      <span className="nav-label ms-3">{module.name}</span>
                      {module.submodules.length > 0 && (
                        <div className="ms-auto">
                          {expandedModules[module.name] ? 
                            <ChevronDown size={16} /> : 
                            <ChevronRight size={16} />
                          }
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {/* Submódulos */}
                {!collapsed && expandedModules[module.name] && module.submodules.length > 0 && (
                  <div className="submodule-container ps-4">
                    {module.submodules.map((submodule, subIndex) => (
                      <Link
                        key={subIndex}
                        to={submodule.path}
                        className={`nav-item d-flex align-items-center px-3 py-2 w-100 text-decoration-none 
                          ${isSubmoduleActive(submodule.path) 
                            ? 'active-nav-item' 
                            : darkMode ? 'nav-item-dark' : 'nav-item'}`}
                      >
                        <div className="nav-icon">{submodule.icon}</div>
                        <span className="nav-label ms-3">
                          {submodule.name.charAt(0).toUpperCase() + submodule.name.slice(1)}
                        </span>
                        {isSubmoduleActive(submodule.path) && (
                          <div className="active-indicator"></div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </nav>
        <div
          className={`mt-auto p-3 border-top ${darkMode ? "border-secondary" : "border-secondary"}`}
        >
          <button
            onClick={promptLogout}
            className={`d-flex align-items-center w-100 px-3 py-2 btn ${darkMode ? "btn-danger" : "btn-dark"}`}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ms-3">Cerrar sesión</span>}
          </button>
        </div>
      </div>

      {/* Modal de confirmación de cierre de sesión */}
      {showLogoutConfirm && (
        <div className="logout-confirm-modal">
          <div className="modal-content">
            <h3>¿Está seguro que desea cerrar sesión?</h3>
            <div className="modal-buttons">
              <button onClick={() => setShowLogoutConfirm(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button onClick={handleLogout} className="btn btn-danger">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}