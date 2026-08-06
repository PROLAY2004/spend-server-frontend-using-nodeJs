import '../../styles/common/loader.scss';

export default function LedgerSkeletonRow({ isActive }) {
    if (!isActive) {
        return null;
    }

    return (
        Array.from({ length: 3 }).map((_, index) => (
            <tr className="skeleton-row main-ledger-row" key={index}>
                {/* Ex Button */}
                <td className="m-auto text-center">
                    <div className="skeleton-box skeleton-btn rounded-circle mx-auto skeleton-w-24 skeleton-h-24"></div>
                </td>

                {/* Checkbox */}
                <td className="text-center px-0">
                    <div className="skeleton-box skeleton-checkbox m-0"></div>
                </td>

                {/* Date */}
                <td style={{ maxWidth: '130px' }}>
                    <div className="skeleton-box skeleton-table-text skeleton-w-80"></div>
                </td>

                {/* Payer Info */}
                <td style={{ maxWidth: '130px' }}>
                    <div className="payer-info">
                        <div className="skeleton-box skeleton-table-text skeleton-w-120 mb-1"></div>
                        <div className="skeleton-box skeleton-table-text skeleton-w-80 skeleton-h-10"></div>
                    </div>
                </td>

                {/* Category */}
                <td style={{ maxWidth: '130px' }}>
                    <div className="skeleton-box skeleton-table-text skeleton-w-100"></div>
                </td>

                {/* Original Amount */}
                <td style={{ maxWidth: '80px' }}>
                    <div className="skeleton-box skeleton-table-text skeleton-w-70"></div>
                </td>

                {/* Spend Amount */}
                <td style={{ maxWidth: '80px' }}>
                    <div className="skeleton-box skeleton-table-text skeleton-w-70"></div>
                </td>

                {/* Due Amount */}
                <td style={{ maxWidth: '80px' }}>
                    <div className="skeleton-box skeleton-table-text skeleton-w-70"></div>
                </td>

                {/* Status */}
                <td className="px-0" style={{ maxWidth: '80px' }}>
                    <div className="skeleton-box skeleton-table-badge"></div>
                </td>

                {/* Actions */}
                <td>
                    <div className="action-buttons d-flex justify-content-center gap-2">
                        <div className="skeleton-box skeleton-btn"></div>
                        <div className="skeleton-box skeleton-btn"></div>
                        <div className="skeleton-box skeleton-btn"></div>
                    </div>
                </td>
            </tr>
        ))
    );
}