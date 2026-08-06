import '../../styles/common/cards.scss';

function Cards({ cardNumber, cardTitle, value, trend = 0, isCurrency = true, inverseTrend = false }) {

    let trendClass = 'neutral';
    let trendIcon = 'bi-dash';

    if (trend > 0) {
        trendClass = inverseTrend ? 'negative' : 'positive';
        trendIcon = inverseTrend ? 'bi-arrow-down-short' :'bi-arrow-up-short';
    } else if (trend < 0) {
        trendClass = inverseTrend ? 'positive' : 'negative';
        trendIcon = inverseTrend ?  'bi-arrow-up-short' : 'bi-arrow-down-short';
    }

    return (
        <div className="stat-card d-flex flex-column position-relative overflow-hidden">
            <div className="stat-header d-flex justify-content-between align-items-start mb-3 position-relative z-1">
                <h4 className='fw-medium'>{cardTitle}</h4>
                <div className="icon-wrapper d-flex align-items-center justify-content-center">
                    {cardNumber === 1 ? (
                        <i className="bi bi-currency-rupee"></i>
                    ) : cardNumber === 2 ? (
                        <i className="bi bi-exclamation-circle"></i>
                    ) : (
                        <i className="bi bi-wallet2"></i>
                    )}
                </div>
            </div>

            <div className="stat-body position-relative d-flex align-items-end justify-content-between z-1">
                <div className="stat-value lh-1 fw-bold fs-2">
                    {isCurrency ? `₹${Number(value).toFixed(2)}` : value}
                </div>

                <div className={`stat-trend d-flex align-items-center fw-medium gap-1 py-1 px-2 rounded-pill ${trendClass}`}>
                    <i className={`bi ${trendIcon}`}></i> {Math.abs(trend).toFixed(2)}%
                </div>
            </div>
        </div>
    );
}

export default Cards;