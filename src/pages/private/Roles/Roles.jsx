import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Shield,
  ChevronLeft,
  Users,
  Filter,
  MoreVertical,
  CheckCheck,
  Trash2Icon,
} from "lucide-react";
import { obtenerRoles } from "./GetRoles";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Roles.css";
import PermissionButton from "../Componentes/PermissionButtons";
import { useAuth } from "../context/AuthContext";
// Importar los modales
import {
  AddRoleModal,
  EditRoleModal,
  DeleteRoleModal,
} from "./Components/Modales/AddRoleModal";

// Añadir esta importación al inicio de tu archivo
import PermisosPorRol from "./Components/Modales/PermisosPorRol/PermisosPorRol"; // Ajusta la ruta según tu estructura

const BASE_URL = import.meta.env.VITE_API_URL;

const Roles = () => {
  const auth = useAuth();

  // Verificar permisos para ver la vista completa
  const canViewRoles = auth.puedeVer("Seguridad", "Rol");

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'

  // Estados para manejo de modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);

  // 1. Agregar estado para el mapeo
  const [estadosMap, setEstadosMap] = useState({});
  const [showActivateModal, setShowActivateModal] = useState(false);

  // PARA PERMISOS POR ROL
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: "",
    estado: "Activo",
  });

  const handleActivateRole = async (rolToActivate) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("apiToken");
      if (!token) throw new Error("No se encontró el token de autenticación");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // ID del estado "Activo" según tu API
      const estadoActivoId = 7;

      const roleData = {
        nombre: rolToActivate.nombre,
        idEstado: estadoActivoId,
      };

      await axios.put(`${BASE_URL}rol/${rolToActivate.id}`, roleData, config);
      toast.success("Rol activado exitosamente");
      loadRoles(); // Recargar la lista de roles
    } catch (err) {
      console.error("Error al activar rol:", err);
      toast.error(`Error al activar rol: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canViewRoles) {
      loadRoles(); // Esto ahora también cargará los estados
    } else {
      setLoading(false);
    }
  }, [canViewRoles]);

  // 2. Modificar loadRoles para crear el mapeo
  const loadRoles = async () => {
    try {
      setLoading(true);
      const data = await obtenerRoles();
      const rolesData = data.data || data;
      const enrichedRoles = rolesData.map((rol) => ({
        ...rol,
        isSelected: false,
      }));
      setRoles(enrichedRoles);

      // Crear mapeo dinámico de estados
      const estadosUnicos = {};
      enrichedRoles.forEach((rol) => {
        if (rol.estado?.nombre && rol.estado?.id) {
          estadosUnicos[rol.estado.nombre.toLowerCase()] = rol.estado.id;
        }
      });
      setEstadosMap(estadosUnicos);

      setError(null);
    } catch (err) {
      setError(
        "Error al cargar los roles. Verifica tu conexión o credenciales."
      );
      console.error(err);
      toast.error("Error al cargar los roles");
    } finally {
      setLoading(false);
    }
  };

  // Función para crear rol
  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("apiToken");
      if (!token) throw new Error("No se encontró el token de autenticación");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const roleData = {
        nombre: formData.nombre,
        // Fix: Use the actual ID value from formData.estado
        // Since the select dropdown stores the ID as a number
        idEstado: parseInt(formData.estado), // or just formData.estado if it's already a number
      };

      await axios.post(`${BASE_URL}rol/`, roleData, config);
      toast.success("Rol creado exitosamente");
      setShowAddModal(false);
      resetForm();
      loadRoles();
    } catch (err) {
      console.error("Error al crear rol:", err);
      toast.error(`Error al crear rol: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar rol
  const handleUpdateRole = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("apiToken");
      if (!token) throw new Error("No se encontró el token de autenticación");

      // Validar que se haya seleccionado un estado
      if (!formData.estado) {
        toast.error("Por favor selecciona un estado");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const roleData = {
        nombre: formData.nombre,
        // Fix: Use the actual ID value from formData.estado
        idEstado: parseInt(formData.estado),
      };

      await axios.put(`${BASE_URL}rol/${currentRole.id}`, roleData, config);
      toast.success("Rol actualizado exitosamente");
      setShowEditModal(false);
      resetForm();
      loadRoles();
    } catch (err) {
      console.error("Error al actualizar rol:", err);
      toast.error(`Error al actualizar rol: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar rol
  const handleDeleteRole = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("apiToken");
      if (!token) throw new Error("No se encontró el token de autenticación");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Improved: Remove the unnecessary variable and console.log
      await axios.delete(`${BASE_URL}rol/${currentRole.id}`, config);

      toast.success("Rol eliminado exitosamente");
      setShowDeleteModal(false);
      setCurrentRole(null);
      loadRoles();
    } catch (err) {
      console.error("Error al eliminar rol:", err);
      toast.error(`Error al eliminar rol: ${err.message}`);
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
      estado: role.estado?.nombre === "Activo" ? "Activo" : "Inactivo",
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (role) => {
    setCurrentRole(role);
    setShowDeleteModal(true);
  };

  // FUNCION PARA VER PERMISOS QUE TIENE ESTE ROL

  const handleViewRole = (role) => {
    setSelectedRole(role);
    setShowModal(true);
  };
  const resetForm = () => {
    setFormData({ nombre: "", estado: "Activo" });
    setCurrentRole(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setRoles(roles.map((rol) => ({ ...rol, isSelected: newSelectAll })));
    setSelectedRoles(newSelectAll ? roles.map((r) => r.id) : []);
  };

  const handleSelectOne = (id) => {
    const updatedRoles = roles.map((rol) =>
      rol.id === id ? { ...rol, isSelected: !rol.isSelected } : rol
    );
    setRoles(updatedRoles);
    const selected = updatedRoles.filter((r) => r.isSelected).map((r) => r.id);
    setSelectedRoles(selected);
    setSelectAll(updatedRoles.every((rol) => rol.isSelected));
  };

  const filteredRoles = roles.filter((rol) =>
    rol.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (estado) => {
    if (!estado?.nombre) return "bg-secondary";
    switch (estado.nombre.toLowerCase()) {
      case "activo":
        return "bg-success";
      case "inactivo":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  // Si no tiene permisos para ver, mostrar mensaje de acceso denegado
  if (!canViewRoles) {
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
        <div
          className="card shadow-lg border-0"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <div className="card-body text-center p-5">
            <div
              className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
              style={{ width: "64px", height: "64px" }}
            >
              <Shield className="text-danger" size={32} />
            </div>
            <h3 className="card-title h4 mb-3">Acceso Denegado</h3>
            <p className="card-text text-muted mb-3">
              No tienes permisos para acceder a esta vista.
            </p>
            <p className="small text-muted mb-4">
              Se requiere el permiso de <strong>"Ver"</strong> en el módulo{" "}
              <strong>"Seguridad - Rol"</strong>
            </p>
            <button
              className="btn btn-dark d-inline-flex align-items-center"
              onClick={() => window.history.back()}
            >
              <ChevronLeft size={16} className="me-2" />
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid py-4" style={{ maxWidth: "1400px" }}>
        {/* Toast Container */}
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
        {/* MODALES */}
        <AddRoleModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleAddRole}
          loading={loading}
        />
        <EditRoleModal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleUpdateRole}
          loading={loading}
          currentRole={currentRole}
        />
        <DeleteRoleModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteRole}
          loading={loading}
          currentRole={currentRole}
        />

        {/* PARA PERMISOS POR ROL MODAL */}
        <PermisosPorRol
          mostrar={showModal}
          alCerrar={() => setShowModal(false)}
          rol={selectedRole}
        />

        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
              <div className="mb-3 mb-sm-0">
                <h1 className="h3 mb-2">Gestión de Roles</h1>
                <p className="text-muted mb-0">
                  Administra los roles y permisos del sistema
                </p>
              </div>
              <div className="d-flex align-items-center">
                <div className="card border-0 shadow-sm me-3 p-3">
                  <Users className="text-primary" size={24} />
                </div>
                <div>
                  <small className="text-muted">Total Roles</small>
                  <div className="h4 mb-0">{roles.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Error Alert */}
        {error && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
              aria-label="Close"
            ></button>
          </div>
        )}
        {/* Filters and Actions */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-center">
              {/* Search */}
              <div className="col-12 col-lg-4">
                <div className="input-group">
                  <span className="input-group-text bg-primary text-white border-primary">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Buscar por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="col-12 col-lg-8">
                <div className="d-flex flex-wrap align-items-center justify-content-lg-end gap-2">
                  {/* View Mode Toggle */}
                  <div className="btn-group d-none d-sm-flex" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="viewMode"
                      id="tableView"
                      checked={viewMode === "table"}
                      onChange={() => setViewMode("table")}
                    />
                    <label
                      className="btn btn-outline-secondary btn-sm"
                      htmlFor="tableView"
                    >
                      Tabla
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="viewMode"
                      id="cardsView"
                      checked={viewMode === "cards"}
                      onChange={() => setViewMode("cards")}
                    />
                    <label
                      className="btn btn-outline-secondary btn-sm"
                      htmlFor="cardsView"
                    >
                      Tarjetas
                    </label>
                  </div>

                  {/* Bulk Actions */}
                  {selectedRoles.length > 0 && (
                    <div className="d-flex align-items-center gap-2">
                      <small className="text-muted">
                        {selectedRoles.length} seleccionados
                      </small>
                      <button className="btn btn-outline-danger btn-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  {/* Create Button */}
                  <PermissionButton
                    modulo="Seguridad"
                    submodulo="Rol"
                    accion="crear"
                    variant="primary"
                    onClick={openAddModal}
                     usarNombreAccion={true}
                  >
                    <Plus size={16} className="me-2" />
                  </PermissionButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Content */}
        {loading ? (
          <div className="card shadow-sm border-0">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted mb-0">Cargando roles...</p>
            </div>
          </div>
        ) : viewMode === "table" ? (
          // Table View
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "50px" }}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </div>
                    </th>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((rol) => (
                      <tr key={rol.id}>
                        <td>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={rol.isSelected}
                              onChange={() => handleSelectOne(rol.id)}
                            />
                          </div>
                        </td>
                        <td>
                          <strong>#{rol.id}</strong>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-primary rounded d-flex align-items-center justify-content-center me-3 text-white fw-bold"
                              style={{
                                width: "32px",
                                height: "32px",
                                fontSize: "14px",
                              }}
                            >
                              {rol.nombre.charAt(0).toUpperCase()}
                            </div>
                            <span className="fw-medium">{rol.nombre}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${getStatusBadge(
                              rol.estado
                            )} d-inline-flex align-items-center`}
                          >
                            <span
                              className={`rounded-circle me-1 ${
                                rol.estado?.nombre === "Activo"
                                  ? "bg-light"
                                  : "bg-white"
                              }`}
                              style={{ width: "6px", height: "6px" }}
                            ></span>
                            {rol.estado?.nombre || "No asignado"}
                          </span>
                        </td>
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <PermissionButton
                              modulo="Seguridad"
                              submodulo="Rol"
                              accion="ver"
                              variant="outline-primary"
                              size="sm"
                              title="Ver detalles"
                              onClick={() => handleViewRole(rol)}
                              // usarNombreAccion={true}
                            >
                              <Eye size={14} />
                            </PermissionButton>

                            <PermissionButton
                              modulo="Seguridad"
                              submodulo="Rol"
                              accion="editar"
                              variant="outline-dark"
                              size="sm"
                              title="Editar"
                              onClick={() => openEditModal(rol)}
                              // usarNombreAccion={true}
                            >
                              <Edit2 size={14} />
                            </PermissionButton>

                            {rol.estado?.nombre === "activo" ? (
                              // Botón para ELIMINAR (solo cuando está activo)
                              <PermissionButton
                                modulo="Seguridad"
                                submodulo="Rol"
                                accion="eliminar"
                                variant="outline-danger"
                                size="sm"
                                title="Eliminar"
                                onClick={() => openDeleteModal(rol)}
                              >
                                <Trash2Icon size={14} />
                              </PermissionButton>
                            ) : (
                              // Botón para ACTIVAR (solo cuando está inactivo)
                              <PermissionButton
                                modulo="Seguridad"
                                submodulo="Rol"
                                accion="eliminar"
                                variant="outline-success"
                                size="sm"
                                title="Activar"
                                onClick={() => handleActivateRole(rol)}
                              >
                                <CheckCheck size={14} />
                              </PermissionButton>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-5">
                        <Users size={48} className="text-muted mb-3" />
                        <h5 className="text-muted mb-2">
                          No se encontraron roles
                        </h5>
                        <p className="text-muted small mb-0">
                          {searchTerm
                            ? "Intenta ajustar los filtros de búsqueda"
                            : "No hay roles disponibles"}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Cards View
          <div className="row g-4">
            {filteredRoles.length > 0 ? (
              filteredRoles.map((rol) => (
                <div key={rol.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <div className="form-check me-3">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={rol.isSelected}
                              onChange={() => handleSelectOne(rol.id)}
                            />
                          </div>
                          <div
                            className="bg-primary rounded d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {rol.nombre.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            <MoreVertical size={14} />
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              {/* Tu botón existente */}
                              <PermissionButton
                                modulo="Seguridad"
                                submodulo="Rol"
                                accion="ver"
                                variant="outline-primary"
                                size="sm"
                                title="Ver detalles"
                                onClick={() => handleViewRole(rol)}
                              >
                                <Eye size={14} />
                              </PermissionButton>
                            </li>
                            <li>
                              <PermissionButton
                                modulo="Seguridad"
                                submodulo="Rol"
                                accion="editar"
                                variant="link"
                                className="dropdown-item"
                                onClick={() => openEditModal(rol)}
                                usarNombreAccion={true}
                              >
                                Editar
                              </PermissionButton>
                            </li>
                            <li>
                              <hr className="dropdown-divider" />
                            </li>
                            <li>
                              <PermissionButton
                                modulo="Seguridad"
                                submodulo="Rol"
                                accion="eliminar"
                                variant="link"
                                className="dropdown-item text-danger"
                                onClick={() => openDeleteModal(rol)}
                              >
                                Eliminar
                              </PermissionButton>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="card-title mb-1">{rol.nombre}</h6>
                        <small className="text-muted">ID: #{rol.id}</small>
                      </div>

                      <div className="mb-3">
                        <span
                          className={`badge ${getStatusBadge(
                            rol.estado
                          )} d-inline-flex align-items-center`}
                        >
                          <span
                            className={`rounded-circle me-1 ${
                              rol.estado?.nombre === "Activo"
                                ? "bg-light"
                                : "bg-white"
                            }`}
                            style={{ width: "6px", height: "6px" }}
                          ></span>
                          {rol.estado?.nombre || "No asignado"}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between pt-3 border-top">
                        <PermissionButton
                          modulo="Seguridad"
                          submodulo="Rol"
                          accion="ver"
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleViewRole(rol)}
                          usarNombreAccion={true}
                        >
                          <Eye size={14} className="me-1" />
                          Ver
                        </PermissionButton>

                        <PermissionButton
                          modulo="Seguridad"
                          submodulo="Rol"
                          accion="editar"
                          variant="outline-warning"
                          size="sm"
                          onClick={() => openEditModal(rol)}
                          usarNombreAccion={true}
                        >
                          <Edit2 size={14} className="me-1" />
                          Editar
                        </PermissionButton>

                        <PermissionButton
                          modulo="Seguridad"
                          submodulo="Rol"
                          accion="eliminar"
                          variant="outline-danger"
                          size="sm"
                          onClick={() => openDeleteModal(rol)}
                        >
                          <Trash2 size={14} className="me-1" />
                          Eliminar
                        </PermissionButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-body text-center py-5">
                    <Users size={48} className="text-muted mb-3" />
                    <h5 className="text-muted mb-2">No se encontraron roles</h5>
                    <p className="text-muted small mb-0">
                      {searchTerm
                        ? "Intenta ajustar los filtros de búsqueda"
                        : "No hay roles disponibles"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Pagination */}
        {filteredRoles.length > 0 && (
          <div className="card shadow-sm border-0 mt-4">
            <div className="card-body">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
                <div className="mb-3 mb-sm-0">
                  <small className="text-muted">
                    Mostrando <strong>{filteredRoles.length}</strong> de{" "}
                    <strong>{roles.length}</strong> roles
                  </small>
                </div>
                <nav>
                  <ul className="pagination pagination-sm mb-0">
                    <li className="page-item disabled">
                      <a className="page-link" href="#" aria-label="Previous">
                        Anterior
                      </a>
                    </li>
                    <li className="page-item active">
                      <a className="page-link" href="#">
                        1
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        2
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        3
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#" aria-label="Next">
                        Siguiente
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bootstrap CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />

      {/* Bootstrap JS */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </div>
  );
};

export default Roles;
