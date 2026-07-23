import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

import Sidebar from '../../components/common/Sidebar.jsx';
import Header from '../../components/common/Header.jsx';
import Cards from '../../components/dashboard/Cards.jsx';
import fetchDashboardOverview from './fetchData.js';

import '../../styles/dashboard.scss';
import handleBtnClick from './exportData.js';

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
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const sidebarRef = useRef(null);

    const [lineFilter, setLineFilter] = useState('thisWeek');
    const [barFilter, setBarFilter] = useState('thisMonth');

    const [dashboardData, setDashboardData] = useState({
        cards: {
            totalSavings: 0, savingsTrend: 0,
            unpaidCategories: 0, categoriesTrend: 0,
            totalDue: 0, dueTrend: 0
        },
        doughnut1: [0, 0],
        doughnut2: [0, 0],
        doughnutTotalSpend: 0,
        doughnutTotalRecords: 0,
        // Line chart now expects an object to handle dynamic X-axis labels
        lineChart: { labels: [], data: [] },
        barChart: { labels: [], data: [] }
    });

    const loadDashboardData = async () => {
        setLoading(true);
        const payload = { lineFilter, barFilter };
        const data = await fetchDashboardOverview(navigate, toast, payload);

        if (data) {
            setDashboardData(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lineFilter, barFilter]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const handleClickOutside = (event) => {
            if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileOpen]);

    const doughnutOptions = {
        cutout: '78%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, padding: 25, boxWidth: 8 } },
            tooltip: { backgroundColor: 'rgba(10, 10, 10, 0.95)', titleColor: '#fff', bodyColor: '#ccc', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, padding: 12 }
        }
    };

    const doughnut1Data = { labels: ['Due Amount', 'Collected Amount'], datasets: [{ data: dashboardData.doughnut1, backgroundColor: ['#f43f5e', '#10b981'], borderWidth: 0, hoverOffset: 4 }] };
    const doughnut2Data = { labels: ['Paid Records', 'Non-paid Records'], datasets: [{ data: dashboardData.doughnut2, backgroundColor: ['#7c3aed', '#f59e0b'], borderWidth: 0, hoverOffset: 4 }] };

    const lineData = {
        labels: dashboardData.lineChart.labels,
        datasets: [{ label: 'Spend', data: dashboardData.lineChart.data, borderColor: '#7c3aed', backgroundColor: 'rgba(124, 58, 237, 0.1)', borderWidth: 2, tension: 0.4, fill: true, pointBackgroundColor: '#111111', pointBorderColor: '#7c3aed', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6 }]
    };
    const lineOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false, backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } },
        scales: { x: { grid: { display: false, drawBorder: false } }, y: { grid: { color: 'rgba(255, 255, 255, 0.03)', drawBorder: false }, border: { dash: [4, 4] } } }
    };

    const barData = {
        labels: dashboardData.barChart.labels,
        datasets: [{ label: 'Amount spent', data: dashboardData.barChart.data, backgroundColor: ['#ef4444', '#f97316', '#10b981', '#3b82f6', '#8b5cf6', '#6366f1', '#ec4899', '#f59e0b', '#84cc16', '#06b6d4', '#a855f7', '#64748b'], borderRadius: 6, borderWidth: 0 }]
    };
    const barOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 } },
        scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(255, 255, 255, 0.03)' } } }
    };

    return (
        <div className="dashboard-wrapper d-flex h-100 overflow-hidden position-relative">
            <Sidebar isMobileOpen={isMobileOpen} sidebarRef={sidebarRef} />

            <main className="main-content d-flex flex-column h-100 flex-grow-1 overflow-auto overflow-x-hidden">
                <Header setIsMobileOpen={setIsMobileOpen} pageName={"Dashboard"} breadCrumb={"Overview"} btnIcon={<><i className="bi bi-cloud-download"></i><span>Export</span></>} btnFunc={() => handleBtnClick(navigate, toast)} />

                <div className={`dashboard-body w-100 my-0 mx-auto p-3 p-md-4 `}>
                    <div className="stats-grid d-grid gap-3 mb-4">
                        <Cards
                            cardNumber={1}
                            cardTitle={'Total Savings'}
                            value={dashboardData.cards.totalSavings}
                            trend={dashboardData.cards.savingsTrend}
                        />
                        <Cards
                            cardNumber={2}
                            cardTitle={'Unpaid Records'}
                            value={dashboardData.cards.unpaidCategories}
                            trend={dashboardData.cards.categoriesTrend}
                            isCurrency={false}
                            inverseTrend={true} // High unpaid records turns the UI badge Red
                        />
                        <Cards
                            cardNumber={3}
                            cardTitle={'Total Due Amount'}
                            value={dashboardData.cards.totalDue}
                            trend={dashboardData.cards.dueTrend}
                            inverseTrend={true} // High due amount turns the UI badge Red
                        />
                    </div>

                    <div className="charts-grid d-grid gap-3 mb-4">
                        <div className="chart-card p-4 d-flex flex-column">
                            <div className="chart-header d-flex justify-content-between align-items-center mb-4 pb-3">
                                <h3 className="fw-semibold">Amount Overview</h3>
                            </div>
                            <div className="chart-container">
                                <Doughnut data={doughnut1Data} options={{ ...doughnutOptions, elements: { center: { text: 'Total Handled', value: `₹${dashboardData.doughnutTotalSpend.toLocaleString()}` } } }} plugins={[centerTextPlugin]} />
                            </div>
                        </div>

                        <div className="chart-card p-4 d-flex flex-column">
                            <div className="chart-header d-flex justify-content-between align-items-center mb-4 pb-3">
                                <h3 className="fw-semibold">Records Overview</h3>
                            </div>
                            <div className="chart-container">
                                <Doughnut data={doughnut2Data} options={{ ...doughnutOptions, elements: { center: { text: 'Total Records', value: dashboardData.doughnutTotalRecords } } }} plugins={[centerTextPlugin]} />
                            </div>
                        </div>

                        <div className="chart-card p-4 d-flex flex-column full-width">
                            <div className="chart-header d-flex justify-content-between align-items-center mb-4 pb-3">
                                <h3 className="fw-semibold">Spend Activity</h3>
                                <select className='py-2 px-3' value={lineFilter} onChange={(e) => setLineFilter(e.target.value)}>
                                    <option value="today">Today</option>
                                    <option value="thisWeek">This Week</option>
                                    <option value="thisMonth">This Month</option>
                                    <option value="thisYear">This Year</option>
                                </select>
                            </div>
                            <div className="chart-container position-relative d-flex justify-content-center align-items-center w-100 tall">
                                <Line data={lineData} options={lineOptions} />
                            </div>
                        </div>

                        <div className="chart-card p-4 d-flex flex-column full-width">
                            <div className="chart-header d-flex justify-content-between align-items-center mb-4 pb-3">
                                <h3 className="fw-semibold">Spend by Category</h3>
                                <select className='py-2 px-3' value={barFilter} onChange={(e) => setBarFilter(e.target.value)}>
                                    <option value="today">Today</option>
                                    <option value="thisWeek">This Week</option>
                                    <option value="thisMonth">This Month</option>
                                    <option value="thisYear">This Year</option>
                                    <option value="lifetime">Lifetime</option>
                                </select>
                            </div>
                            <div className="chart-container  position-relative d-flex justify-content-center align-items-center w-100 tall">
                                <Bar data={barData} options={barOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}