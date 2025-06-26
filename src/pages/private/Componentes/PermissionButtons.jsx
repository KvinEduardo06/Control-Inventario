import React from 'react';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

/**
 * Button component that renders only if the user has the required permission
 * 
 * @param {Object} props - Component props
 * @param {string} props.modulo - Module name for permission check
 * @param {string} props.submodulo - Submodule name for permission check
 * @param {string} props.accion - Action name for permission check (crear, ver, editar, eliminar)
 * @param {string} props.variant - Button variant (primary, secondary, etc.)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {string} props.icon - Icon name from Bootstrap Icons (without the "bi-" prefix)
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onClick - Click handler function
 * @param {string} props.title - Button title for tooltip
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.usarNombreAccion - Whether to use the action name as button text
 * @param {React.ReactNode} props.children - Button content (text)
 */
const PermissionButton = ({
  modulo,
  submodulo,
  accion,
  variant = 'primary',
  size = '',
  icon,
  className = '',
  onClick,
  title = '',
  disabled = false,
  usarNombreAccion = false,
  children
}) => {
  const auth = useAuth();
  
  // Use specialized methods for CRUD operations
  let hasPermission = false;
  let accionInfo = null;
  
  // Obtener la información completa de la acción desde el backend
  accionInfo = auth.obtenerInfoAccion(modulo, submodulo, accion);
  
  if (accion === 'crear') {
    hasPermission = auth.puedeCrear(modulo, submodulo);
  } else if (accion === 'ver') {
    hasPermission = auth.puedeVer(modulo, submodulo);
  } else if (accion === 'editar') {
    hasPermission = auth.puedeEditar(modulo, submodulo);
  } else if (accion === 'eliminar') {
    hasPermission = auth.puedeEliminar(modulo, submodulo);
  } else {
    // Fall back to direct permission check
    hasPermission = auth.tienePermiso(modulo, submodulo, accion);
  }
  
  // console.log(`Permission check for ${modulo}|${submodulo}|${accion}: ${hasPermission}`, accionInfo);
  
  if (!hasPermission) {
    return null;
  }
  
  const buttonClass = `btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`;
  
  // Función para capitalizar la primera letra
  const capitalize = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };
  
  // Decide qué texto mostrar en el botón
  const buttonText = () => {
    // Si se proporcionó children y no queremos usar el nombre de la acción
    if (children && !usarNombreAccion) {
      return children;
    }
    
    // Si tenemos la información de la acción del backend y queremos usar ese nombre
    if (accionInfo && usarNombreAccion) {
      // Usar el nombre original del backend (puede estar en mayúsculas, minúsculas o mixto)
      return accionInfo.accionOriginal || accionInfo.accion;
    }
    
    // Fallback a un nombre genérico basado en la acción
    if (usarNombreAccion) {
      return capitalize(accion);
    }
    
    // Si no hay children ni usamos nombre de acción, mostrar un texto genérico
    return children || capitalize(accion);
  };
  
  // Función para obtener el título del botón
  const getButtonTitle = () => {
    if (title) return title;
    
    if (accionInfo) {
      return accionInfo.accionOriginal || accionInfo.accion;
    }
    
    return capitalize(accion);
  };
  
  return (
    <button
      type="button"
      className={buttonClass}
      onClick={onClick}
      title={getButtonTitle()}
      disabled={disabled}
    >
      {icon && <i className={`bi bi-${icon} ${buttonText() ? 'me-1' : ''}`}></i>}
      {buttonText()}
    </button>
  );
};

PermissionButton.propTypes = {
  modulo: PropTypes.string.isRequired,
  submodulo: PropTypes.string.isRequired,
  accion: PropTypes.string.isRequired,
  variant: PropTypes.string,
  size: PropTypes.string,
  icon: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  usarNombreAccion: PropTypes.bool,
  children: PropTypes.node
};

export default PermissionButton;