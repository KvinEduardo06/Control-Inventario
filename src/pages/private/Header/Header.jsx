import { useEffect, useState } from "react";
import { ChevronDown, LogOut, AlertTriangle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { GetUser } from '../Header/Services/GetUser'; // Ajusta la ruta si es diferente

export default function Header() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [userName, setUserName] = useState('Usuario');
    const [userRole, setUserRole] = useState('');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [fadeIn, setFadeIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await GetUser();

                // Extraer nombre completo y rol
                const nombre = userData.empleado?.nombre || '';
                const apellido = userData.empleado?.apellido || '';
                const nombreCompleto = `${nombre} ${apellido}`;
                const rol = userData.rol?.nombre || '';

                setUserName(nombreCompleto);
                setUserRole(rol);
            } catch (e) {
                console.error("No se pudo obtener el nombre del usuario:", e);
            }
        };

        fetchUser();
    }, []);



    // Efecto para animar la entrada del modal
    useEffect(() => {
        if (showLogoutConfirm) {
            // Pequeño retraso para permitir que el DOM se actualice antes de añadir la clase fade-in
            setTimeout(() => setFadeIn(true), 50);
        } else {
            setFadeIn(false);
        }
    }, [showLogoutConfirm]);

    // Obtener iniciales de nombre de usuario
    const getInitials = (name) => {
        if (!name) return 'US'; // Valor por defecto
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    // Función que muestra el diálogo de confirmación
    const promptLogout = () => {
        setShowLogoutConfirm(true);
        // Cerrar el dropdown del perfil
        setShowDropdown(false);
    };

    // Función para cerrar sesión después de confirmación
    const confirmLogout = () => {
        // Añadir efecto de carga si deseas
        const btnConfirm = document.getElementById('btnConfirmLogout');
        if (btnConfirm) {
            btnConfirm.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Cerrando sesión...';
            btnConfirm.disabled = true;
        }

        // Simular un pequeño retraso para efectos visuales
        setTimeout(() => {
            // Eliminar el token de autenticación del localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');

            // Cerrar el modal de confirmación
            setShowLogoutConfirm(false);

            // Redirigir al usuario a la página de login
            navigate('/');
        }, 800);
    };

    // Función para cancelar el cierre de sesión
    const cancelLogout = () => {
        // Animar la salida del modal
        setFadeIn(false);
        setTimeout(() => {
            setShowLogoutConfirm(false);
        }, 300);
    };

    // Cerrar modal con la tecla Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && showLogoutConfirm) {
                cancelLogout();
            }
        };

        if (showLogoutConfirm) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [showLogoutConfirm]);

    return (
        <div>
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="d-flex align-items-center justify-content-between px-4 py-3">
                    <div className="position-relative d-flex align-items-center" style={{ width: "250px" }}>
                    </div>

                    <div className="position-relative">
                        <button
                            className="btn d-flex align-items-center"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: "32px", height: "32px" }}>
                                <span>{getInitials(userName)}</span>
                            </div>
                            <div className="d-none d-md-block text-start ms-2">
                                <p className="mb-0 small fw-semibold text-uppercase">{userName}</p>
                                <p className="mb-0 text-muted small">{userRole}</p>

                            </div>
                            <ChevronDown size={16} className="ms-2" />
                        </button>

                        {showDropdown && (
                            <div className="position-absolute end-0 mt-2 dropdown-menu show shadow-sm">
                                <a href="#" className="dropdown-item">Perfil</a>
                                <a href="#" className="dropdown-item">Configuración</a>
                                <button onClick={promptLogout} className="dropdown-item text-danger d-flex align-items-center">
                                    <LogOut size={16} className="me-2" />
                                    <span>Cerrar sesión</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Modal de confirmación para cerrar sesión mejorado */}
            {showLogoutConfirm && (
                <div className={`modal-backdrop d-flex align-items-center justify-content-center ${fadeIn ? 'fade-in' : ''}`}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1050,
                        opacity: fadeIn ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                    }}
                    onClick={cancelLogout}>
                    <div
                        className={`modal-content bg-white rounded-lg shadow-lg ${fadeIn ? 'scale-in' : ''}`}
                        style={{
                            width: '90%',
                            maxWidth: '400px',
                            transform: fadeIn ? 'scale(1)' : 'scale(0.9)',
                            transition: 'transform 0.3s ease',
                            overflow: 'hidden'
                        }}
                        onClick={(e) => e.stopPropagation()}>

                        <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
                            <h5 className="mb-0 fw-bold d-flex align-items-center">
                                <AlertTriangle size={20} className="text-warning me-2" />
                                Confirmar cierre de sesión
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={cancelLogout}
                                style={{ transition: 'transform 0.2s' }}
                                onMouseOver={(e) => e.target.style.transform = 'rotate(90deg)'}
                                onMouseOut={(e) => e.target.style.transform = 'rotate(0deg)'}
                            ></button>
                        </div>

                        <div className="p-4">
                            <p className="mb-4">¿Está seguro que desea cerrar la sesión actual? Tendrá que volver a iniciar sesión para acceder a su cuenta.</p>

                            <div className="d-flex justify-content-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-light border"
                                    onClick={cancelLogout}
                                    style={{ transition: 'all 0.2s' }}
                                    onMouseOver={(e) => {
                                        e.target.classList.add('shadow-sm');
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.classList.remove('shadow-sm');
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    id="btnConfirmLogout"
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={confirmLogout}
                                    style={{ transition: 'all 0.2s' }}
                                    onMouseOver={(e) => {
                                        e.target.classList.add('shadow-sm');
                                        e.target.style.backgroundColor = '#dc2626';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.classList.remove('shadow-sm');
                                        e.target.style.backgroundColor = '';
                                    }}
                                >
                                    <LogOut size={16} className="me-1" />
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Añadir estilos inline para las animaciones */}
            <style>{`
                .fade-in {
                    opacity: 1 !important;
                }
                .scale-in {
                    transform: scale(1) !important;
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                .modal-backdrop {
                    backdrop-filter: blur(3px);
                }
                .btn:focus {
                    box-shadow: none;
                }
            `}</style>
        </div>
    );
}