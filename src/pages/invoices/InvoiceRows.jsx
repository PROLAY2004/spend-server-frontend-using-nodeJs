import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import formatDate from '../../utils/dateFormater.js';
import shareInvoice from '../../pages/invoices/shareInvoice.js';


export default function InvoiceRows({ inv, fetchViewLedgersPage, fetchEditLedgersPage, setSelectedInvoice, setDeleteModalOpen }) {
    const navigate = useNavigate();
    const [viewBtnloading, setviewBtnLoading] = useState(false)
    const [shareBtnLoading, setShareBtnLoading] = useState(false);
    const [editBtnLoading, setEditBtnLoading] = useState(false);

    const handleView = async () => {
        setviewBtnLoading(true)

        const isSuccess = await fetchViewLedgersPage(1, inv._id);

        if (isSuccess) {
            setSelectedInvoice(inv);
        }

        setviewBtnLoading(false);
    };

    const handleEdit = async () => {
        setEditBtnLoading(true);
        const isSuccess = await fetchEditLedgersPage(1, inv._id);

        if (isSuccess) {
            setSelectedInvoice(inv);
        }
        setEditBtnLoading(false);
    };

    const handleShare = async (invoiceId) => {
        setShareBtnLoading(true);

        const data = await shareInvoice(navigate, toast, invoiceId);

        if(data){
            setTimeout(() => {
                window.open(`/invoice/${data.token}`);
            }, 2000);
        }

        setShareBtnLoading(false);
    }

    return (
        <tr>
            <td className="fw-medium text-white text-truncate">{inv.invoiceName}</td>
            <td>{inv.payerName}</td>
            <td>{inv.payerMobile}</td>
            <td>{formatDate(inv.createdAt)}</td>
            <td className="fw-medium text-white">₹{inv.dueAmount.toFixed(2)}</td>
            <td className='px-2'>
                <span className={`static-status text-uppercase status-${inv.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {inv.status}
                </span>
            </td>
            <td>
                <div className="action-buttons d-flex justify-content-center gap-2">
                    <button
                        className="btn-action view"
                        title="View Invoice"
                        onClick={() => handleView()}
                    >
                        {viewBtnloading ?
                            <div className="spinner-border" role="status" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                            :
                            <i className="bi bi-file-earmark-text"></i>
                        }
                    </button>
                    <button
                        className="btn-action share"
                        title="Share"
                        onClick={() => handleShare(inv._id)}
                    >
                        {shareBtnLoading ?
                            <div className="spinner-border" role="status" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                            :
                            <i className="bi bi-share"></i>
                        }
                    </button>
                    <button className="btn-action edit" title="Change Status" onClick={() => handleEdit()}>
                        {editBtnLoading ?
                            <div className="spinner-border" role="status" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                            :
                            <i className="bi bi-pencil"></i>
                        }
                    </button>
                    <button
                        className="btn-action delete"
                        title="Delete"
                        onClick={() => {
                            setDeleteModalOpen(true)
                            setSelectedInvoice(inv)
                        }}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
}