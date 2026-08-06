import { Line } from 'react-chartjs-2';

export default function ActivityCard({
    dashboardData,
    lineFilter,
    setLineFilter
}) {
    const lineData = {
        labels: dashboardData.lineChart.labels,
        datasets: [
            {
                label: 'Spend',
                data: dashboardData.lineChart.data,
                borderColor: '#7c3aed',
                backgroundColor: 'rgba(124, 58, 237, 0.1)',
                borderWidth: 2, tension: 0.4, fill: true,
                pointBackgroundColor: '#111111', pointBorderColor: '#7c3aed',
                pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6
            },
            {
                label: 'Original Amount',
                data: dashboardData.lineChart.originalData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2, tension: 0.4, fill: true,
                pointBackgroundColor: '#111111', pointBorderColor: '#10b981',
                pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6
            }
        ]
    };

    const lineOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            // CHANGED display to true
            legend: { display: true, position: 'top', labels: { color: '#888888', usePointStyle: true, boxWidth: 8 } },
            tooltip: { mode: 'index', intersect: false, backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }
        },
        scales: { x: { grid: { display: false, drawBorder: false } }, y: { grid: { color: 'rgba(255, 255, 255, 0.03)', drawBorder: false }, border: { dash: [4, 4] } } }
    };

    return (
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
    );
}