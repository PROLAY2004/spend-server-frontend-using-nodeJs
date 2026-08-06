import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import LedgerRowSkeleton from '../common/LedgerRowSkeleton.jsx';
import ModalHeader from './common/ModalHeader.jsx';
import ModalFooter from './common/ModalFooter.jsx';

import formatDate from '../../utils/dateFormater.js';
import downloadInvoice from '../../pages/invoices/downloadInvoice.js';
import pdfDownloader from '../../utils/invoiceDownloader.js';
import '../../styles/common/modal.scss';

const ViewInvoiceModal = ({
    isOpen,
    onClose,
    invoiceData,
    ledgerData,
    onPageChange
}) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [loading, setLoading] = useState(false);

    // Accordion State tracking which rows are expanded
    const [expandedRows, setExpandedRows] = useState(new Set());

    // Safely extract paginated data
    const records = ledgerData?.records || [];
    const currentPage = ledgerData?.currentPage || 1;
    const totalPages = ledgerData?.totalPages || 1;

    useEffect(() => {
        if (isOpen) {
            setLoading(false);
        }

        setExpandedRows(new Set());
    }, [isOpen, invoiceData, currentPage]);

    if (!isOpen || !invoiceData) return null;

    const toggleRow = (id) => {
        setExpandedRows(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleDownload = async (e) =>{
        e.preventDefault();
        setIsDownloading(true)

        const data = await downloadInvoice(invoiceData._id);

        if(data){
            pdfDownloader(data);
        }

        setIsDownloading(false);
    }

    return (
        <div className="modal-overlay position-fixed d-flex justify-content-center align-items-center">

            <form className="modal-container position-relative" style={{ maxWidth: '800px', width: '100%' }} onSubmit={handleDownload}>

                <ModalHeader
                    modalIcon={<i className="bi bi-file-earmark-text"></i>}
                    modalName={
                        <>
                            Invoice Details
                            <span className="icon-text d-none d-sm-block ms-2" style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>
                                #{invoiceData.invoiceName}
                            </span>
                        </>
                    }
                    loading={isDownloading}
                    onClose={() => {
                        if (!isDownloading) onClose();
                    }}
                />

                <div className="modal-body p-0 d-flex flex-column gap-3">

                    {/* Top Info Banner */}
                    <div
                        className="payer-info-banner d-flex flex-column flex-sm-row justify-content-between p-3 rounded-3"
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
                                <LedgerRowSkeleton loading={loading} rows={3} />

                                {!loading && records.length > 0 ? (
                                    records.map((record) => {
                                        const isExpanded = expandedRows.has(record._id);

                                        return (
                                            <React.Fragment key={record._id}>
                                                <tr
                                                    className='view-invoice-ledger-header'
                                                    onClick={() => toggleRow(record._id)}
                                                    style={{ borderBottom: isExpanded ? 'none' : '1px solid rgba(255, 255, 255, 0.03)' }}
                                                >
                                                    <td className="ps-4">{formatDate(record.date)}</td>
                                                    <td>{record.category}</td>
                                                    <td>₹{record.spendAmount?.toFixed(2)}</td>
                                                    <td className={record.dueAmount > 0 ? 'text-danger fw-medium' : 'text-success fw-medium'}>
                                                        ₹{record.dueAmount?.toFixed(2)}
                                                    </td>
                                                    <td className="pe-4">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <span className={`static-status text-uppercase ${record.status === 'paid' ? 'status-paid' : 'status-unpaid'}`}>
                                                                {record.status}
                                                            </span>
                                                            <i
                                                                className="bi bi-chevron-down icon-text ms-2"
                                                                style={{
                                                                    fontSize: '0.8rem',
                                                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                                                }}
                                                            ></i>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Accordion Dropdown Content */}
                                                {isExpanded && (
                                                    <tr style={{ animation: 'fadeIn 0.3s ease' }}>
                                                        <td colSpan="5" className="px-4 py-3">
                                                            <div
                                                                className="description-content p-3 rounded-2"
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
                                        )
                                    })
                                ) : (
                                    !loading && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-4 icon-text" style={{ fontSize: '0.85rem' }}>
                                                No ledger details available for this invoice.
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Backend-Driven Pagination Controls */}
                    {!loading && records.length > 0 && totalPages > 0 && (
                        <div className="ledger-pagination d-flex flex-sm-row gap-2 justify-content-between align-items-center pt-2 border-0">
                            <span className="pagination-text text-start fs-xs">
                                Showing Page {currentPage} of {totalPages}
                            </span>
                            <div className="d-flex align-items-center justify-content-center gap-1">
                                <button
                                    type="button"
                                    className="btn-mini-page"
                                    disabled={currentPage === 1 || loading}
                                    onClick={async () => {
                                        setLoading(true);
                                        await onPageChange(currentPage - 1);
                                        setLoading(false);
                                    }}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                <button
                                    type="button"
                                    className="btn-mini-page"
                                    disabled={currentPage === totalPages || loading}
                                    onClick={async () => {
                                        setLoading(true);
                                        await onPageChange(currentPage + 1);
                                        setLoading(false);
                                    }}
                                >
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Summary Footer */}
                    <div className="d-flex justify-content-end pt-2 pe-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="d-flex align-items-center gap-3">
                            <span className="icon-text text-uppercase fw-medium" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Total Due:</span>
                            <span className="text-danger fw-bold fs-5">₹{invoiceData.dueAmount?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>
                </div>

                <ModalFooter
                    onClose={() => {
                        if (!isDownloading) onClose();
                    }}
                    isDisabled={isDownloading || loading}
                    iconText={'download'}
                    btnName={'Download PDF'}
                    loading={isDownloading}
                    loadingName={'Preparing'}
                />
            </form>
        </div>
    );
};

export default ViewInvoiceModal;