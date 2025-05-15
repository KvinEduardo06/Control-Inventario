import React, { useState, useEffect } from 'react';
import { obtenerRoles } from './GetRoles';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
import './Roles.css';

// URL base para las peticiones API
const BASE_URL = import.meta.env.VITE_API_URL;

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectAll, setSelectAll] = useState(false);

    // Estados para manejo de modales
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);

    // Estado para el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        estado: 'activo',
    });

    // Cargar roles al montar el componente
    useEffect(() => {
        loadRoles();
    }, []);

    // Función para cargar roles
    const loadRoles = async () => {
        try {
            setLoading(true);
            const data = await obtenerRoles();

            // Asumimos que la respuesta tiene una propiedad 'data' que contiene el array de roles
            // Ajusta esto según la estructura real de tu respuesta
            const rolesData = data.data || data;

            // Enriquecemos los datos con algunas propiedades para la UI
            const enrichedRoles = rolesData.map(rol => ({
                ...rol,
                isSelected: false
            }));

            setRoles(enrichedRoles);
            setError(null);
        } catch (err) {
            setError('Error al cargar los roles. Verifica tu conexión o credenciales.');
            console.error(err);
            toast.error('Error al cargar los roles', {
                position: "top-right",
                autoClose: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    // Funciones para manipulación de roles

    // Agregar nuevo rol
    const handleAddRole = async (e) => {
        e.preventDefault();

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
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            // Transformar estado a idEstado (asumiendo que "activo" = 1, "inactivo" = 2)
            // Modifica esto según la lógica de tu aplicación
            const idEstado = formData.estado === 'activo' ? 7 : 8;

            // Preparar datos para enviar
            const roleData = {
                nombre: formData.nombre,
                idEstado: idEstado // Ahora enviamos el idEstado correcto
                // Añade más campos según lo que requiera tu API
            };

            // Realizar la petición para crear rol
            const response = await axios.post(`${BASE_URL}rol`, roleData, config);

            console.log("Respuesta al crear rol:", response.data);

            // Mostrar mensaje de éxito con toastify
            toast.success('Rol creado exitosamente', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });

            // Cerrar modal y recargar roles
            setShowAddModal(false);
            resetForm();
            loadRoles();

        } catch (err) {
            console.error("Error al crear rol:", err);

            // Mostrar mensaje de error con toastify
            toast.error(`Error al crear rol: ${err.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } finally {
            setLoading(false);
        }
    };

    // Actualizar rol existente
    const handleUpdateRole = async (e) => {
        e.preventDefault();

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
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            // Transformar estado a idEstado si es necesario para la actualización
            const idEstado = formData.estado === 'activo' ? 1 : 2;

            // Preparar datos para enviar
            const roleData = {
                nombre: formData.nombre,
                idEstado: idEstado // Incluimos idEstado en la actualización
            };

            // Realizar la petición para actualizar rol
            const response = await axios.put(`${BASE_URL}rol/${currentRole.id}`, roleData, config);

            console.log("Respuesta al actualizar rol:", response.data);

            // Mostrar mensaje de éxito con toastify
            toast.success('Rol actualizado exitosamente', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });

            // Cerrar modal y recargar roles
            setShowEditModal(false);
            resetForm();
            loadRoles();

        } catch (err) {
            console.error("Error al actualizar rol:", err);

            // Mostrar mensaje de error con toastify
            toast.error(`Error al actualizar rol: ${err.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } finally {
            setLoading(false);
        }
    };

    // Eliminar rol
    const handleDeleteRole = async () => {
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

            // Realizar la petición para eliminar rol
            await axios.delete(`${BASE_URL}rol/${currentRole.id}`, config);

            // Mostrar mensaje de éxito con toastify
            toast.success('Rol eliminado exitosamente', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });

            // Cerrar modal y recargar roles
            setShowDeleteModal(false);
            setCurrentRole(null);
            loadRoles();

        } catch (err) {
            console.error("Error al eliminar rol:", err);

            // Mostrar mensaje de error con toastify
            toast.error(`Error al eliminar rol: ${err.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } finally {
            setLoading(false);
        }
    };

    // Manejadores para modales
    const openAddModal = () => {
        resetForm();
        setShowAddModal(true);
    };

    const openEditModal = (role) => {
        setCurrentRole(role);
        setFormData({
            nombre: role.nombre,
            estado: role.estado.nombre === 'activo' ? 'activo' : 'inactivo' // Extraer el nombre del estado
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (role) => {
        setCurrentRole(role);
        setShowDeleteModal(true);
    };

    // Resetear formulario
    const resetForm = () => {
        setFormData({
            nombre: '',
            estado: 'activo'
        });
        setCurrentRole(null);
    };

    // Manejar cambios en el formulario
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Manejador para seleccionar/deseleccionar todos
    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        setRoles(roles.map(rol => ({ ...rol, isSelected: !selectAll })));
    };

    // Manejador para selección individual
    const handleSelectOne = (id) => {
        setRoles(roles.map(rol =>
            rol.id === id ? { ...rol, isSelected: !rol.isSelected } : rol
        ));

        // Actualizar selectAll basado en si todos están seleccionados
        const allSelected = roles.every(rol => rol.isSelected);
        setSelectAll(allSelected);
    };

    // Filtrar roles según búsqueda
    const filteredRoles = roles.filter(rol => {
        return rol.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Determinar el color del badge según el estado
    const getStateBadgeClass = (estado) => {
        // Verificar si el estado es un objeto o un string
        if (typeof estado === 'object' && estado !== null) {
            return estado.nombre === 'activo' ? 'bg-success' : 'bg-danger';
        } else {
            return estado === 'activo' ? 'bg-success' : 'bg-danger';
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Gestión de Roles</h2>
            
            {/* Contenedor de Toastify */}
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {/* Modal para Agregar Rol */}
            {showAddModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">Agregar Nuevo Rol</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <form onSubmit={handleAddRole}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="form-label">Nombre del Rol*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="estado" className="form-label">Estado</label>
                                        <select
                                            className="form-select"
                                            id="estado"
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleFormChange}
                                            required
                                        >
                                            <option value="activo">activo</option>
                                            <option value="inactivo">inactivo</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-success" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Guardando...
                                            </>
                                        ) : (
                                            'Guardar Rol'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Editar Rol */}
            {showEditModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Editar Rol</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <form onSubmit={handleUpdateRole}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="edit-nombre" className="form-label">Nombre del Rol*</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="edit-nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleFormChange}
                                            required
                                        />
                                    </div>
                                    
                                    {/* Añadimos el campo de estado en el formulario de edición */}
                                    <div className="mb-3">
                                        <label htmlFor="edit-estado" className="form-label">Estado</label>
                                        <select
                                            className="form-select"
                                            id="edit-estado"
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleFormChange}
                                            required
                                        >
                                            <option value="activo">activo</option>
                                            <option value="inactivo">inactivo</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Actualizando...
                                            </>
                                        ) : (
                                            'Actualizar Rol'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Confirmar Eliminación */}
            {showDeleteModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">Confirmar Eliminación</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Estás seguro de que deseas eliminar el rol <strong>{currentRole?.nombre}</strong>?</p>
                                <p className="text-danger"><small>Esta acción no se puede deshacer.</small></p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
                                <button type="button" className="btn btn-danger" onClick={handleDeleteRole} disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Eliminando...
                                        </>
                                    ) : (
                                        'Eliminar Rol'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay para modales */}
            {(showAddModal || showEditModal || showDeleteModal) && (
                <div className="modal-backdrop fade show"></div>
            )}

            {/* Muestra mensaje de error si existe */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Búsqueda y filtro */}
            <div className="row mb-4">
                <div className="col-md-10 mb-3 mb-md-0">
                    <div className="input-group">
                        <span className="input-group-text bg-primary text-white">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-2 p-2">
                    <button
                        className="btn btn-success w-100"
                        onClick={openAddModal}
                    >
                        <i className="bi bi-plus-circle"></i> Añadir Rol
                    </button>
                </div>
            </div>

            {/* Tabla Responsiva */}
            <div className="table-container">
                {loading ? (
                    <div className="text-center my-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-2">Cargando roles...</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover table-responsive-stack">
                            <thead>
                                <tr>
                                    <th width="5%">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                            />
                                        </div>
                                    </th>
                                    <th width="15%">ID</th>
                                    <th width="40%">Nombre</th>
                                    <th width="20%">Estado</th>
                                    <th width="20%">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRoles.length > 0 ? (
                                    filteredRoles.map(rol => (
                                        <tr key={rol.id}>
                                            <td data-label="Seleccionar">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={rol.isSelected}
                                                        onChange={() => handleSelectOne(rol.id)}
                                                    />
                                                </div>
                                            </td>
                                            <td data-label="ID">{rol.id}</td>
                                            <td data-label="Nombre">{rol.nombre}</td>
                                            <td data-label="Estado">
                                                <span className={`badge ${getStateBadgeClass(rol.estado)}`}>
                                                    {typeof rol.estado === 'object' ? rol.estado.nombre : rol.estado}
                                                </span>
                                            </td>
                                            <td data-label="Acciones" className="action-buttons">
                                               
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    title="Ver detalles"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    title="Editar"
                                                    onClick={() => openEditModal(rol)}
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    title="Eliminar"
                                                    onClick={() => openDeleteModal(rol)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">
                                            <i className="bi bi-emoji-frown fs-1 text-muted"></i>
                                            <p className="mt-2">No se encontraron roles con los criterios de búsqueda</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Paginación */}
            {filteredRoles.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <div>
                        <span className="text-muted">Mostrando {filteredRoles.length} de {roles.length} roles</span>
                    </div>
                    <nav>
                        <ul className="pagination">
                            <li className="page-item disabled">
                                <a className="page-link" href="#" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            <li className="page-item active"><a className="page-link" href="#">1</a></li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default Roles;