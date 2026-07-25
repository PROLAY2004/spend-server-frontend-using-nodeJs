import '../../styles/common/loader.scss'

export default function InvoiceSkeleton({isActive }) {
    return (
        <>
            {[...Array(isActive ? 5 : 0)].map((_, index) => (
                <tr key={index} className="skeleton-row">
                    {/* Invoice # */}
                    <td>
                        <div className="skeleton-box skeleton-table-text" style={{ width: '110px' }}></div>
                    </td>

                    {/* Payer Name */}
                    <td>
                        <div className="skeleton-box skeleton-table-text" style={{ width: '130px' }}></div>
                    </td>

                    {/* Payer Mobile */}
                    <td>
                        <div className="skeleton-box skeleton-table-text" style={{ width: '90px' }}></div>
                    </td>

                    {/* Issue Date */}
                    <td>
                        <div className="skeleton-box skeleton-table-text" style={{ width: '85px' }}></div>
                    </td>

                    {/* Amount */}
                    <td>
                        <div className="skeleton-box skeleton-table-text" style={{ width: '70px' }}></div>
                    </td>

                    {/* Status */}
                    <td>
                        <div className="skeleton-box skeleton-table-badge"></div>
                    </td>

                    {/* Actions */}
                    <td>
                        <div className="action-buttons d-flex justify-content-center gap-2">
                            <div className="skeleton-box skeleton-btn"></div>
                            <div className="skeleton-box skeleton-btn"></div>
                            <div className="skeleton-box skeleton-btn"></div>
                            <div className="skeleton-box skeleton-btn"></div>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}