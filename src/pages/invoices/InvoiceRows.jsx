import formatDate from '../../utils/dateFormater.js';

export default function InvoiceRows({ inv }) {

    return (
        <tr>
            <td className="fw-medium text-white text-truncate">{inv.invoiceName}</td>
            <td>{inv.payerName}</td>
            <td>{inv.payerMobile}</td>
            <td>{formatDate(inv.createdAt)}</td>
            <td className="fw-medium text-white">₹{inv.dueAmount.toFixed(2)}</td>
            <td>
                <span className={`static-status text-uppercase status-${inv.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {inv.status}
                </span>
            </td>
            <td>
                <div className="action-buttons d-flex justify-content-center gap-2">
                    <button className="btn-action view" title="View Invoice" onClick={() => handleView(inv._id)}>
                        <i className="bi bi-file-earmark-text"></i>
                    </button>
                    <button className="btn-action share" title="Share" onClick={() => handleShare(inv._id)}>
                        <i className="bi bi-share"></i>
                    </button>
                    <button className="btn-action edit" title="Change Status" onClick={() => handleEdit(inv._id)}>
                        <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn-action delete" title="Delete" onClick={() => handleDelete(inv._id)}>
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
}