import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';

import DashboardLoader from '../../components/common/DashboardSkeleton.jsx';
import Sidebar from '../../components/common/Sidebar.jsx';
import Header from '../../components/common/Header.jsx';

import Cards from '../../components/dashboard/Cards.jsx';
import CategoryCard from './CategoryCard.jsx';
import ActivityCard from './ActivityCard.jsx';
import DoughnutCard from './DoughnutCharts.jsx';

import fetchDashboardOverview from './fetchData.js';
import handleBtnClick from './exportData.js';

import '../../styles/dashboard.scss';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);
ChartJS.defaults.color = '#888888';
ChartJS.defaults.font.family = "'Inter', system-ui, sans-serif";
ChartJS.defaults.font.size = 12;

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

        lineChart: { labels: [], data: [], originalData: [] },
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

    return (
        <div className="dashboard-wrapper d-flex h-100 overflow-hidden position-relative">
            <Sidebar isMobileOpen={isMobileOpen} sidebarRef={sidebarRef} />

            <main className="main-content d-flex flex-column h-100 flex-grow-1 overflow-auto overflow-x-hidden">
                <Header 
                    setIsMobileOpen={setIsMobileOpen} 
                    pageName={"Dashboard"} 
                    breadCrumb={"Overview"} 
                    btnIcon={
                        <>
                            <i className="bi bi-cloud-download"></i>
                            <span>Export</span>
                        </>
                    } 
                    btnFunc={() => handleBtnClick(navigate, toast)} 
                />

                <DashboardLoader isActive={!loading} />

                <div className={`dashboard-body w-100 my-0 mx-auto p-3 p-md-4 ${loading ? 'd-none' : ''}`}>
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
                        <DoughnutCard 
                            dashboardData={dashboardData}
                        />

                        <ActivityCard
                            dashboardData={dashboardData}
                            lineFilter={lineFilter}
                            setLineFilter={setLineFilter}
                        />

                        <CategoryCard
                            dashboardData={dashboardData}
                            barFilter={barFilter}
                            setBarFilter={setBarFilter}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}