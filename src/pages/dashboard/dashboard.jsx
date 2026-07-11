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

import Sidebar from '../../components/dashboard/sidebar.jsx';
import '../../styles/dashboard.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);
ChartJS.defaults.color = '#888888';
ChartJS.defaults.font.family = "'Inter', system-ui, sans-serif";
ChartJS.defaults.font.size = 12;

const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: function (chart) {
        if (chart.config.options.elements.center) {
            const ctx = chart.ctx;
            const centerConfig = chart.config.options.elements.center;

            ctx.save();
            const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.font = '700 24px Inter';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(centerConfig.value, centerX, centerY - 12);

            ctx.font = '500 12px Inter';
            ctx.fillStyle = '#888888';
            ctx.fillText(centerConfig.text, centerX, centerY + 16);
            ctx.restore();
        }
    }
};

export default function Dashboard() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [lineFilter, setLineFilter] = useState('thisWeek');
    const [barFilter, setBarFilter] = useState('thisMonth');
    const sidebarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileOpen]);

    // --- DUMMY DATA ---
    const doughnutOptions = {
        cutout: '78%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, padding: 25, boxWidth: 8 } },
            tooltip: { backgroundColor: 'rgba(10, 10, 10, 0.95)', titleColor: '#fff', bodyColor: '#ccc', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, padding: 12 }
        }
    };

    const doughnut1Data = { labels: ['Due Amount', 'Collected Amount'], datasets: [{ data: [12500, 34000], backgroundColor: ['#f43f5e', '#10b981'], borderWidth: 0, hoverOffset: 4 }] };
    const doughnut2Data = { labels: ['Paid Records', 'Non-paid Records'], datasets: [{ data: [142, 38], backgroundColor: ['#7c3aed', '#f59e0b'], borderWidth: 0, hoverOffset: 4 }] };

    const lineData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Spend', data: [120, 300, 150, 400, 200, 600, 250], borderColor: '#7c3aed', backgroundColor: 'rgba(124, 58, 237, 0.1)', borderWidth: 2, tension: 0.4, fill: true, pointBackgroundColor: '#111111', pointBorderColor: '#7c3aed', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6,
        }]
    };
    const lineOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false, backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } },
        scales: { x: { grid: { display: false, drawBorder: false } }, y: { grid: { color: 'rgba(255, 255, 255, 0.03)', drawBorder: false }, border: { dash: [4, 4] } } }
    };

    const barData = {
        labels: ['Healthcare', 'Food', 'Income', 'Travel', 'Fuel', 'Transfer', 'Shopping', 'Bills', 'Grocery', 'Entertainment', 'Investment', 'Others'],
        datasets: [{
            label: 'Amount spent', data: [400, 800, -200, 350, 200, 150, 600, 450, 500, 250, 1000, 100],
            backgroundColor: ['#ef4444', '#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#6366f1', '#ec4899', '#f59e0b', '#84cc16', '#06b6d4', '#a855f7', '#64748b'],
            borderRadius: 6, borderWidth: 0,
        }]
    };
    const barOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255, 255, 255, 0.03)' } } }
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar isMobileOpen={isMobileOpen} sidebarRef={sidebarRef}/>

            <main className="main-content">
                <header className="top-header">
                    <div className="header-left">
                        <button className="hamburger" onClick={() => setIsMobileOpen(true)}>
                            <i className="bi bi-list"></i>
                        </button>
                        <div className="header-title-group">
                            <h1>Dashboard</h1>
                            <div className="breadcrumbs">
                                Home <span>/</span> <span className="current">Overview</span>
                            </div>
                        </div>
                    </div>
                    <div className="header-right">
                        <button className="export-btn">
                            <i className="bi bi-cloud-download"></i>
                            Export Data
                        </button>
                    </div>
                </header>

                <div className="dashboard-body">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-header">
                                <h4>Total Savings</h4>
                                <div className="icon-wrapper"><i className="bi bi-piggy-bank"></i></div>
                            </div>
                            <div className="stat-body">
                                <div className="stat-value">₹45,230</div>
                                <div className="stat-trend positive">
                                    <i className="bi bi-arrow-up-short"></i> 12%
                                </div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <h4>Unpaid Categories</h4>
                                <div className="icon-wrapper"><i className="bi bi-exclamation-circle"></i></div>
                            </div>
                            <div className="stat-body">
                                <div className="stat-value">4</div>
                                <div className="stat-trend neutral">
                                    <i className="bi bi-dash"></i> 0%
                                </div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <h4>Total Due Amount</h4>
                                <div className="icon-wrapper"><i className="bi bi-wallet2"></i></div>
                            </div>
                            <div className="stat-body">
                                <div className="stat-value">₹12,500</div>
                                <div className="stat-trend negative">
                                    <i className="bi bi-arrow-down-short"></i> 4%
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="charts-grid">
                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>Amount Overview</h3>
                            </div>
                            <div className="chart-container">
                                <Doughnut data={doughnut1Data} options={{ ...doughnutOptions, elements: { center: { text: 'Total Spend', value: '₹46,500' } } }} plugins={[centerTextPlugin]} />
                            </div>
                        </div>

                        <div className="chart-card">
                            <div className="chart-header">
                                <h3>Records Overview</h3>
                            </div>
                            <div className="chart-container">
                                <Doughnut data={doughnut2Data} options={{ ...doughnutOptions, elements: { center: { text: 'Total Records', value: '180' } } }} plugins={[centerTextPlugin]} />
                            </div>
                        </div>

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