// AddRoleModal.jsx
import React, { useEffect, useState } from "react";
import { obtenerEstadosRoles } from "./ObtenerEstados"; // Ajusta la ruta

const AddRoleModal = ({
  show,
  onHide,
  formData,
  onFormChange,
  onSubmit,
  loading,
}) => {
  const [estados, setEstados] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(false);

  // Cargar estados cuando se abre el modal
  useEffect(() => {
    if (show) {
      cargarEstados();
    }
  }, [show]);

  const cargarEstados = async () => {
    try {
      setLoadingEstados(true);
      const response = await obtenerEstadosRoles(); // Fixed: using the correct function name

      // Ajusta según la estructura de tu respuesta
      // Si tu API devuelve { data: [...] }, usa response.data
      // Si devuelve directamente el array, usa response
      setEstados(response.data || response);
    } catch (error) {
      console.error("Error al cargar estados:", error);
      // Fallback a estados por defecto en caso de error
      setEstados([]);
    } finally {
      setLoadingEstados(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">Agregar Nuevo Rol</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onHide}
              ></button>
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre del Rol*
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={onFormChange}
                    required
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="estado" className="form-label">
                    Estado
                  </label>
                  <select
                    className="form-select"
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={onFormChange}
                    required
                    disabled={loadingEstados}
                  >
                    <option value="">
                      {loadingEstados
                        ? "Cargando estados..."
                        : "Selecciona un estado"}
                    </option>
                    {estados.map((estado) => (
                      <option key={estado.id} value={estado.id}>
                        {estado.nombre}
                      </option>
                    ))}
                  </select>
                  {loadingEstados && (
                    <div className="form-text">
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Cargando estados disponibles...
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onHide}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading || loadingEstados}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Guardando...
                    </>
                  ) : (
                    "Guardar Rol"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

// EditRoleModal.jsx
const EditRoleModal = ({
  show,
  onHide,
  formData,
  onFormChange,
  onSubmit,
  loading,
  currentRole,
}) => {
  const [estados, setEstados] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(false);

  // Cargar estados cuando se abre el modal
  useEffect(() => {
    if (show) {
      cargarEstados();
    }
  }, [show]);

  const cargarEstados = async () => {
    try {
      setLoadingEstados(true);
      const response = await obtenerEstadosRoles();
      setEstados(response.data || response);
    } catch (error) {
      console.error("Error al cargar estados:", error);
      setEstados();
    } finally {
      setLoadingEstados(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                Editar Rol - {currentRole?.nombre}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onHide}
              ></button>
            </div>
            <form onSubmit={onSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="edit-nombre" className="form-label">
                    Nombre del Rol*
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edit-nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={onFormChange}
                    required
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="edit-estado" className="form-label">
                    Estado
                  </label>
                  <select
                    className="form-select"
                    id="edit-estado"
                    name="estado"
                    value={formData.estado || currentRole?.idEstado || ""}
                    onChange={onFormChange}
                    required
                    disabled={loadingEstados}
                  >
                    <option value="">
                      {loadingEstados
                        ? "Cargando estados..."
                        : "Selecciona un estado"}
                    </option>
                    {estados.map((estado) => (
                      <option key={estado.id} value={estado.id}>
                        {estado.nombre}
                      </option>
                    ))}
                  </select>
                  {loadingEstados && (
                    <div className="form-text">
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Cargando estados disponibles...
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onHide}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || loadingEstados}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Actualizando...
                    </>
                  ) : (
                    "Actualizar Rol"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

// DeleteRoleModal.jsx - No necesita cambios ya que no maneja estados
const DeleteRoleModal = ({ show, onHide, onConfirm, loading, currentRole }) => {
  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Confirmar Eliminación</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onHide}
              ></button>
            </div>
            <div className="modal-body">
              <div className="text-center mb-3">
                <i
                  className="bi bi-exclamation-triangle-fill text-warning"
                  style={{ fontSize: "3rem" }}
                ></i>
              </div>
              <p className="text-center">
                ¿Estás seguro de que deseas eliminar el rol{" "}
                <strong>{currentRole?.nombre}</strong>?
              </p>
              <div className="alert alert-warning">
                <small>
                  <i className="bi bi-info-circle me-1"></i>
                  Esta acción no se puede deshacer y podría afectar a usuarios
                  que tengan asignado este rol.
                </small>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Eliminando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-trash me-2"></i>
                    Eliminar Rol
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

// Exportaciones
export { AddRoleModal, EditRoleModal, DeleteRoleModal };
