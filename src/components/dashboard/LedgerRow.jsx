import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import formatDate from '../../utils/dateFormater.js';

function LedgerRows({
    record,
    setDetailsModal,
    setEditLedgerModal,
    setRecordData,
    setDeleteLedgerModal,
    setPayerData,
    payerData,
    isSelected,
    onToggleSelect
}) {
    return (
        <tr className={isSelected ? 'selected-row' : ''}>
            <td className="checkbox-cell">
                <label className="custom-checkbox">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(record)}
                    />
                    <span className="checkmark"></span>
                </label>
            </td>
            <td>{formatDate(record.date)}</td>
            <td>{record.category}</td>
            <td>₹{record.spendAmount.toFixed(2)}</td>
            <td>₹{record.originalAmount.toFixed(2)}</td>
            <td className='text-danger fw-medium'>
                ₹{record.dueAmount.toFixed(2)}
            </td>
            <td>
                <span className={`static-status text-uppercase ${record.status === 'paid' ? 'status-paid' : 'status-unpaid'}`}>
                    {record.status}
                </span>
            </td>
            <td>
                <div className="action-buttons d-flex justify-content-center gap-2">
                    <button
                        className="btn-action edit"
                        title="Details"
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
                        onClick={() => {
                            setDeleteLedgerModal(true);
                            setRecordData(record);
                            setPayerData(payerData)
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