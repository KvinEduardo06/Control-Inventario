import React, { useEffect, useState } from 'react';
import { crearEmpleado } from './services/crearEmpleado';
import { obtenerRoles } from './services/obtenerRoles';
import { toast } from 'react-toastify';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const [showModal, setShowModal] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    DUI: '',
    direccion: '',
    usuario: '',
    idRol: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Consumir el endpoint real para obtener roles
  useEffect(() => {
    const cargarRoles = async () => {
      try {
        setLoading(true);
        // Llamada al servicio para obtener roles
        const data = await obtenerRoles();
        setRoles(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los roles. Por favor, intenta nuevamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'DUI') {
      newValue = formatDUI(value);
    }
    setFormData({ ...formData, [name]: newValue });
  };

  const formatDUI = (value) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length <= 8) {
      return numericValue;
    }
    return `${numericValue.slice(0, 8)}-${numericValue.slice(8, 9)}`;
  };

  const validate = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = 'El nombre es requerido';
    if (!formData.lastName.trim()) errors.lastName = 'El apellido es requerido';
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    if (!formData.DUI.trim()) errors.DUI = 'El DUI es requerido';
    if (!formData.direccion.trim()) errors.direccion = 'La dirección es requerida';
    if (!formData.usuario.trim()) errors.usuario = 'El usuario es requerido';
    if (!formData.idRol) errors.idRol = 'El rol es requerido';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      try {
        // Preparar los datos para enviar al API
        const empleadoData = {
          nombre: formData.firstName,
          apellido: formData.lastName,
          email: formData.email,
          DUI: formData.DUI,
          direccion: formData.direccion,
          usuario: formData.usuario,
          idRol: formData.idRol
        };

        // Llamar a la función real para crear empleado
        const response = await crearEmpleado(empleadoData);

        setIsSubmitting(false);
        setIsSuccess(true);
        setSuccessMessage(response.message || 'Empleado creado correctamente');

        setTimeout(() => {
          setIsSuccess(false);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            DUI: '',
            direccion: '',
            usuario: '',
            idRol: ''
          });
          setShowModal(false);
        }, 3000);

      } catch (error) {
        // console.error("❌ Error al registrar:", error);
        setIsSubmitting(false);
        // Manejar el error (podrías mostrar un mensaje al usuario)
        if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
          error.response.data.errors.forEach(err => {
            toast.error(err.msg);
          });
          console.log(error.response.data.errors);
        } else {
          toast.error(`Error al crear empleado: ${error.response?.data?.message || 'Error desconocido ❌'}`);
        }

      }
    }
  };

  return (
    <div className="container py-4" style={{ fontFamily: "'Poppins', 'Segoe UI', Roboto, -apple-system, sans-serif" }}>
      {/* Data Table con botón para agregar empleado - Diseño moderno */}
      <div className="card shadow-sm border-0 rounded-3 mb-4">
        <div className="card-header bg-indigo-600 text-white d-flex justify-content-between align-items-center py-3" style={{ backgroundColor: '#ffffff' }}>
          <h5 className="mb-0 fw-bold">Lista de Empleados</h5>
          <button
            className="btn btn-light rounded-pill shadow-sm px-4 d-flex align-items-center"
            onClick={() => setShowModal(true)}
            style={{ fontWeight: '500' }}
          >
            <span className="me-2">+</span>
            Agregar Empleado
          </button>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0">
              <thead className="bg-light" style={{ borderBottom: '2px solid #f1f5f9' }}>
                <tr>
                  <th className="ps-4 py-3 text-muted fw-normal" style={{ fontSize: '0.9rem' }}>#</th>
                  <th className="py-3 text-muted fw-normal" style={{ fontSize: '0.9rem' }}>Nombre</th>
                  <th className="py-3 text-muted fw-normal" style={{ fontSize: '0.9rem' }}>Apellido</th>
                  <th className="py-3 text-muted fw-normal" style={{ fontSize: '0.9rem' }}>Usuario</th>
                  <th className="py-3 text-muted fw-normal" style={{ fontSize: '0.9rem' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-bottom" style={{ backgroundColor: '#f8f9fa' }}>
                  <td className="ps-4 py-3">1</td>
                  <td className="py-3">Mark</td>
                  <td className="py-3">Otto</td>
                  <td className="py-3">@mdo</td>
                  <td className="py-3">
                    <button className="btn btn-sm rounded-pill me-2 px-3" style={{ backgroundColor: '#22d3ee', color: 'white' }}>
                      Editar
                    </button>
                    <button className="btn btn-sm rounded-pill px-3" style={{ backgroundColor: '#f43f5e', color: 'white' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
                <tr className="border-bottom" style={{ backgroundColor: 'white' }}>
                  <td className="ps-4 py-3">2</td>
                  <td className="py-3">Jacob</td>
                  <td className="py-3">Thornton</td>
                  <td className="py-3">@fat</td>
                  <td className="py-3">
                    <button className="btn btn-sm rounded-pill me-2 px-3" style={{ backgroundColor: '#22d3ee', color: 'white' }}>
                      Editar
                    </button>
                    <button className="btn btn-sm rounded-pill px-3" style={{ backgroundColor: '#f43f5e', color: 'white' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <td className="ps-4 py-3">3</td>
                  <td className="py-3">Larry</td>
                  <td className="py-3">Bird</td>
                  <td className="py-3">@twitter</td>
                  <td className="py-3">
                    <button className="btn btn-sm rounded-pill me-2 px-3" style={{ backgroundColor: '#22d3ee', color: 'white' }}>
                      Editar
                    </button>
                    <button className="btn btn-sm rounded-pill px-3" style={{ backgroundColor: '#f43f5e', color: 'white' }}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal para el formulario SignUp */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header py-3" style={{ backgroundColor: '#6366f1', color: 'white' }}>
                <h5 className="modal-title fw-bold">Crear Empleado</h5>
                <button
                  type="button"
                  className="btn-close bg-light"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {isSuccess ? (
                  <div className="success-message text-center p-4">
                    <div className="check-circle">
                      ✓
                    </div>
                    <h3 className="mt-4">¡Registro exitoso!</h3>
                    <p>{successMessage}</p>
                  </div>
                ) : (
                  <div className="needs-validation">
                    <div className="row mb-3">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <div className="form-floating">
                          <input
                            type="text"
                            className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                            id="firstName"
                            name="firstName"
                            placeholder="Nombre"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                          <label htmlFor="firstName">Nombre</label>
                          {formErrors.firstName && <div className="invalid-feedback">{formErrors.firstName}</div>}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                            id="lastName"
                            name="lastName"
                            placeholder="Apellido"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                          <label htmlFor="lastName">Apellido</label>
                          {formErrors.lastName && <div className="invalid-feedback">{formErrors.lastName}</div>}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-floating">
                        <input
                          type="email"
                          className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                          id="email"
                          name="email"
                          placeholder="nombre@ejemplo.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <label htmlFor="email">Correo electrónico</label>
                        {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          className={`form-control ${formErrors.DUI ? 'is-invalid' : ''}`}
                          id="DUI"
                          name="DUI"
                          placeholder="DUI"
                          value={formData.DUI}
                          onChange={handleChange}
                          maxLength="10"
                        />
                        <label htmlFor="DUI">DUI</label>
                        {formErrors.DUI && <div className="invalid-feedback">{formErrors.DUI}</div>}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          className={`form-control ${formErrors.direccion ? 'is-invalid' : ''}`}
                          id="direccion"
                          name="direccion"
                          placeholder="Dirección"
                          value={formData.direccion}
                          onChange={handleChange}
                        />
                        <label htmlFor="direccion">Dirección</label>
                        {formErrors.direccion && <div className="invalid-feedback">{formErrors.direccion}</div>}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          className={`form-control ${formErrors.usuario ? 'is-invalid' : ''}`}
                          id="usuario"
                          name="usuario"
                          placeholder="Usuario"
                          value={formData.usuario}
                          onChange={handleChange}
                        />
                        <label htmlFor="usuario">Usuario</label>
                        {formErrors.usuario && <div className="invalid-feedback">{formErrors.usuario}</div>}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-floating">
                        <select
                          className={`form-select ${formErrors.idRol ? 'is-invalid' : ''}`}
                          id="idRol"
                          name="idRol"
                          value={formData.idRol}
                          onChange={handleChange}
                          disabled={loadingRoles}
                        >
                          <option value="">Seleccione un rol</option>
                          {loadingRoles ? (
                            <option value="" disabled>Cargando roles...</option>
                          ) : (
                            roles.map((rol) => (
                              <option key={`rol-${rol.id}`} value={rol.id}>
                                {rol.nombre}
                              </option>
                            ))
                          )}
                        </select>
                        <label htmlFor="idRol">Rol</label>
                        {formErrors.idRol && <div className="invalid-feedback">{formErrors.idRol}</div>}
                      </div>
                    </div>

                    <div className="d-grid">
                      <button
                        onClick={handleSubmit}
                        className="btn btn-lg py-3 rounded-3"
                        style={{ backgroundColor: '#6366f1', color: 'white', fontWeight: '500' }}
                        disabled={isSubmitting || loadingRoles}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Procesando...
                          </>
                        ) : 'Registrar Empleado'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;