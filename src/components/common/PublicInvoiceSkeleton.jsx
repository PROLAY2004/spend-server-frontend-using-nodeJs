import React from 'react';
import '../../styles/common/loader.scss';

export default function PublicInvoiceSkeleton({ isLoading }) {
    if (!isLoading) return null;

    return (
        <main className="public-container my-5 mx-auto px-3 skeleton-card">

            {/* --- Section 1: Details Cards Grid --- */}
            <div className="info-grid mb-5">

                {/* Card 1: From & Billed To */}
                <div className="info-card p-3 rounded-3 d-flex flex-column gap-4">
                    <div className="d-flex flex-column gap-2">
                        <div className="skeleton-box skeleton-label"></div>
                        <div className="skeleton-box skeleton-text skeleton-h-16 skeleton-w-75"></div>
                    </div>
                    <div className="d-flex flex-column gap-2 pt-3 border-top border-white-5">
                        <div className="skeleton-box skeleton-label"></div>
                        <div className="skeleton-box skeleton-text skeleton-h-16 skeleton-w-50"></div>
                        <div className="skeleton-box skeleton-text skeleton-h-12 skeleton-w-25"></div>
                    </div>
                </div>

                {/* Card 2: Date Issued, Status & Invoice No */}
                <div className="info-card meta-card p-3 rounded-3 d-flex flex-column justify-content-between gap-4">
                    <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex flex-column gap-2">
                            <div className="skeleton-box skeleton-label"></div>
                            <div className="skeleton-box skeleton-text skeleton-h-16 skeleton-w-100" style={{ maxWidth: '100px' }}></div>
                        </div>
                        {/* Status Badge Skeleton */}
                        <div className="skeleton-box skeleton-badge"></div>
                    </div>

                    <div className="d-flex flex-column gap-2">
                        <div className="skeleton-box skeleton-label"></div>
                        <div className="skeleton-box skeleton-text skeleton-h-16 skeleton-w-100"></div>
                    </div>
                </div>

                {/* Card 3: Total & Due Amounts */}
                <div className="info-card p-3 rounded-3 d-flex flex-column justify-content-center gap-4">
                    <div className="d-flex flex-column gap-2 pb-3 border-bottom border-white-5">
                        <div className="skeleton-box skeleton-label"></div>
                        <div className="skeleton-box skeleton-text skeleton-h-24 skeleton-w-50"></div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                        <div className="skeleton-box skeleton-label"></div>
                        <div className="skeleton-box skeleton-text skeleton-h-24 skeleton-w-50"></div>
                    </div>
                </div>
            </div>

            {/* --- Section 2: Ledger Summary Table --- */}
            <div className="table-section mb-5">
                {/* Table Title Skeleton */}
                <div className="skeleton-box skeleton-text skeleton-h-20 skeleton-w-25 mb-3" style={{ maxWidth: '150px' }}></div>

                <div className="public-table-wrapper rounded-3 border overflow-hidden">
                    <table className="w-100 public-table m-0">
                        <thead>
                            <tr>
                                <th className="ps-4">Date</th>
                                <th>Category</th>
                                <th>Spend Amt</th>
                                <th>Due Amt</th>
                                <th className="pe-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Render 4 skeleton rows to fill the view */}
                            {[...Array(4)].map((_, i) => (
                                <tr key={i} className="skeleton-row">
                                    <td className="ps-4"><div className="skeleton-box skeleton-table-text skeleton-w-75"></div></td>
                                    <td><div className="skeleton-box skeleton-table-text skeleton-w-50"></div></td>
                                    <td><div className="skeleton-box skeleton-table-text skeleton-w-50"></div></td>
                                    <td><div className="skeleton-box skeleton-table-text skeleton-w-50"></div></td>
                                    <td className="pe-4"><div className="skeleton-box skeleton-table-text skeleton-w-50"></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </main>
    );
}