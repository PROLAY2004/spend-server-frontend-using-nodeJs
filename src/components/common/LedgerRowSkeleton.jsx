import '../../styles/common/loader.scss';

export const LedgerRowSkeleton = ({ loading, rows = 0 }) => {
    return (
        Array.from({ length: loading ? 3 : 0 }).map((_, index) => (
            <tr className="skeleton-row" key={index}>
                <td className={rows > 7 ? 'd-none' : 'checkbox-cell'}>
                    <div className="skeleton-box skeleton-checkbox"></div>
                </td>

                <td className={rows > 6 ? 'd-none' : ''}>
                    <div className="skeleton-box skeleton-table-text" style={{ width: '70px' }}></div>
                </td>

                <td className={rows > 5 ? 'd-none' : ''}>
                    <div className="skeleton-box skeleton-table-text" style={{ width: '100px' }}></div>
                </td>

                <td className={rows > 4 ? 'd-none' : ''}>
                    <div className="skeleton-box skeleton-table-text" style={{ width: '80px' }}></div>
                </td>

                <td className={rows > 3 ? 'd-none' : ''}>
                    <div className="skeleton-box skeleton-table-text" style={{ width: '80px' }}></div>
                </td>

                <td className={rows > 2 ? 'd-none' : ''}>
                    <div className="skeleton-box skeleton-table-text" style={{ width: '80px' }}></div>
                </td>

                <td className={rows > 1 ? 'd-none' : ''}>
                    <div className="skeleton-box skeleton-table-badge"></div>
                </td>

                <td className={rows > 0 ? 'd-none' : ''}>
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