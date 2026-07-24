import '../../styles/common/loader.scss';

export default function DashboardLoader({isActive}) {
    return (
        <div className={`dashboard-body w-100 my-0 mx-auto p-3 p-md-4 ${isActive ? 'd-none' : ''}`}>
            {/* STATS GRID LOADER */}
            <div className="stats-grid d-grid gap-3 mb-4">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="stat-card skeleton-card d-flex flex-column position-relative overflow-hidden">
                        <div className="stat-header d-flex justify-content-between align-items-start mb-3 position-relative z-1">
                            {/* Card Title Skeleton */}
                            <div className="skeleton-box skeleton-text" style={{ width: '130px', height: '19px' }}></div>
                            {/* Card Icon Wrapper Skeleton */}
                            <div className="skeleton-box skeleton-avatar" style={{ borderRadius: '12px' }}></div>
                        </div>

                        <div className="stat-body position-relative d-flex align-items-end justify-content-between z-1">
                            {/* Card Value Skeleton (Matching fs-2 lh-1) */}
                            <div className="skeleton-box skeleton-text" style={{ width: '160px', height: '32px' }}></div>
                            {/* Card Trend Badge Skeleton */}
                            <div className="skeleton-box skeleton-badge" style={{ width: '70px', height: '28px', borderRadius: '50rem' }}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CHARTS GRID LOADER */}
            <div className="charts-grid d-grid gap-3 mb-4">

                {/* Doughnut Chart 1 Skeleton */}
                <div className="chart-card skeleton-card p-4 d-flex flex-column">
                    <div className="chart-header d-flex justify-content-between align-items-center mb-4 pb-3">
                        <div className="skeleton-box skeleton-text" style={{ width: '160px', height: '20px' }}></div>
                    </div>
                    <div className="chart-container d-flex justify-content-center align-items-center">
                        <div className="skeleton-box" style={{ width: '220px', height: '220px', borderRadius: '50%' }}></div>
                    </div>
                </div>

                {/* Doughnut Chart 2 Skeleton */}
                <div className="chart-card skeleton-card p-4 d-flex flex-column">
                    <div className="chart-header d-flex justify-content-between align-items-center mb-4 pb-3">
                        <div className="skeleton-box skeleton-text" style={{ width: '160px', height: '20px' }}></div>
                    </div>
                    <div className="chart-container d-flex justify-content-center align-items-center">
                        <div className="skeleton-box" style={{ width: '220px', height: '220px', borderRadius: '50%' }}></div>
                    </div>
                </div>

                {/* Full Width Line Chart Skeleton */}
                <div className="chart-card skeleton-card p-4 d-flex flex-column full-width">
                    <div className="chart-header d-flex justify-content-between align-items-center mb-4 pb-3">
                        <div className="skeleton-box skeleton-text" style={{ width: '150px', height: '20px' }}></div>
                        {/* Select Dropdown Skeleton */}
                        <div className="skeleton-box" style={{ width: '100px', height: '38px', borderRadius: '6px' }}></div>
                    </div>
                    <div className="chart-container position-relative d-flex justify-content-center align-items-center w-100 tall">
                        <div className="skeleton-box w-100 h-100" style={{ borderRadius: '8px' }}></div>
                    </div>
                </div>

                {/* Full Width Bar Chart Skeleton */}
                <div className="chart-card skeleton-card p-4 d-flex flex-column full-width">
                    <div className="chart-header d-flex justify-content-between align-items-center mb-4 pb-3">
                        <div className="skeleton-box skeleton-text" style={{ width: '170px', height: '20px' }}></div>
                        {/* Select Dropdown Skeleton */}
                        <div className="skeleton-box" style={{ width: '100px', height: '38px', borderRadius: '6px' }}></div>
                    </div>
                    <div className="chart-container position-relative d-flex justify-content-center align-items-center w-100 tall">
                        <div className="skeleton-box w-100 h-100" style={{ borderRadius: '8px' }}></div>
                    </div>
                </div>

            </div>
        </div>
    );
}