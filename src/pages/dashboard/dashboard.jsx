import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import './dashboard.scss';

// Register ChartJS Components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Global Chart Defaults for Minimalist Dark Theme
ChartJS.defaults.color = '#888888';
ChartJS.defaults.font.family = "'Inter', system-ui, sans-serif";
ChartJS.defaults.font.size = 12;

// Custom Plugin for Center Text in Doughnut Charts
const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
            const ctx = chart.ctx;
            const centerConfig = chart.config.options.elements.center;
            const text = centerConfig.text;
            const value = centerConfig.value;

            ctx.save();
            const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Draw Value
            ctx.font = '600 20px Inter';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(value, centerX, centerY - 10);

            // Draw Label
            ctx.font = '400 12px Inter';
            ctx.fillStyle = '#888888';
            ctx.fillText(text, centerX, centerY + 15);
            ctx.restore();
        }
    }
};

export default function Dashboard() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [lineFilter, setLineFilter] = useState('thisWeek');
    const [barFilter, setBarFilter] = useState('thisMonth');
    const sidebarRef = useRef(null);

    // Close sidebar on outside click (Mobile)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileOpen]);

    // --- DUMMY DATA SETUPS ---

    const doughnutOptions = {
        cutout: '75%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } },
            tooltip: {
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                titleColor: '#fff',
                bodyColor: '#ccc',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 10,
            }
        }
    };

    const doughnut1Data = {
        labels: ['Due Amount', 'Collected Amount'],
        datasets: [{
            data: [12500, 34000],
            backgroundColor: ['#f43f5e', '#10b981'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const doughnut2Data = {
        labels: ['Paid Records', 'Non-paid Records'],
        datasets: [{
            data: [142, 38],
            backgroundColor: ['#7c3aed', '#f59e0b'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    };

    const lineData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Spend',
            data: [120, 300, 150, 400, 200, 600, 250],
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#111111',
            pointBorderColor: '#7c3aed',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
        }]
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
            }
        },
        scales: {
            x: { grid: { display: false, drawBorder: false } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false }, border: { dash: [4, 4] } }
        }
    };

    const barData = {
        labels: ['Healthcare', 'Food', 'Income', 'Travel', 'Fuel', 'Transfer', 'Shopping', 'Bills', 'Grocery', 'Entertainment', 'Investment', 'Others'],
        datasets: [{
            label: 'Amount spent',
            data: [400, 800, -200, 350, 200, 150, 600, 450, 500, 250, 1000, 100],
            backgroundColor: [
                '#ef4444', '#f97316', '#10b981', '#3b82f6', '#8b5cf6',
                '#6366f1', '#ec4899', '#f59e0b', '#84cc16', '#06b6d4',
                '#a855f7', '#64748b'
            ],
            borderRadius: 4,
            borderWidth: 0,
        }]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
            }
        },
        scales: {
            x: { grid: { display: false } },
            y: { grid: { color: 'rgba(255, 255, 255, 0.05)' } }
        }
    };

    return (
        <div className="dashboard-wrapper">
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`}
                onClick={() => setIsMobileOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`} ref={sidebarRef}>
                <div className="sidebar-header">
                    <span className="logo-text">Spend Server</span>
                </div>
                <nav className="nav-links">
                    <Link to="/dashboard" className="active">
                        <i className="bi bi-grid"></i>
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/ledger">
                        <i className="bi bi-journal-text"></i>
                        <span>Ledger</span>
                    </Link>
                    <Link to="/invoices">
                        <i className="bi bi-receipt"></i>
                        <span>Invoices</span>
                    </Link>
                    <Link to="/settings" className="mt-auto">
                        <i className="bi bi-gear"></i>
                        <span>Settings</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Top Header */}
                <header className="top-header">
                    <div className="header-left">
                        <button className="hamburger" onClick={() => setIsMobileOpen(true)}>
                            <i className="bi bi-list"></i>
                        </button>
                        <div className="breadcrumbs">
                            Home <span>/</span> <span className="current">Dashboard</span>
                        </div>
                    </div>
                    <div className="user-profile">U</div>
                </header>

                <div className="dashboard-body">
                    <h1 className="page-title">Overview</h1>

                    {/* Analytics Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-header">
                                <h4>Total Savings</h4>
                                <i className="bi bi-piggy-bank"></i>
                            </div>
                            <div className="stat-value">₹45,230</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <h4>Unpaid Categories</h4>
                                <i className="bi bi-exclamation-circle"></i>
                            </div>
                            <div className="stat-value">4</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <h4>Total Due Amount</h4>
                                <i className="bi bi-wallet2"></i>
                            </div>
                            <div className="stat-value">₹12,500</div>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="charts-grid">
                        {/* Doughnut 1 */}
                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>Amount Overview</h3>
                            </div>
                            <div className="chart-container">
                                <Doughnut
                                    data={doughnut1Data}
                                    options={{
                                        ...doughnutOptions,
                                        elements: { center: { text: 'Total Spend', value: '₹46,500' } }
                                    }}
                                    plugins={[centerTextPlugin]}
                                />
                            </div>
                        </div>

                        {/* Doughnut 2 */}
                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>Records Overview</h3>
                            </div>
                            <div className="chart-container">
                                <Doughnut
                                    data={doughnut2Data}
                                    options={{
                                        ...doughnutOptions,
                                        elements: { center: { text: 'Total Records', value: '180' } }
                                    }}
                                    plugins={[centerTextPlugin]}
                                />
                            </div>
                        </div>

                        {/* Line Chart */}
                        <div className="chart-card full-width">
                            <div className="chart-header">
                                <h3>Spend Activity</h3>
                                <select value={lineFilter} onChange={(e) => setLineFilter(e.target.value)}>
                                    <option value="thisWeek">This Week</option>
                                    <option value="thisMonth">This Month</option>
                                    <option value="thisYear">This Year</option>
                                </select>
                            </div>
                            <div className="chart-container tall">
                                <Line data={lineData} options={lineOptions} />
                            </div>
                        </div>

                        {/* Bar Chart */}
                        <div className="chart-card full-width">
                            <div className="chart-header">
                                <h3>Spend by Category</h3>
                                <select value={barFilter} onChange={(e) => setBarFilter(e.target.value)}>
                                    <option value="today">Today</option>
                                    <option value="thisWeek">This Week</option>
                                    <option value="thisMonth">This Month</option>
                                    <option value="thisYear">This Year</option>
                                    <option value="lifetime">Lifetime</option>
                                </select>
                            </div>
                            <div className="chart-container tall">
                                <Bar data={barData} options={barOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}