import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Plus, Trash2, Edit, AlertTriangle, Package, TrendingUp, TrendingDown, RefreshCw, Clipboard, FileText, Settings, ChevronDown } from 'lucide-react';
import Sidebar from '../../../components/Sidebar/Sidebar';

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
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
      
      {/* Sidebar Component */}
      <Sidebar 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

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
              {/* Stats Cards */}
              <div className="row g-4 mb-4">
                {stats.map((stat, index) => (
                  <div key={index} className="col-md-6 col-lg-3">
                    <div className="card h-100">
                      <div className="card-body d-flex align-items-center">
                        <div className={`${stat.color} p-3 rounded me-3 text-white`}>
                          <stat.icon size={50} />
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
    </div>
  );
}