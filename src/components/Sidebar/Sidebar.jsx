import { useState, useEffect } from 'react';
import { Package, Clipboard, RefreshCw, FileText, Settings, LogOut, Menu, Moon, Sun } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ collapsed, setCollapsed, activeTab, setActiveTab }) {
    // Estado para el modo oscuro
    const [darkMode, setDarkMode] = useState(false);
    
    // Efecto para cargar la preferencia guardada del usuario
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setDarkMode(true);
            document.body.classList.add('dark-mode');
        }
    }, []);
    
    // Función para alternar el modo oscuro
    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        
        // Guardar preferencia en localStorage
        localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
        
        // Aplicar/quitar clase al body para efectos globales
        if (newDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    return (
        <div className={`${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} d-flex flex-column ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
            <div className={`p-3 d-flex align-items-center justify-content-between border-bottom ${darkMode ? 'border-secondary' : 'border-secondary'}`}>
                {!collapsed && <h2 className="fs-4 fw-bold mb-0">COMO-INV</h2>}
                <div className="d-flex">
                    {/* Botón de modo oscuro */}
                    <button
                        onClick={toggleDarkMode}
                        className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'} p-1 me-2`}
                        title={darkMode ? "Modo claro" : "Modo oscuro"}
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    
                    {/* Botón de colapsar */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`btn ${darkMode ? 'btn-outline-light' : 'btn-outline-dark'} p-1`}
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </div>
            <div className="d-flex flex-column flex-grow-1 overflow-auto">
                <nav className="mt-3 flex-grow-1">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`d-flex align-items-center px-3 py-2 w-100 border-0 text-start ${activeTab === 'dashboard' ? 'active-nav-item' : darkMode ? 'nav-item-dark' : 'nav-item'}`}
                    >
                        <Package size={20} />
                        {!collapsed && <span className="ms-3">Dashboard</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`d-flex align-items-center px-3 py-2 w-100 border-0 text-start ${activeTab === 'inventory' ? 'active-nav-item' : darkMode ? 'nav-item-dark' : 'nav-item'}`}
                    >
                        <Clipboard size={20} />
                        {!collapsed && <span className="ms-3">Inventario</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('movements')}
                        className={`d-flex align-items-center px-3 py-2 w-100 border-0 text-start ${activeTab === 'movements' ? 'active-nav-item' : darkMode ? 'nav-item-dark' : 'nav-item'}`}
                    >
                        <RefreshCw size={20} />
                        {!collapsed && <span className="ms-3">Movimientos</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`d-flex align-items-center px-3 py-2 w-100 border-0 text-start ${activeTab === 'reports' ? 'active-nav-item' : darkMode ? 'nav-item-dark' : 'nav-item'}`}
                    >
                        <FileText size={20} />
                        {!collapsed && <span className="ms-3">Reportes</span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`d-flex align-items-center px-3 py-2 w-100 border-0 text-start ${activeTab === 'settings' ? 'active-nav-item' : darkMode ? 'nav-item-dark' : 'nav-item'}`}
                    >
                        <Settings size={20} />
                        {!collapsed && <span className="ms-3">Configuración</span>}
                    </button>
                </nav>
                <div className={`mt-auto p-3 border-top ${darkMode ? 'border-secondary' : 'border-secondary'}`}>
                    <button className={`d-flex align-items-center w-100 px-3 py-2 btn ${darkMode ? 'btn-danger' : 'btn-dark'}`}>
                        <LogOut size={20} />
                        {!collapsed && <span className="ms-3">Cerrar sesión</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}