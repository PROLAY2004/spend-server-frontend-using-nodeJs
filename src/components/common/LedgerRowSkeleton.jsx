import '../../styles/common/loader.scss';

export const LedgerRowSkeleton = ({ loading }) => {
    return (
        Array.from({ length: loading ? 3 : 0 }).map((_, index) => (
            <tr className="skeleton-row" key={index}>
                <td className="checkbox-cell">
                    <div className="skeleton-box skeleton-checkbox"></div>
                </td>

                <td>
                    <div className="skeleton-box skeleton-table-text" style={{ width: '70px' }}></div>
                </td>

                <td>
                    <div className="skeleton-box skeleton-table-text" style={{ width: '100px' }}></div>
                </td>

                <td>
                    <div className="skeleton-box skeleton-table-text" style={{ width: '80px' }}></div>
                </td>

                <td>
                    <div className="skeleton-box skeleton-table-text" style={{ width: '80px' }}></div>
                </td>

                <td>
                    <div className="skeleton-box skeleton-table-text" style={{ width: '80px' }}></div>
                </td>

                <td>
                    <div className="skeleton-box skeleton-table-badge"></div>
                </td>

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
};

export default LedgerRowSkeleton;