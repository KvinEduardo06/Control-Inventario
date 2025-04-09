import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Menu, Plus, Trash2, Edit, AlertTriangle, Package, TrendingUp, TrendingDown, RefreshCw, Clipboard, FileText, Settings, LogOut, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Datos simulados para el inventario
  const [products, setProducts] = useState([
    { id: 1, code: 'P001', name: 'Laptop HP', category: 'Electrónicos', stock: 24, minStock: 5, lastUpdate: '2025-04-04', status: 'Disponible' },
    { id: 2, code: 'P002', name: 'Monitor Samsung', category: 'Electrónicos', stock: 15, minStock: 3, lastUpdate: '2025-04-05', status: 'Disponible' },
    { id: 3, code: 'P003', name: 'Teclado Mecánico', category: 'Periféricos', stock: 8, minStock: 10, lastUpdate: '2025-04-03', status: 'Bajo stock' },
    { id: 4, code: 'P004', name: 'Mouse Inalámbrico', category: 'Periféricos', stock: 32, minStock: 8, lastUpdate: '2025-04-02', status: 'Disponible' },
    { id: 5, code: 'P005', name: 'Disco SSD 1TB', category: 'Almacenamiento', stock: 4, minStock: 5, lastUpdate: '2025-04-01', status: 'Bajo stock' },
    { id: 6, code: 'P006', name: 'Auriculares Bluetooth', category: 'Audio', stock: 0, minStock: 3, lastUpdate: '2025-03-28', status: 'Agotado' },
  ]);

  // Datos para los gráficos
  const chartData = [
    { name: 'Ene', entradas: 65, salidas: 42 },
    { name: 'Feb', entradas: 59, salidas: 39 },
    { name: 'Mar', entradas: 80, salidas: 68 },
    { name: 'Abr', entradas: 51, salidas: 40 },
    { name: 'May', entradas: 86, salidas: 55 },
    { name: 'Jun', entradas: 55, salidas: 53 },
  ];

  // Estadísticas para las tarjetas
  const stats = [
    { title: 'Total Productos', value: '97', icon: Package, color: 'bg-primary' },
    { title: 'Entradas Hoy', value: '12', icon: TrendingUp, color: 'bg-success' },
    { title: 'Salidas Hoy', value: '8', icon: TrendingDown, color: 'bg-warning' },
    { title: 'Alertas', value: '5', icon: AlertTriangle, color: 'bg-danger' },
  ];

  // Datos para las últimas transacciones
  const recentTransactions = [
    { id: 1, product: 'Laptop HP', type: 'Entrada', quantity: 5, date: '2025-04-07', user: 'Carlos P.' },
    { id: 2, product: 'Monitor Samsung', type: 'Salida', quantity: 2, date: '2025-04-07', user: 'Laura M.' },
    { id: 3, product: 'Teclado Mecánico', type: 'Entrada', quantity: 10, date: '2025-04-06', user: 'Ana R.' },
    { id: 4, product: 'Auriculares Bluetooth', type: 'Salida', quantity: 3, date: '2025-04-05', user: 'Juan D.' },
  ];

  // Filtrar productos según término de búsqueda
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex h-100">
      {/* Sidebar */}
      <div className={`${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'} d-flex flex-column bg-dark text-white`}>
        <div className="p-3 d-flex align-items-center justify-content-between border-bottom border-secondary">
          {!collapsed && <h2 className="fs-4 fw-bold mb-0">Kardex</h2>}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="btn btn-dark p-1"
          >
            <Menu size={20} />
          </button>
        </div>
        <div className="d-flex flex-column flex-grow-1 overflow-auto">
          <nav className="mt-3 flex-grow-1">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`d-flex align-items-center px-3 py-2 w-100 border-0 text-start ${activeTab === 'dashboard' ? 'active-nav-item' : 'nav-item'}`}
            >
              <Package size={20} />
              {!collapsed && <span className="ms-3">Dashboard</span>}
            </button>
            <button 
              onClick={() => setActiveTab('inventory')} 
              className={`d-flex align-items-center px-3 py-2 w-100 border-0 text-start ${activeTab === 'inventory' ? 'active-nav-item' : 'nav-item'}`}
            >
              <Clipboard size={20} />
              {!collapsed && <span className="ms-3">Inventario</span>}
            </button>
            <button 
              onClick={() => setActiveTab('movements')} 
              className={`d-flex align-items-center px-3 py-2 w-100 border-0 text-start ${activeTab === 'movements' ? 'active-nav-item' : 'nav-item'}`}
            >
              <RefreshCw size={20} />
              {!collapsed && <span className="ms-3">Movimientos</span>}
            </button>
            <button 
              onClick={() => setActiveTab('reports')} 
              className={`d-flex align-items-center px-3 py-2 w-100 border-0 text-start ${activeTab === 'reports' ? 'active-nav-item' : 'nav-item'}`}
            >
              <FileText size={20} />
              {!collapsed && <span className="ms-3">Reportes</span>}
            </button>
            <button 
              onClick={() => setActiveTab('settings')} 
              className={`d-flex align-items-center px-3 py-2 w-100 border-0 text-start ${activeTab === 'settings' ? 'active-nav-item' : 'nav-item'}`}
            >
              <Settings size={20} />
              {!collapsed && <span className="ms-3">Configuración</span>}
            </button>
          </nav>
          <div className="mt-auto p-3 border-top border-secondary">
            <button className="d-flex align-items-center w-100 px-3 py-2 btn btn-dark">
              <LogOut size={20} />
              {!collapsed && <span className="ms-3">Cerrar sesión</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="d-flex align-items-center justify-content-between px-4 py-3">
            <div className="position-relative d-flex align-items-center" style={{width: "250px"}}>
              <input
                type="text"
                placeholder="Buscar..."
                className="form-control ps-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="position-absolute start-0 ms-2 text-muted" size={18} />
            </div>
            <div className="position-relative">
              <button 
                className="btn d-flex align-items-center" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" style={{width: "32px", height: "32px"}}>
                  <span>AP</span>
                </div>
                <div className="d-none d-md-block text-start ms-2">
                  <p className="mb-0 small fw-semibold">Admin Panel</p>
                  <p className="mb-0 small text-muted">Administrador</p>
                </div>
                <ChevronDown size={16} className="ms-2" />
              </button>

              {showDropdown && (
                <div className="position-absolute end-0 mt-2 dropdown-menu show">
                  <a href="#" className="dropdown-item">Perfil</a>
                  <a href="#" className="dropdown-item">Configuración</a>
                  <a href="#" className="dropdown-item">Cerrar sesión</a>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow-1 overflow-auto bg-light p-4">
          {activeTab === 'dashboard' && (
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h1 className="fs-4 fw-bold">Dashboard de Inventario</h1>
                <button 
                  className="btn btn-primary d-flex align-items-center"
                  onClick={() => setShowProductModal(true)}
                >
                  <Plus size={18} className="me-2" />
                  Nuevo Producto
                </button>
              </div>

              {/* Stats Cards */}
              <div className="row g-4 mb-4">
                {stats.map((stat, index) => (
                  <div key={index} className="col-md-6 col-lg-3">
                    <div className="card h-100">
                      <div className="card-body d-flex align-items-center">
                        <div className={`${stat.color} p-3 rounded me-3 text-white`}>
                          <stat.icon size={24} />
                        </div>
                        <div>
                          <p className="card-subtitle mb-1 text-muted">{stat.title}</p>
                          <h3 className="card-title mb-0 fw-bold">{stat.value}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-4">Movimientos de Inventario</h5>
                  <div style={{height: "320px"}}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="entradas" fill="#0d6efd" name="Entradas" />
                        <Bar dataKey="salidas" fill="#fd7e14" name="Salidas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Transactions and Low Stock Alert */}
              <div className="row g-4">
                {/* Recent Transactions */}
                <div className="col-lg-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title mb-4">Transacciones Recientes</h5>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Tipo</th>
                              <th>Cantidad</th>
                              <th>Fecha</th>
                              <th>Usuario</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentTransactions.map((tx) => (
                              <tr key={tx.id}>
                                <td>{tx.product}</td>
                                <td>
                                  <span className={`badge ${tx.type === 'Entrada' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                    {tx.type}
                                  </span>
                                </td>
                                <td>{tx.quantity}</td>
                                <td>{tx.date}</td>
                                <td>{tx.user}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Low Stock Alert */}
                <div className="col-lg-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title mb-4">Alertas de Stock</h5>
                      <div className="d-flex flex-column gap-3">
                        {products.filter(p => p.stock <= p.minStock).map((product) => (
                          <div key={product.id} className="d-flex align-items-center justify-content-between border-bottom pb-3">
                            <div className="d-flex align-items-center">
                              <div className={`p-2 rounded me-3 ${product.stock === 0 ? 'bg-danger bg-opacity-10' : 'bg-warning bg-opacity-10'}`}>
                                <AlertTriangle size={16} className={product.stock === 0 ? 'text-danger' : 'text-warning'} />
                              </div>
                              <div>
                                <p className="mb-0 fw-medium">{product.name}</p>
                                <p className="mb-0 small text-muted">Stock: {product.stock} | Mínimo: {product.minStock}</p>
                              </div>
                            </div>
                            <span className={`badge ${product.stock === 0 ? 'bg-danger' : 'bg-warning text-dark'}`}>
                              {product.stock === 0 ? 'Agotado' : 'Bajo stock'}
                            </span>
                          </div>
                        ))}
                        {products.filter(p => p.stock <= p.minStock).length === 0 && (
                          <div className="text-center py-4 text-muted">
                            No hay alertas de stock
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="mb-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h1 className="fs-4 fw-bold">Inventario de Productos</h1>
                <button 
                  className="btn btn-primary d-flex align-items-center"
                  onClick={() => setShowProductModal(true)}
                >
                  <Plus size={18} className="me-2" />
                  Nuevo Producto
                </button>
              </div>

              {/* Inventory Table */}
              <div className="card">
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Nombre</th>
                          <th>Categoría</th>
                          <th>Stock Actual</th>
                          <th>Stock Mínimo</th>
                          <th>Última Actualización</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => (
                          <tr key={product.id}>
                            <td className="fw-medium">{product.code}</td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.stock}</td>
                            <td>{product.minStock}</td>
                            <td>{product.lastUpdate}</td>
                            <td>
                              <span 
                                className={`badge ${
                                  product.status === 'Disponible' ? 'bg-success' :
                                  product.status === 'Bajo stock' ? 'bg-warning text-dark' :
                                  'bg-danger'
                                }`}
                              >
                                {product.status}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group">
                                <button className="btn btn-sm btn-outline-primary">
                                  <Edit size={16} />
                                </button>
                                <button className="btn btn-sm btn-outline-danger">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                          <tr>
                            <td colSpan="8" className="text-center text-muted py-4">
                              No se encontraron productos
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <div className="small text-muted">
                      Mostrando <span className="fw-medium">{filteredProducts.length}</span> de <span className="fw-medium">{products.length}</span> productos
                    </div>
                    <nav aria-label="Page navigation">
                      <ul className="pagination">
                        <li className="page-item"><a className="page-link" href="#">Anterior</a></li>
                        <li className="page-item"><a className="page-link" href="#">1</a></li>
                        <li className="page-item active"><a className="page-link" href="#">2</a></li>
                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                        <li className="page-item"><a className="page-link" href="#">Siguiente</a></li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'movements' && (
            <div className="text-center py-5">
              <h2 className="fs-4 fw-semibold text-secondary">Sección de Movimientos</h2>
              <p className="text-muted mt-2">Aquí podrás registrar entradas y salidas de productos.</p>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="text-center py-5">
              <h2 className="fs-4 fw-semibold text-secondary">Sección de Reportes</h2>
              <p className="text-muted mt-2">Aquí podrás generar reportes de inventario y movimientos.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="text-center py-5">
              <h2 className="fs-4 fw-semibold text-secondary">Sección de Configuración</h2>
              <p className="text-muted mt-2">Aquí podrás ajustar las preferencias del sistema.</p>
            </div>
          )}
        </main>
      </div>

      {/* Modal para añadir producto */}
      {showProductModal && (
        <div className="modal fade show" style={{display: 'block'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Añadir Nuevo Producto</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowProductModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="productCode" className="form-label">Código</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="productCode"
                    placeholder="P007"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">Nombre del Producto</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="productName"
                    placeholder="Nombre del producto"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="productCategory" className="form-label">Categoría</label>
                  <select className="form-select" id="productCategory">
                    <option>Electrónicos</option>
                    <option>Periféricos</option>
                    <option>Almacenamiento</option>
                    <option>Audio</option>
                    <option>Otra categoría</option>
                  </select>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label htmlFor="initialStock" className="form-label">Stock Inicial</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="initialStock"
                      placeholder="0"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="minStock" className="form-label">Stock Mínimo</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="minStock"
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowProductModal(false)}
                >
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary">
                  Guardar Producto
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}

      {/* CSS específico necesario */}
      <style jsx>{`
        html, body, #root {
          height: 100vh;
        }
        
        .sidebar-expanded {
          width: 240px;
          transition: width 0.3s;
        }
        
        .sidebar-collapsed {
          width: 70px;
          transition: width 0.3s;
        }
        
        .nav-item {
          color: #fff;
          background: transparent;
          transition: background-color 0.2s;
        }
        
        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .active-nav-item {
          color: #fff;
          background-color: #0d6efd;
          transition: background-color 0.2s;
        }
        
        .modal-backdrop {
          background-color: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}