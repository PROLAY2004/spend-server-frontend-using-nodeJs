import { Doughnut } from 'react-chartjs-2';

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

export default function DoughnutCard({
    dashboardData,
}) {
    const doughnut1Data = { 
        labels: [
            'Due Amount', 
            'Collected Amount'
        ], 
        datasets: [
            { 
                data: dashboardData.doughnut1, 
                backgroundColor: ['#f43f5e', '#10b981'], 
                borderWidth: 0, 
                hoverOffset: 4 
            }
        ] 
    };
    const doughnut2Data = { 
        labels: [
            'Paid Records', 
            'Non-paid Records'
        ], 
        datasets: [
            { 
                data: dashboardData.doughnut2, 
                backgroundColor: ['#7c3aed', '#f59e0b'], 
                borderWidth: 0, 
                hoverOffset: 4 
            }
        ] 
    };

    const doughnutOptions = {
        cutout: '78%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { usePointStyle: true, padding: 25, boxWidth: 8 } },
            tooltip: { backgroundColor: 'rgba(10, 10, 10, 0.95)', titleColor: '#fff', bodyColor: '#ccc', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, padding: 12 }
        }
    };

    return (<>
        <div className="chart-card p-4 d-flex flex-column">
            <div className="chart-header d-flex justify-content-between align-items-center mb-4 pb-3">
                <h3 className="fw-semibold">Amount Overview</h3>
            </div>
            <div className="chart-container">
                <Doughnut 
                    data={doughnut1Data}
                    options={
                        { ...doughnutOptions, 
                            elements: { 
                                center: { 
                                    text: 'Total Handled', 
                                    value: `₹${dashboardData.doughnutTotalSpend.toLocaleString()}` 
                                } 
                            } 
                        }
                    } 
                plugins={[centerTextPlugin]}
            />
            </div>
        </div>

        <div className="chart-card p-4 d-flex flex-column">
            <div className="chart-header d-flex justify-content-between align-items-center mb-4 pb-3">
                <h3 className="fw-semibold">Records Overview</h3>
            </div>
            <div className="chart-container">
                <Doughnut 
                    data={doughnut2Data} 
                    options={
                        { ...doughnutOptions, 
                            elements: { 
                                center: { 
                                    text: 'Total Records', 
                                    value: dashboardData.doughnutTotalRecords
                                } 
                            } 
                        }
                    } 
                    plugins={[centerTextPlugin]} 
                />
            </div>
        </div>
    </>
    );
}