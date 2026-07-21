import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import formatDate from '../../utils/dateFormater.js';

function LedgerRows({ record, setDetailsModal, setEditLedgerModal, setRecordData }) {
    return (
        <tr className='selected-row'>
            <td className="checkbox-cell">
                <label className="custom-checkbox">
                    <input
                        type="checkbox"
                    />
                    <span className="checkmark"></span>
                </label>
            </td>
            <td>{formatDate(record.date)}</td>
            <td>{record.category}</td>
            <td>₹{record.originalAmount}</td>
            <td>₹{record.spendAmount}</td>
            <td className='text-danger fw-medium'>
                ₹{record.dueAmount}
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
                    <button className="btn-action delete" title="Delete">
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default LedgerRows;