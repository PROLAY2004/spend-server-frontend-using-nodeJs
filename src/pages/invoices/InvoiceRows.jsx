import { useState } from 'react';
import formatDate from '../../utils/dateFormater.js';

export default function InvoiceRows({ inv, fetchViewLedgersPage, setSelectedInvoice }) {
    const [loading, setLoading] = useState(false)
    const handleView = async () => {
        setLoading(true)
        
        const isSuccess = await fetchViewLedgersPage(1, inv._id);

        if (isSuccess) {
            setSelectedInvoice(inv);
        }

        setLoading(false)
    };

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
                        {loading ?
                            <div className="spinner-border" role="status" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                         : 
                            <i className="bi bi-file-earmark-text"></i>
                         }
                    </button>
                    <button className="btn-action share" title="Share" onClick={() => handleShare(inv._id)}>
                        <i className="bi bi-share"></i>
                    </button>
                    <button className="btn-action edit" title="Change Status" onClick={() => handleEdit(inv._id)}>
                        <i className="bi bi-repeat"></i>
                    </button>
                    <button className="btn-action delete" title="Delete" onClick={() => handleDelete(inv._id)}>
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
}