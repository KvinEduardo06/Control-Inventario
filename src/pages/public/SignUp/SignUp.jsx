import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css'; // Archivo CSS para estilos personalizados
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const validate = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'El nombre es requerido';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'El apellido es requerido';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!formData.terms) {
      errors.terms = 'Debes aceptar los términos y condiciones';
    }
    
    return errors;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      // Simulación de envío al servidor
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        
        // Reset form after success
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            terms: false
          });
        }, 3000);
      }, 2000);
    }
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7 col-sm-9">
          <div className="card shadow-lg signup-card">
            {isSuccess ? (
              <div className="success-message text-center p-5">
                <div className="check-circle">
                  <i className="bi bi-check-lg"></i>
                </div>
                <h3 className="mt-4">¡Registro exitoso!</h3>
                <p>Tu cuenta ha sido creada correctamente</p>
              </div>
            ) : (
              <>
                <div className="card-header bg-primary text-white text-center py-4">
                  <h4 className="mb-0 fw-bold">Crear una cuenta</h4>
                </div>
                <div className="card-body p-4">
                  <form className="needs-validation" onSubmit={handleSubmit} noValidate>
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
                          type="password"
                          className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                          id="password"
                          name="password"
                          placeholder="Contraseña"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <label htmlFor="password">Contraseña</label>
                        {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="form-floating">
                        <input
                          type="password"
                          className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Confirmar contraseña"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        <label htmlFor="confirmPassword">Confirmar contraseña</label>
                        {formErrors.confirmPassword && <div className="invalid-feedback">{formErrors.confirmPassword}</div>}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className={`form-check-input ${formErrors.terms ? 'is-invalid' : ''}`}
                          id="terms"
                          name="terms"
                          checked={formData.terms}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="terms">
                          Acepto los <a href="#!" className="link-primary">términos y condiciones</a>
                        </label>
                        {formErrors.terms && <div className="invalid-feedback">{formErrors.terms}</div>}
                      </div>
                    </div>
                    
                    <div className="d-grid">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Procesando...
                          </>
                        ) : 'Registrarse'}
                      </button>
                    </div>
                    
                    <div className="text-center mt-4">
                      <p>¿Ya tienes una cuenta? <Link to="/" className="link-primary">Iniciar sesión</Link></p>
                    </div>
                    
                    <div className="divider my-4">o</div>
                    
                    <div className="social-buttons">
                      <button type="button" className="btn btn-outline-primary social-btn mb-2">
                        <i className="bi bi-google me-2"></i>Continuar con Google
                      </button>
                      <button type="button" className="btn btn-outline-dark social-btn">
                        <i className="bi bi-apple me-2"></i>Continuar con Apple
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;