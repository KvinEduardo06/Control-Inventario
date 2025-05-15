import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './InventoryOverview.css';
import { Search, Bell, ArrowUp, ArrowDown, Box, ShoppingBag, DollarSign, Activity, CreditCard, Tag } from 'lucide-react';

const InventoryOverview = () => {
    return (
        <div className="inventory-dashboard container-fluid py-4">
            <div className="row mb-4">
                <div className="col-md-8">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="dashboard-title">Business Dashboard</h4>
                        <div className="d-flex">
                            <button className="btn btn-light rounded-circle me-2">
                                <Search size={18} />
                            </button>
                            <button className="btn btn-light rounded-circle">
                                <Bell size={18} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <h5 className="text-dark">Summary</h5>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                    {/* Top Cards */}
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="card metric-card bg-primary text-white">
                                <div className="card-body">
                                    <h6>CUSTOMERS</h6>
                                    <h3>12,456</h3>
                                    <ShoppingBag size={24} className="card-icon" />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card metric-card bg-info text-white">
                                <div className="card-body">
                                    <h6>INCOME</h6>
                                    <h3>$182,632</h3>
                                    <DollarSign size={24} className="card-icon" />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card metric-card bg-purple text-white">
                                <div className="card-body">
                                    <h6>PRODUCTS SOLD</h6>
                                    <h3>5,390</h3>
                                    <Box size={24} className="card-icon" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Marketplace Section */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5>Marketplace</h5>

                            <div className="row align-items-center mt-4">
                                <div className="col-md-6">
                                    <div className="data-analytics-card">
                                        <h5>Data Analytics Overview</h5>
                                        <p className="text-muted">Track your account growth and optimize your earnings</p>
                                        <button className="btn btn-primary mt-2">START</button>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="upgrade-card text-center p-3">
                                        <h6 className="text-end mb-4">UPGRADE TO PRO</h6>
                                        <div className="red-bag-icon mx-auto mb-3">
                                            <ShoppingBag size={32} color="#fff" />
                                        </div>
                                        <h5>$29/m</h5>
                                        <p className="small">100% insurance for your goods</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Finance Flow Section */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5>Finance Flow</h5>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <h3>$2,530</h3>
                            </div>
                            <p className="text-muted">September 2021</p>
                            <div className="finance-chart">
                                <div className="chart-bars">
                                    <div className="bar" style={{ height: '60%' }}></div>
                                    <div className="bar" style={{ height: '40%' }}></div>
                                    <div className="bar" style={{ height: '80%' }}></div>
                                    <div className="bar" style={{ height: '50%' }}></div>
                                    <div className="bar" style={{ height: '70%' }}></div>
                                    <div className="bar" style={{ height: '60%' }}></div>
                                    <div className="bar" style={{ height: '90%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5>Recent Orders</h5>
                                <span className="text-primary small">SEE ALL</span>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Product</th>
                                            <th>Date</th>
                                            <th>Price</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>#125345</td>
                                            <td>DJI Mavic Pro 2</td>
                                            <td>Sep 14, 2021</td>
                                            <td>$942.00</td>
                                            <td><span className="badge bg-success">Delivered</span></td>
                                        </tr>
                                        <tr>
                                            <td>#122346</td>
                                            <td>iPad Pro 2021 Model</td>
                                            <td>Sep 11, 2021</td>
                                            <td>$932.00</td>
                                            <td><span className="badge bg-danger">Canceled</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    {/* Summary Section */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <p className="text-muted mb-0">Your Balance</p>
                                <button className="btn btn-danger btn-sm rounded-circle">
                                    <ArrowUp size={14} />
                                </button>
                            </div>
                            <h2>$10 632.00</h2>
                            <div className="d-flex align-items-center mt-2">
                                <ArrowUp size={14} className="text-success me-1" />
                                <span className="text-success">$1,200.00</span>
                                <span className="text-muted ms-2">today</span>
                            </div>
                        </div>
                    </div>

                    {/* Activity */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5>Activity</h5>
                                <span className="text-primary small">SEE ALL</span>
                            </div>
                            <div className="activity-item d-flex align-items-center mb-3">
                                <div className="activity-icon bg-primary text-white me-3">
                                    <ArrowUp size={18} />
                                </div>
                                <div className="flex-grow-1">
                                    <p className="mb-0">Withdraw Earning</p>
                                </div>
                                <div className="activity-amount text-success">
                                    $4,120
                                </div>
                            </div>
                            <div className="activity-item d-flex align-items-center">
                                <div className="activity-icon bg-info text-white me-3">
                                    <CreditCard size={18} />
                                </div>
                                <div className="flex-grow-1">
                                    <p className="mb-0">Paying Website tax</p>
                                </div>
                                <div className="activity-amount text-danger">
                                    - $230
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Categories */}
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5>Top Categories</h5>
                            </div>
                            <p className="text-muted small mb-4">Explore your top categories and keep checking daily outlook</p>
                            <div className="row">
                                <div className="col-6">
                                    <div className="category-box bg-warning-light text-center p-3 mb-3">
                                        <Tag size={24} className="mb-2" />
                                        <h6>Footwear</h6>
                                        <p className="small text-muted mb-0">$12,320</p>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="category-box bg-info-light text-center p-3 mb-3">
                                        <ShoppingBag size={24} className="mb-2" />
                                        <h6>Accessories</h6>
                                        <p className="small text-muted mb-0">$8,450</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InventoryOverview;