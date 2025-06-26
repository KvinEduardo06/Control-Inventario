import React, { useState, useEffect } from "react";
import {
  Shield,
  Search,
  X,
  Loader2,
  ChevronDown,
  ChevronRight,
  User,
  Eye,
  Plus,
  Edit,
  Trash2,
  Lock,
  Settings,
} from "lucide-react";

import axios from "axios";
import { toast } from "react-toastify";

const URL_BASE = import.meta.env.VITE_API_URL;

const PermisosPorRol = ({
  mostrar = true,
  alCerrar = () => {},
  rol = { id: 1, nombre: "Administrador" },
}) => {
  const [permisos, setPermisos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [modulosDesplegados, setModulosDesplegados] = useState({});
  const [submodulosDesplegados, setSubmodulosDesplegados] = useState({});

  useEffect(() => {
    if (mostrar && rol?.id) {
      cargarDatos();
    }
  }, [mostrar, rol?.id]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);

      const token = localStorage.getItem("apiToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const respPermisos = await axios.get(
        `${URL_BASE}rol/verAcceso/${rol.id}`,
        config
      );
      setPermisos(respPermisos.data || []);

      // Inicializar todos los módulos como desplegados
      const estadoInicialModulos = {};
      const estadoInicialSubmodulos = {};
      (respPermisos.data || []).forEach((modulo, index) => {
        estadoInicialModulos[index] = true;

        modulo.submodulos?.forEach((_, subIndex) => {
          estadoInicialSubmodulos[`${index}-${subIndex}`] = true;
        });
      });
      setModulosDesplegados(estadoInicialModulos);
      setSubmodulosDesplegados(estadoInicialSubmodulos);
    } catch (err) {
      setError("Error al cargar permisos");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const toggleModulo = (indiceModulo) => {
    setModulosDesplegados((prev) => ({
      ...prev,
      [indiceModulo]: !prev[indiceModulo],
    }));
  };

  const toggleSubmodulo = (indiceModulo, indiceSubmodulo) => {
    const clave = `${indiceModulo}-${indiceSubmodulo}`;
    setSubmodulosDesplegados((prev) => ({
      ...prev,
      [clave]: !prev[clave],
    }));
  };

  const desplegarTodos = () => {
    const estadoTodosModulos = {};
    const estadoTodosSubmodulos = {};

    permisosFiltrados.forEach((modulo, index) => {
      estadoTodosModulos[index] = true;

      modulo.submodulos?.forEach((_, subIndex) => {
        estadoTodosSubmodulos[`${index}-${subIndex}`] = true;
      });
    });

    setModulosDesplegados(estadoTodosModulos);
    setSubmodulosDesplegados(estadoTodosSubmodulos);
  };

  const plegarTodos = () => {
    const estadoTodosModulos = {};
    const estadoTodosSubmodulos = {};

    permisosFiltrados.forEach((modulo, index) => {
      estadoTodosModulos[index] = false;

      modulo.submodulos?.forEach((_, subIndex) => {
        estadoTodosSubmodulos[`${index}-${subIndex}`] = false;
      });
    });

    setModulosDesplegados(estadoTodosModulos);
    setSubmodulosDesplegados(estadoTodosSubmodulos);
  };

  const togglePermiso = async (modulo, submodulo, acceso, marcado) => {
    try {
      const token = localStorage.getItem("apiToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const datos = {
        idRol: rol.id,
        idAcceso: obtenerIdAcceso(modulo, submodulo, acceso),
      };

      await axios.post(`${URL_BASE}rol/agregarOeliminarAcceso/`, datos, config);

      setPermisos((permisosActuales) => {
        return permisosActuales.map((mod) => {
          if (mod.nombre === modulo) {
            return {
              ...mod,
              submodulos: mod.submodulos?.map((sub) => {
                if (sub.nombre === submodulo) {
                  return {
                    ...sub,
                    acceso: sub.acceso?.map((acc) => {
                      if (acc.nombre === acceso) {
                        return {
                          ...acc,
                          tienePermiso: marcado,
                        };
                      }
                      return acc;
                    }),
                  };
                }
                return sub;
              }),
            };
          }
          return mod;
        });
      });

      if (marcado) {
        toast.success(`Permiso agregado`);
      } else {
        toast.success(`Permiso eliminado`);
      }
    } catch (err) {
      toast.error("Error al cambiar permiso");
      console.error(err);
      cargarDatos();
    }
  };

  const obtenerIdAcceso = (modulo, submodulo, acceso) => {
    for (const m of permisos) {
      if (m.nombre === modulo) {
        for (const s of m.submodulos || []) {
          if (s.nombre === submodulo) {
            for (const a of s.acceso || []) {
              if (a.nombre === acceso) {
                return a.id;
              }
            }
          }
        }
      }
    }
    throw new Error("Acceso no encontrado");
  };

  const permisosFiltrados = permisos.filter((modulo) => {
    if (!busqueda) return true;
    const termino = busqueda.toLowerCase();

    return (
      modulo.nombre.toLowerCase().includes(termino) ||
      modulo.submodulos?.some(
        (sub) =>
          sub.nombre.toLowerCase().includes(termino) ||
          sub.acceso?.some((acc) => acc.nombre.toLowerCase().includes(termino))
      )
    );
  });

  const contarPermisosAsignados = () => {
    let contador = 0;
    permisos.forEach((modulo) => {
      modulo.submodulos?.forEach((sub) => {
        sub.acceso?.forEach((acc) => {
          if (acc.tienePermiso) {
            contador++;
          }
        });
      });
    });
    return contador;
  };

  const contarTotalPermisos = () => {
    return permisos.reduce(
      (total, mod) =>
        total +
        (mod.submodulos?.reduce(
          (subTotal, sub) => subTotal + (sub.acceso?.length || 0),
          0
        ) || 0),
      0
    );
  };

  const contarPermisosPorSubmodulo = (submodulo) => {
    let asignados = 0;
    let total = 0;

    submodulo.acceso?.forEach((acc) => {
      total++;
      if (acc.tienePermiso) {
        asignados++;
      }
    });

    return { asignados, total };
  };

  const obtenerIconoAcceso = (nombreAcceso) => {
    const nombre = nombreAcceso.toLowerCase();
    if (
      nombre.includes("ver") ||
      nombre.includes("visualizar") ||
      nombre.includes("listar")
    ) {
      return <Eye size={16} className="me-2" />;
    }
    if (
      nombre.includes("crear") ||
      nombre.includes("agregar") ||
      nombre.includes("nuevo")
    ) {
      return <Plus size={16} className="me-2" />;
    }
    if (
      nombre.includes("editar") ||
      nombre.includes("modificar") ||
      nombre.includes("actualizar")
    ) {
      return <Edit size={16} className="me-2" />;
    }
    if (
      nombre.includes("eliminar") ||
      nombre.includes("borrar") ||
      nombre.includes("delete")
    ) {
      return <Trash2 size={16} className="me-2" />;
    }
    if (
      nombre.includes("asignar") ||
      nombre.includes("permisos")
    ) {
      return <Settings size={16} className="me-2" />;
    }
    return <Lock size={16} className="me-2" />;
  };

  const manejarCierre = () => {
    setPermisos([]);
    setError(null);
    setBusqueda("");
    setModulosDesplegados({});
    setSubmodulosDesplegados({});
    alCerrar();
  };

  if (!mostrar) return null;

  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <div className="modal-backdrop fade show" onClick={manejarCierre}></div>

      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        style={{ paddingRight: "17px" }}
      >
        <div
          className="modal-dialog modal-xl modal-dialog-scrollable"
          role="document"
        >
          <div className="modal-content shadow-lg border-0">
            {/* Header */}
            <div className="modal-header border-0 p-4 bg-primary-gradient">
              <h5 className="modal-title d-flex align-items-center text-white fw-bold">
                <Shield className="me-2 text-white" size={24} />
                Permisos de {rol?.nombre}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={manejarCierre}
              ></button>
            </div>

            {/* Sub-header con estadísticas */}
            <div className="bg-light border-bottom px-4 py-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <span className="text-muted small me-3">Gestión de accesos y permisos del sistema</span>
                </div>
                <div className="d-flex align-items-center gap-4">
                  <div className="d-flex align-items-center">
                    <div className="status-indicator bg-success me-2"></div>
                    <span className="fw-bold text-success me-1">{contarPermisosAsignados()}</span>
                    <span className="text-muted small">Asignados</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="status-indicator bg-secondary me-2"></div>
                    <span className="fw-bold text-secondary me-1">{contarTotalPermisos() - contarPermisosAsignados()}</span>
                    <span className="text-muted small">Disponibles</span>
                  </div>
                  <div className="progress-container">
                    <div className="progress" style={{ width: "120px", height: "8px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{
                          width: `${(contarPermisosAsignados() / contarTotalPermisos()) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-muted small">
                    Total: <span className="fw-bold">{contarTotalPermisos()}</span> permisos
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="modal-body p-4 bg-gray-50">
              {/* Buscador y Controles */}
              <div className="mb-4">
                <div className="search-container position-relative mb-3">
                  <Search size={18} className="search-icon text-muted" />
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Buscar permisos, módulos o submódulos..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  {busqueda && (
                    <button
                      className="btn btn-sm btn-light search-clear"
                      onClick={() => setBusqueda("")}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={desplegarTodos}
                    disabled={cargando}
                  >
                    <ChevronDown size={14} className="me-1" />
                    Expandir Todo
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={plegarTodos}
                    disabled={cargando}
                  >
                    <ChevronRight size={14} className="me-1" />
                    Contraer Todo
                  </button>
                </div>
              </div>

              {/* Loading */}
              {cargando && (
                <div className="text-center py-5">
                  <Loader2
                    className="animate-spin text-primary mb-3"
                    size={32}
                  />
                  <p className="text-muted">Cargando permisos...</p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Content */}
              {!cargando && !error && (
                <div className="permissions-container">
                  {permisosFiltrados.length === 0 ? (
                    <div className="text-center py-5">
                      <Search size={48} className="text-muted mb-3" />
                      <h5 className="text-muted">No se encontraron permisos</h5>
                    </div>
                  ) : (
                    permisosFiltrados.map((modulo, i) => {
                      const estaDesplegado = modulosDesplegados[i];
                      const totalPermisosModulo =
                        modulo.submodulos?.reduce(
                          (total, sub) => total + (sub.acceso?.length || 0),
                          0
                        ) || 0;

                      return (
                        <div key={i} className="module-card mb-3">
                          {/* Header del módulo */}
                          <div
                            className="module-header cursor-pointer"
                            onClick={() => toggleModulo(i)}
                          >
                            <div className="d-flex align-items-center">
                              <div className="expand-toggle me-3">
                                {estaDesplegado ? (
                                  <ChevronDown size={18} className="text-primary" />
                                ) : (
                                  <ChevronRight size={18} className="text-primary" />
                                )}
                              </div>
                              <User size={18} className="me-3 text-primary" />
                              <div className="flex-grow-1">
                                <h6 className="module-title mb-0">{modulo.nombre}</h6>
                                <small className="text-muted">
                                  {modulo.submodulos?.length || 0} submódulos
                                </small>
                              </div>
                              <div className="module-badge">
                                <span className="badge bg-primary rounded-pill">
                                  Total Accesos: {totalPermisosModulo}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Contenido del módulo */}
                          {estaDesplegado && (
                            <div className="module-content">
                              {modulo.submodulos?.map((sub, j) => {
                                const { asignados, total } = contarPermisosPorSubmodulo(sub);
                                const subEstaDesplegado = submodulosDesplegados[`${i}-${j}`];

                                return (
                                  <div key={j} className="submodule-card mb-3">
                                    {/* Header del submódulo */}
                                    <div
                                      className="submodule-header cursor-pointer"
                                      onClick={() => toggleSubmodulo(i, j)}
                                    >
                                      <div className="d-flex align-items-center">
                                        <div className="expand-toggle me-3">
                                          {subEstaDesplegado ? (
                                            <ChevronDown size={16} className="text-secondary" />
                                          ) : (
                                            <ChevronRight size={16} className="text-secondary" />
                                          )}
                                        </div>
                                        <div className="submodule-number me-3">
                                          {j + 1}
                                        </div>
                                        <div className="flex-grow-1">
                                          <h6 className="submodule-title mb-0">{sub.nombre}</h6>
                                          <div className="progress-bar-container mt-1">
                                            <div className="progress-mini">
                                              <div
                                                className="progress-bar bg-success"
                                                style={{
                                                  width: `${(asignados / total) * 100}%`,
                                                }}
                                              ></div>
                                            </div>
                                            <small className="text-muted ms-2">
                                              {asignados}/{total}
                                            </small>
                                          </div>
                                        </div>
                                        <div className="submodule-badge">
                                          <span className="badge bg-secondary rounded-pill">
                                            {total}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Contenido del submódulo */}
                                    {subEstaDesplegado && (
                                      <div className="submodule-content">
                                        <div className="permissions-grid">
                                          {sub.acceso?.map((acc, k) => {
                                            const marcado = acc.tienePermiso === true;

                                            return (
                                              <div key={k} className="permission-item">
                                                <div className="form-check permission-checkbox">
                                                  <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`${i}-${j}-${k}`}
                                                    checked={marcado}
                                                    onChange={(e) =>
                                                      togglePermiso(
                                                        modulo.nombre,
                                                        sub.nombre,
                                                        acc.nombre,
                                                        e.target.checked
                                                      )
                                                    }
                                                  />
                                                  <label
                                                    className="form-check-label permission-label"
                                                    htmlFor={`${i}-${j}-${k}`}
                                                  >
                                                    <div className={`permission-button ${marcado ? 'active' : ''}`}>
                                                      {obtenerIconoAcceso(acc.nombre)}
                                                      <span className="permission-name">{acc.nombre}</span>
                                                      <div className="permission-lock">
                                                        <Lock size={12} />
                                                      </div>
                                                    </div>
                                                  </label>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 p-4 bg-light">
              <div className="d-flex justify-content-between align-items-center w-100">
                <small className="text-muted">
                  <span className="fw-bold">{contarPermisosAsignados()}</span> permisos asignados de{" "}
                  <span className="fw-bold">{contarTotalPermisos()}</span> disponibles
                </small>
                <button
                  type="button"
                  className="btn btn-danger px-4"
                  onClick={manejarCierre}
                >
                  <X size={16} className="me-1" />
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-primary-gradient {
          background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
        }

        .bg-gray-50 {
          background-color: #f8f9fa;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .search-container {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
        }

        .search-input {
          padding-left: 40px !important;
          padding-right: 40px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
        }

        .search-clear {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          z-index: 2;
        }

        .permissions-container {
          max-height: 500px;
          overflow-y: auto;
        }

        .module-card {
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          overflow: hidden;
          background: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .module-header {
          padding: 16px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
          transition: all 0.2s ease;
        }

        .module-header:hover {
          background: #e9ecef;
        }

        .module-title {
          font-weight: 600;
          color: #2c3e50;
          font-size: 16px;
        }

        .module-badge .badge {
          font-size: 12px;
          padding: 6px 12px;
        }

        .module-content {
          padding: 16px 12px 16px 12px;
        }

        .submodule-card {
          border: 1px solid #e9ecef;
          border-radius: 8px;
          overflow: hidden;
          background: #fafbfc;
        }

        .submodule-header {
          padding: 12px 16px;
          background: #f1f3f4;
          border-bottom: 1px solid #e9ecef;
          transition: all 0.2s ease;
        }

        .submodule-header:hover {
          background: #e9ecef;
        }

        .submodule-number {
          width: 24px;
          height: 24px;
          background: #6c757d;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
        }

        .submodule-title {
          font-weight: 600;
          color: #495057;
          font-size: 14px;
        }

        .progress-mini {
          width: 60px;
          height: 4px;
          background: #e9ecef;
          border-radius: 2px;
          overflow: hidden;
          display: inline-block;
        }

        .progress-mini .progress-bar {
          height: 100%;
          transition: width 0.3s ease;
        }

        .submodule-content {
          padding: 16px;
        }

        .permissions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 12px;
        }

        .permission-item {
          position: relative;
        }

        .permission-checkbox {
          margin-bottom: 0;
        }

        .permission-checkbox input[type="checkbox"] {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .permission-label {
          cursor: pointer;
          display: block;
          margin-bottom: 0;
        }

        .permission-button {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          background: white;
          transition: all 0.2s ease;
          position: relative;
          font-size: 14px;
        }

        .permission-button:hover {
          border-color: #4a90e2;
          background: #f8f9ff;
        }

        .permission-button.active {
          background: #4a90e2;
          border-color: #4a90e2;
          color: white;
        }

        .permission-name {
          flex-grow: 1;
          font-weight: 500;
        }

        .permission-lock {
          opacity: 0.7;
          margin-left: auto;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .expand-toggle {
          transition: transform 0.2s ease;
        }

        .permissions-container::-webkit-scrollbar {
          width: 6px;
        }

        .permissions-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .permissions-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .permissions-container::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </>
  );
};

export default PermisosPorRol;