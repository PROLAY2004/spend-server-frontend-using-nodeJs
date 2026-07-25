import React, { useState } from 'react';
import { toast } from 'react-toastify';
import formatDate from '../../utils/dateFormater.js';
import '../../styles/common/modal.scss';

const ViewInvoiceModal = ({ isOpen, onClose, invoiceData={}, records = [] }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    if (!isOpen ) return null;

    const handleDownload = () => {
        setIsDownloading(true);
        // Placeholder for actual PDF generation/download logic
        setTimeout(() => {
            toast.success('Invoice downloaded successfully!', { theme: 'dark' });
            setIsDownloading(false);
        }, 1500);
    };

    const handleShare = () => {
        // Placeholder for share logic (e.g., Web Share API or copying link)
        toast.info('Opening share options...', { theme: 'dark' });
    };

    return (
        <div className="modal-overlay position-fixed d-flex justify-content-center align-items-center">

            {/* Extended width for the table view[cite: 41] */}
            <div className="modal-container position-relative" style={{ maxWidth: '800px', width: '100%' }}>

                <div className="modal-glow position-absolute rounded-circle"></div>

                <div className="modal-header mb-4 d-flex justify-content-between align-items-center">
                    <h3 className="modal-title m-0 fw-semibold d-flex align-items-center gap-2">
                        <div className="title-icon-wrapper">
                            <i className="bi bi-file-earmark-text"></i>
                        </div>
                        Invoice Details
                        <span className="text-muted ms-2" style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>
                            #{invoiceData.invoiceName}
                        </span>
                    </h3>
                    <button
                        className="btn-close-custom d-flex align-items-center justify-content-center bg-transparent border-0 fs-6"
                        onClick={onClose}
                        type="button"
                        title="Close">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="modal-body p-0 d-flex flex-column gap-3">

                    {/* Top Info Banner - Clean layout for Payer & Status[cite: 41] */}
                    <div
                        className="payer-info-banner d-flex flex-column flex-md-row justify-content-between p-3 rounded-3"
                        style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                    >
                        <div className="d-flex flex-column gap-2">
                            <span className="icon-text text-uppercase fw-medium" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Billed To</span>
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className="avatar-placeholder d-flex justify-content-center align-items-center rounded-circle fw-medium flex-shrink-0"
                                    style={{ width: '40px', height: '40px', background: 'rgba(124, 58, 237, 0.15)', color: '#c4b5fd', border: '1px solid rgba(124, 58, 237, 0.3)' }}
                                >
                                    {invoiceData.payerName?.charAt(0) || '-'}
                                </div>
                                <div className="d-flex flex-column">
                                    <span className="text-white fw-semibold mb-0 lh-1">{invoiceData.payerName}</span>
                                    <span className="icon-text mt-1" style={{ fontSize: '0.75rem' }}>+91 {invoiceData.payerMobile}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 mt-md-0 d-flex align-items-center gap-4">
                            <div className="text-end d-flex flex-column">
                                <span className="icon-text text-uppercase fw-medium mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Date Issued</span>
                                <span className="text-white fw-medium" style={{ fontSize: '0.85rem' }}>{formatDate(invoiceData.createdAt)}</span>
                            </div>

                            <div className="divider d-none d-md-block" style={{ width: '1px', height: '32px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>

                            <div className="text-end d-flex flex-column">
                                <span className="icon-text text-uppercase fw-medium mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Status</span>
                                <span className={`static-status text-uppercase status-${invoiceData.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                                    {invoiceData.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Ledgers Table */}
                    <div className="ledger-table-wrapper rounded-3 border overflow-auto" style={{ maxHeight: '40vh' }}>
                        <table className="w-100 ledger-table m-0">
                            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                                <tr>
                                    <th className="ps-4">Date</th>
                                    <th>Category</th>
                                    <th>Spend Amt</th>
                                    <th>Due Amt</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records && records.length > 0 ? (
                                    records.map((record) => (
                                        <React.Fragment key={record._id}>
                                            {/* Main Record Row */}
                                            <tr style={{ borderBottom: record.description ? 'none' : '1px solid rgba(255, 255, 255, 0.03)' }}>
                                                <td className="ps-4">{formatDate(record.date)}</td>
                                                <td>{record.category}</td>
                                                <td>₹{record.spendAmount?.toFixed(2)}</td>
                                                <td className={record.dueAmount > 0 ? 'text-danger fw-medium' : 'text-success fw-medium'}>
                                                    ₹{record.dueAmount?.toFixed(2)}
                                                </td>
                                                <td>
                                                    <span className={`static-status text-uppercase ${record.status === 'paid' ? 'status-paid' : 'status-unpaid'}`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>

                                            {/* Expandable Description Row */}
                                            {record.description && (
                                                <tr>
                                                    <td colSpan="5" className="ps-4 pe-4 pb-3 pt-1 border-bottom" style={{ borderTop: 'none' }}>
                                                        <div
                                                            className="description-content p-3 rounded-2"
                                                            style={{
                                                                background: 'rgba(0, 0, 0, 0.25)',
                                                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                                                color: '#a1a1aa', // text-muted equivalent
                                                                fontSize: '0.8rem',
                                                                whiteSpace: 'pre-wrap', // Preserves all line breaks
                                                                lineHeight: '1.6'
                                                            }}
                                                        >
                                                            <span className="d-block mb-1 fw-semibold" style={{ color: '#c4b5fd', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                                <i className="bi bi-card-text me-1"></i> Description / Notes
                                                            </span>
                                                            {record.description}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 icon-text" style={{ fontSize: '0.85rem' }}>
                                            No ledger details available for this invoice.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Footer */}
                    <div className="d-flex justify-content-end pt-2 pe-2 border-top" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                        <div className="d-flex align-items-center gap-3">
                            <span className="icon-text text-uppercase fw-medium" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Total Due:</span>
                            <span className="text-danger fw-bold fs-5">₹{invoiceData.dueAmount?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons[cite: 41] */}
                <div className="modal-footer d-flex justify-content-end gap-2 mt-4 p-0 border-0">
                    <button
                        type="button"
                        className="btn-modal-cancel d-flex align-items-center gap-2"
                        onClick={handleShare}
                    >
                        <i className="bi bi-share"></i>
                        Share
                    </button>

                    <button
                        type="button"
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="btn-modal-save d-flex align-items-center justify-content-center gap-2"
                    >
                        {isDownloading ? (
                            <>
                                <div className="spinner-border" role="status" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                                Preparing PDF...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-download" style={{ fontSize: '0.85rem' }}></i>
                                Download PDF
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewInvoiceModal;