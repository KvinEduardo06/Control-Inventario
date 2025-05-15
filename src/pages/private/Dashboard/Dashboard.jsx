import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Plus, Trash2, Edit, AlertTriangle, Package, TrendingUp, TrendingDown, RefreshCw, Clipboard, FileText, Settings, ChevronDown } from 'lucide-react';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import "./Dashboard.css"


export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  //Cerrar Sesion 

  return (
    <div className="d-flex h-100">

      {/* Sidebar Component - Note: We're passing the collapsed state and its setter */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content - Added the main-content class with collapsed conditional */}
      <div className={`flex-grow-1 d-flex flex-column overflow-hidden main-content ${collapsed ? 'collapsed' : ''}`}>
        <Header />

        {/* Content */}
        <main className="flex-grow-1 overflow-auto bg-light p-4">
          {activeTab === 'dashboard' && (
            <div className="mb-4">
              {/* Aqui se mostrarian los componentes usando outlet */}
              <Outlet />
            </div>
          )}        
        </main>
      </div>
    </div>
  );
}