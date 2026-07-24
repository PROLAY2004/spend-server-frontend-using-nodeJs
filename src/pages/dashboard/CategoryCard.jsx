import { Bar } from 'react-chartjs-2';

export default function CategoryCard({
    dashboardData,
    barFilter,
    setBarFilter
}) {
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
    );
}