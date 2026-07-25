import { useState, useEffect } from 'react';
import formatDate from '../../utils/dateFormater.js';
import LedgerRowSkeleton from '../common/LedgerRowSkeleton.jsx';
import '../../styles/common/modal.scss';

const GenerateInvoiceModal2 = ({
    isOpen,
    onClose,
    payerInfo,
    ledgerData,
    totalLedgersCount,
    onPageChange
}) => {
    const [selectedLedgerIds, setSelectedLedgerIds] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loading, setLoading] = useState(false);

    // Reset selection when modal opens or payer changes
    useEffect(() => {
        if (isOpen) {
            setSelectedLedgerIds([]);
            setIsGenerating(false);
        }
    }, [isOpen, payerInfo]);

    if (!isOpen) return null;

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const visibleIds = ledgerData.recordData.map(l => l._id);
            setSelectedLedgerIds(prev => {
                const newSelection = new Set([...prev, ...visibleIds]);
                return Array.from(newSelection);
            });
        } else {
            // Deselect currently visible ledgers
            const visibleIds = ledgerData.recordData.map(l => l._id);
            setSelectedLedgerIds(prev => prev.filter(id => !visibleIds.includes(id)));
        }
    };

    const handleCheckbox = (id) => {
        setSelectedLedgerIds((prev) =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        // Pass the selected IDs back to the parent to execute the generation API
        await onGenerate(selectedLedgerIds);
        setIsGenerating(false);
    };

    // Check if all CURRENTLY VISIBLE ledgers are selected
    const isAllVisibleSelected = ledgerData.recordData.length > 0 && ledgerData.recordData.every(record => selectedLedgerIds.includes(record._id));

    return (
        <div className="modal-overlay position-fixed d-flex justify-content-center align-items-center">

            {/* Overriding the default 400px width to 800px to fit the table cleanly[cite: 7] */}
            <div className="modal-container position-relative" style={{ maxWidth: '800px', width: '100%' }}>

                <div className="modal-glow position-absolute rounded-circle"></div>

                <div className="modal-header mb-4 d-flex justify-content-between align-items-center">
                    <h3 className="modal-title m-0 fw-semibold d-flex align-items-center gap-2">
                        <div className="title-icon-wrapper">
                            <i className="bi bi-ui-checks"></i>
                        </div>
                        Select Ledgers
                    </h3>
                    <button
                        className="btn-close-custom d-flex align-items-center justify-content-center bg-transparent border-0 fs-6"
                        onClick={() => {
                            if (isGenerating) return;
                            onClose();
                        }}
                        type="button"
                        title="Close">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="modal-body p-0 d-flex flex-column gap-3">

                    {/* Payer Info & Stats Banner */}
                    <div
                        className="payer-info-banner d-flex flex-column flex-sm-row justify-content-between align-items-sm-center p-3 rounded-3"
                        style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <div
                                className="avatar-placeholder d-flex justify-content-center align-items-center rounded-circle fw-medium flex-shrink-0"
                                style={{ width: '40px', height: '40px', background: 'rgba(124, 58, 237, 0.15)', color: '#c4b5fd', border: '1px solid rgba(124, 58, 237, 0.3)' }}
                            >
                                {payerInfo?.name?.charAt(0) || '-'}
                            </div>
                            <div className="d-flex flex-column">
                                <span className="text-white fw-semibold mb-0 lh-1">{payerInfo?.name || 'Unknown Payer'}</span>
                                <span className="icon-text mt-1" style={{ fontSize: '0.75rem' }}>+91 {payerInfo?.mobile || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="mt-3 mt-sm-0 d-flex align-items-center gap-3">
                            <div className="text-end d-flex flex-column">
                                <span className="icon-text text-uppercase fw-medium" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Total Found</span>
                                <span className="text-white fw-medium">{ledgerData.totalLedgers} Records</span>
                            </div>
                            <div className="divider d-none d-sm-block" style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.08)' }}></div>
                            <div className="text-end d-flex flex-column">
                                <span className="icon-text text-uppercase fw-medium" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>Selected</span>
                                <span className="fw-bold" style={{ color: '#c4b5fd' }}>{selectedLedgerIds.length}</span>
                            </div>
                        </div>
                    </div>

                    {/* Ledger Table[cite: 14] */}
                    <div className="ledger-table-wrapper rounded-3 border overflow-auto" style={{ maxHeight: '45vh' }}>
                        <table className="w-100 ledger-table m-0">
                            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                                <tr>
                                    <th className="checkbox-cell">
                                        <label className="custom-checkbox">
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={isAllVisibleSelected}
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </th>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Spend_Amt</th>
                                    <th>Due_Amt</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <LedgerRowSkeleton loading={loading} rows={4} />

                                {!loading && ledgerData.recordData.length > 0 && ledgerData.recordData.map((record) => {
                                    const isSelected = selectedLedgerIds.includes(record._id);

                                    return (
                                        <tr key={record._id} className={isSelected ? 'selected-row' : ''} onClick={() => handleCheckbox(record._id)} style={{ cursor: 'pointer' }}>
                                            <td className="checkbox-cell" onClick={(e) => e.stopPropagation()}>
                                                <label className="custom-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => handleCheckbox(record._id)}
                                                    />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </td>
                                            <td>{formatDate(record.date)}</td>
                                            <td>{record.category}</td>
                                            <td>₹{record.spendAmount.toFixed(2)}</td>
                                            <td className={record.dueAmount > 0 ? 'text-danger fw-medium' : 'text-success fw-medium'}>
                                                ₹{record.dueAmount.toFixed(2)}
                                            </td>
                                            <td>
                                                <span className={`static-status text-uppercase ${record.status === 'paid' ? 'status-paid' : 'status-unpaid'}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {!loading && ledgerData.recordData.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 pagination-text">No ledgers found for this selection.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination[cite: 14] */}
                    {ledgerData.recordData.length > 0 && (
                        <div className="ledger-pagination d-flex flex-sm-row gap-2 justify-content-between align-items-center pt-2 border-0">
                            <span className="pagination-text text-start fs-xs">
                                Showing Page {ledgerData.currentPage} of {ledgerData.totalPages}
                            </span>
                            <div className="d-flex align-items-center justify-content-center gap-1">
                                <button
                                    className="btn-mini-page"
                                    disabled={ledgerData.currentPage === 1}
                                    onClick={() => onPageChange(ledgerData.currentPage - 1)}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                <button
                                    className="btn-mini-page"
                                    disabled={ledgerData.currentPage === ledgerData.totalPages}
                                    onClick={() => onPageChange(ledgerData.currentPage + 1)}
                                >
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="modal-footer d-flex justify-content-between gap-2 mt-4 p-0 border-0">
                    <button
                        type="button"
                        className="btn-modal-cancel d-flex align-items-center gap-2"
                        onClick={onClose}
                        disabled={isGenerating}
                    >
                        <i className="bi bi-arrow-left"></i>
                        Go Back
                    </button>

                    <button
                        disabled={isGenerating || selectedLedgerIds.length === 0}
                        type="button"
                        onClick={handleGenerate}
                        className="btn-modal-save d-flex align-items-center justify-content-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <div className="spinner-border" role="status" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                                Generating...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-file-earmark-plus" style={{ fontSize: '0.85rem' }}></i>
                                Generate
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenerateInvoiceModal2;