import React from 'react';
import '../../styles/common/loader.scss';

const PayerCardSkeleton = () => {
    return (
        <div className="payers-list d-flex flex-column gap-2 flex-grow-1">
            {Array.from({ length: 5 }).map((_, index) => (
                <div className="payer-card skeleton-card overflow-hidden mb-2" key={index}>
                    <div className="payer-header d-flex p-3 flex-column align-items-start border-0 pointer-events-none">

                        {/* Top Row: Identity & Desktop Actions */}
                        <div className="d-flex w-100 align-items-center justify-content-between gap-2">

                            {/* 1. Identity Block */}
                            <div className="col-identity d-flex align-items-center gap-2 gap-sm-3 flex-grow-1 overflow-hidden">
                                <div className="skeleton-box skeleton-avatar rounded-circle flex-shrink-0"></div>
                                <div className="payer-details d-flex justify-content-center flex-column gap-1 w-100">
                                    <div className="skeleton-box skeleton-text skeleton-name mb-1"></div>
                                    <div className="skeleton-box skeleton-text skeleton-contact"></div>
                                </div>
                            </div>

                            {/* 2. Stats Block (Desktop Only) */}
                            <div className="col-stats d-none d-sm-flex align-items-center gap-4">
                                <div className="stat-group d-flex flex-column align-items-start gap-1">
                                    <div className="skeleton-box skeleton-text skeleton-label"></div>
                                    <div className="skeleton-box skeleton-text skeleton-value"></div>
                                </div>
                                <div className="stat-badge d-flex justify-content-center">
                                    <div className="skeleton-box skeleton-badge"></div>
                                </div>
                            </div>

                            {/* 3. Actions Block */}
                            <div className="col-actions d-flex align-items-center gap-1 gap-sm-3 flex-shrink-0">
                                <div className="action-buttons d-flex gap-1">
                                    <div className="skeleton-box skeleton-btn"></div>
                                    <div className="skeleton-box skeleton-btn"></div>
                                </div>

                                <div className="divider d-none d-sm-block bg-transparent"></div>

                                <div className="skeleton-box skeleton-btn"></div>
                            </div>
                        </div>

                        {/* Bottom Row: Mobile Stats (Screens < 576px) */}
                        <div className="col-stats-mobile d-flex d-sm-none w-100 mt-3 pt-3 justify-content-between align-items-center border-top" style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}>
                            <div className="stat-group d-flex flex-column align-items-start gap-1">
                                <div className="skeleton-box skeleton-text skeleton-label"></div>
                                <div className="skeleton-box skeleton-text skeleton-value"></div>
                            </div>
                            <div className="stat-badge d-flex justify-content-center">
                                <div className="skeleton-box skeleton-badge"></div>
                            </div>
                        </div>

                    </div>
                </div>
            ))}
        </div>
    );
};

export default PayerCardSkeleton;