import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ChangePassword.css'; // Archivo CSS para estilos personalizados

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validate = () => {
    const errors = {};
    
    if (!formData.password) {
      errors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Debes confirmar tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
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
        
        // Reset después de mostrar éxito
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({
            password: '',
            confirmPassword: ''
          });
        }, 3000);
      }, 1500);
    }
  };
  
  const getPasswordStrength = (password) => {
    if (!password) return { text: '', class: '' };
    
    if (password.length < 6) {
      return { text: 'Débil', class: 'text-danger' };
    } else if (password.length < 10) {
      return { text: 'Media', class: 'text-warning' };
    } else {
      return { text: 'Fuerte', class: 'text-success' };
    }
  };
  
  const passwordStrength = getPasswordStrength(formData.password);
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7 col-sm-10">
          <div className="card shadow-lg password-change-card">
            {isSuccess ? (
              <div className="success-message text-center p-5">
                <div className="check-circle">
                  <i className="bi bi-check-lg"></i>
                </div>
                <h3 className="mt-4">¡Contraseña actualizada!</h3>
                <p>Tu contraseña ha sido cambiada exitosamente</p>
              </div>
            ) : (
              <>
                <div className="card-header bg-primary text-white text-center py-4">
                  <h4 className="mb-0 fw-bold">Cambiar contraseña</h4>
                </div>
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <div className="lock-icon">
                      <i className="bi bi-shield-lock"></i>
                    </div>
                  </div>
                  
                  <form className="needs-validation" onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                      <div className="form-floating password-field">
                        <input
                          type="password"
                          className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                          id="password"
                          name="password"
                          placeholder="Nueva contraseña"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <label htmlFor="password">Nueva contraseña</label>
                        {formData.password && (
                          <div className={`password-strength ${passwordStrength.class}`}>
                            <span>Seguridad: {passwordStrength.text}</span>
                            <div className="strength-bar">
                              <div 
                                className={`strength-indicator ${passwordStrength.class}`} 
                                style={{
                                  width: formData.password.length < 6 ? '33%' : 
                                         formData.password.length < 10 ? '66%' : '100%'
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                      </div>
                    </div>
                    
                    <div className="mb-4">
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
                    
                    <div className="password-requirements mb-4">
                      <p className="text-muted mb-2 small">La contraseña debe cumplir con:</p>
                      <ul className="small text-muted">
                        <li className={formData.password.length >= 6 ? 'text-success' : ''}>
                          <i className={`bi ${formData.password.length >= 6 ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                          Al menos 6 caracteres
                        </li>
                        <li className={/[A-Z]/.test(formData.password) ? 'text-success' : ''}>
                          <i className={`bi ${/[A-Z]/.test(formData.password) ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                          Al menos una mayúscula
                        </li>
                        <li className={/[0-9]/.test(formData.password) ? 'text-success' : ''}>
                          <i className={`bi ${/[0-9]/.test(formData.password) ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
                          Al menos un número
                        </li>
                      </ul>
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
                            Actualizando...
                          </>
                        ) : 'Cambiar contraseña'}
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

export default ChangePassword;