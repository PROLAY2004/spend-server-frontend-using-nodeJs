import React from "react";
import formatDate from '../../utils/dateFormater.js';

export default function DetailsCard({ invoiceDetails, userDetails, amountDetails }) {
    if (!invoiceDetails || !userDetails) return null;

    return (
        <div className="info-grid mb-5">
            {/* Card 1: Entities */}
            <div className="info-card p-3 rounded-3 d-flex flex-column gap-2">
                <div className="d-flex flex-column">
                    <span className="info-label text-uppercase fw-bold">From</span>
                    <span className="text-white mb-1 fs-sm text-truncate" title={userDetails.email}>
                        {userDetails.email}
                    </span>
                </div>

                <div className="d-flex flex-column mt-2 pt-2 border-top border-white-5">
                    <span className="info-label text-uppercase fw-bold">Billed To</span>
                    <span className="text-white fs-sm text-uppercase">{invoiceDetails.payerName}</span>
                    <span className="icon-text fs-xs">+91 {invoiceDetails.payerMobile}</span>
                </div>
            </div>

            {/* Card 2: Invoice Meta */}
            <div className="info-card meta-card p-3 rounded-3 d-flex flex-column justify-content-between gap-2">
                <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex flex-column gap-1">
                        <span className="info-label text-uppercase fw-bold">Date Issued</span>
                        <span className="fs-sm text-white">{formatDate(invoiceDetails.createdAt)}</span>
                    </div>

                    <span className={`public-badge text-uppercase status-${invoiceDetails.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {invoiceDetails.status}
                    </span>
                </div>

                <div className="d-flex flex-column gap-1">
                    <span className="info-label text-uppercase fw-bold">Invoice No.</span>
                    <span className="text-white text-truncate tracking-tight" style={{ maxWidth: '218px' }} title={invoiceDetails.invoiceName}>
                        #{invoiceDetails.invoiceName}
                    </span>
                </div>
            </div>

            {/* Card 3: Amounts */}
            <div className="info-card p-3 rounded-3 d-flex flex-column gap-2">
                <div className="d-flex flex-column pb-2 border-bottom border-white-5">
                    <span className="info-label text-uppercase">TOTAL AMT.</span>
                    <span className="text-white mb-1 fs-5 fw-bold">₹{amountDetails.totalAmount?.toFixed(2)}</span>
                </div>

                <div className="d-flex flex-column pt-1">
                    <span className="info-label text-uppercase text-danger">DUE AMT.</span>
                    <span className="text-danger fw-bold fs-3 tracking-tight">₹{amountDetails.dueAmount?.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}