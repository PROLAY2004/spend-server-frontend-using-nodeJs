import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import formatDate from '../../utils/dateFormater.js';

function LedgerRows({
    record,
    payerData,
    isSelected,
    setRecordData,
    isIgnored,
    onToggleSelect,
    onToggleIgnore,
    setDetailsModal,
    setDeleteLedgerModal,
    setEditLedgerModal
}) {
    // Determine dynamic classes for ignored rows
    const rowClasses = `main-ledger-row ${isSelected ? 'selected-row' : ''} ${isIgnored ? 'text-decoration-line-through text-muted opacity-50' : ''}`;

    return (
        <tr className={rowClasses}>
            <td className="m-auto text-center">
                <button
                    className="btn hover-lift p-1"
                    title={isIgnored ? "Restore to Calculation" : "Remove from Calculation Temporarily"}
                    onClick={() => onToggleIgnore(record)}
                >
                    {isIgnored ? (
                        <i className="bi bi-arrow-counterclockwise text-primary fs-6"></i>
                    ) : (
                        <i className="bi bi-x-circle-fill text-danger fs-6"></i>
                    )}
                </button>
            </td>

            <td className="text-center px-0">
                <label className={`custom-checkbox ${isIgnored ? 'opacity-50' : ''}`}>
                    <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isIgnored} // Prevent checking if row is ignored
                        onChange={() => onToggleSelect(record)}
                    />
                    <span className="checkmark"></span>
                </label>
            </td>
            <td>{formatDate(record.date)}</td>

            <td>
                <div className="payer-info">
                    <span className={`fw-medium ${isIgnored ? 'text-muted' : ''}`}>{record.payerName || 'N/A'}</span>
                    <span className="icon-text d-block">{record.payerMobile || 'N/A'}</span>
                </div>
            </td>

            <td>{record.category}</td>
            <td>₹{record.spendAmount.toFixed(2)}</td>
            <td>₹{record.originalAmount.toFixed(2)}</td>
            <td className={`${isIgnored ? 'text-muted' : 'text-danger'} fw-medium`}>
                ₹{record.dueAmount.toFixed(2)}
            </td>
            <td className="px-0">
                <span className={`static-status text-uppercase ${record.status === 'paid' ? 'status-paid' : 'status-unpaid'} ${isIgnored ? 'opacity-50' : ''}`}>
                    {record.status}
                </span>
            </td>
            <td style={{ textDecoration: 'none' }}>
                <div className={`action-buttons d-flex justify-content-center gap-2 ${isIgnored ? 'pointer-events-none opacity-50' : ''}`}>
                    <button
                        className="btn-action edit"
                        title="Details"
                        disabled={isIgnored}
                        onClick={() => {
                            setRecordData(record);
                            setDetailsModal(true);
                        }}
                    >
                        <i className="bi bi-journal-text"></i>
                    </button>

                    <button
                        className="btn-action edit"
                        title="Edit"
                        disabled={isIgnored}
                        onClick={() => {
                            setRecordData(record);
                            setEditLedgerModal(true);
                        }}
                    >
                        <i className="bi bi-pencil"></i>
                    </button>

                    <button
                        className="btn-action delete"
                        title="Delete"
                        disabled={isIgnored}
                        onClick={() => {
                            setRecordData(record);
                            setDeleteLedgerModal(true);
                        }}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default LedgerRows;