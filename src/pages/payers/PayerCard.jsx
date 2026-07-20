function PayerCard({ expandedPayerId, payer }) {
    return (
        <div className={`payer-card overflow-hidden ${expandedPayerId === payer.id ? 'expanded' : ''}`} key={payer.id}>
            {/* Payer Header - Figma Layout (Mobile & Desktop) */}
            <div className="payer-header d-flex p-3 flex-column align-items-start" onClick={() => toggleAccordion(payer.id)}>

                {/* Top Row: Always visible. Holds Identity (Left) and Actions (Right) */}
                <div className="d-flex w-100 align-items-center justify-content-between gap-2">

                    {/* 1. Identity Block */}
                    <div className="col-identity d-flex align-items-center gap-2 gap-sm-3 flex-grow-1 overflow-hidden">
                        <div className="avatar-placeholder d-flex justify-content-center align-items-center rounded-circle fw-medium flex-shrink-0">
                            {payer.name.charAt(0)}
                        </div>
                        <div className="payer-details d-flex justify-content-center flex-column text-truncate">
                            <h4 className="payer-name text-truncate mb-0">{payer.name}</h4>
                            <span className="contact-text text-truncate">{payer.contact}</span>
                        </div>
                    </div>

                    {/* 2. Stats Block (Desktop Only - sits in the middle on larger screens) */}
                    <div className="col-stats d-none d-sm-flex align-items-center gap-4">
                        <div className="stat-group d-flex flex-column align-items-start">
                            <span className="stat-label text-uppercase fw-medium mb-1">Due</span>
                            <span className={`stat-value fw-medium fs-6 lh-1 ${payer.dueAmount > 0 ? 'text-danger' : 'text-success'}`}>
                                ₹{payer.dueAmount.toLocaleString()}
                            </span>
                        </div>

                        <div className="stat-badge d-flex justify-content-center">
                            {payer.dueAmount === 0 ? (
                                <span className="badge-custom success">All Paid</span>
                            ) : (
                                <span className="badge-custom danger">Due Pending</span>
                            )}
                        </div>
                    </div>

                    {/* 3. Actions Block (Always Right) */}
                    <div className="col-actions d-flex align-items-center gap-1 gap-sm-3 flex-shrink-0">
                        <div className="action-buttons d-flex gap-1">
                            <button
                                className="btn-action edit"
                                onClick={(e) => { e.stopPropagation(); handleEditPayer(e, payer.id); }}
                                title="Edit Payer"
                            >
                                <i className="bi bi-pencil"></i>
                            </button>
                            <button
                                className="btn-action delete"
                                onClick={(e) => { e.stopPropagation(); handleDeletePayer(e, payer.id); }}
                                title="Delete Payer"
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>

                        <div className="divider d-none d-sm-block"></div>

                        <button className="btn-chevron">
                            <i className={`bi bi-chevron-down toggle-icon ${expandedPayerId === payer.id ? 'rotated' : ''}`}></i>
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Mobile Stats (Shows ONLY on screens < 576px) */}
                <div className="col-stats-mobile d-flex d-sm-none w-100 mt-3 pt-3 justify-content-between align-items-center border-top">
                    <div className="stat-group d-flex flex-column align-items-start">
                        <span className="stat-label">Due</span>
                        <span className={`stat-value ${payer.dueAmount > 0 ? 'text-danger' : 'text-success'}`}>
                            ₹{payer.dueAmount.toLocaleString()}
                        </span>
                    </div>
                    <div className="stat-badge d-flex justify-content-center">
                        {payer.dueAmount === 0 ? (
                            <span className="badge-custom success">All Paid</span>
                        ) : (
                            <span className="badge-custom danger">Due Pending</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Accordion Body (Unchanged, your inner grid is already well-structured) */}
            <div className="payer-body d-grid">
                <div className="payer-body-inner overflow-hidden">
                    <div className="body-controls d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3 gap-2">

                        {/* Inner Search Bar */}
                        <div className="search-wrapper position-relative w-100">
                            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 " style={{ fontSize: '0.8rem' }}></i>
                            <input
                                type="text"
                                className="custom-input shadow-none p-2 ps-5 w-100"
                                placeholder="Search records..."
                            />
                        </div>

                        <div className="action-group d-flex gap-2 align-items-center h-100">
                            <select
                                className="custom-select form-select p-2 shadow-none"
                            >
                                <option value="All">All Records</option>
                                <option value="Paid">Paid Only</option>
                                <option value="Non-Paid">Non-Paid Only</option>
                            </select>

                            <button className="btn btn-add-ledger fw-medium d-flex align-items-center justify-content-center gap-2 position-relative overflow-hidden border-0 text-light">
                                <i className="bi bi-plus-circle"></i> Add Ledger
                            </button>
                        </div>
                    </div>

                    <div className="bulk-operations d-flex align-items-center justify-content-between gap-2 py-2 px-2 mb-3">
                        {/* Left Side: Selection Count */}
                        <div className="d-flex align-items-center gap-2">
                            <span className="selection-badge d-flex align-items-center justify-content-center text-white fw-bold rounded-circle">
                                2
                            </span>
                            <p className="selection-text mb-0 text-white fw-medium" style={{ fontSize: '0.85rem' }}>
                                Records of this page are selected
                            </p>
                        </div>

                        <button className="btn-bulk btn-status d-flex align-items-center gap-2">
                            <i class="bi bi-list-task"></i>
                        </button>
                    </div>

                    <div className="ledger-table-wrapper rounded-3 border overflow-auto">
                        <table className="w-100 ledger-table">
                            <thead>
                                <tr>
                                    <th className="checkbox-cell">
                                        <label className="custom-checkbox">
                                            <input
                                                type="checkbox"
                                            />
                                            <span className="checkmark"></span>
                                        </label>
                                    </th>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Original_Amt</th>
                                    <th>Spend_Amt</th>
                                    <th>Due_Amt</th>
                                    <th>Status</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>

                                    <tr  className='selected-row'>
                                        <td className="checkbox-cell">
                                            <label className="custom-checkbox">
                                                <input
                                                    type="checkbox"
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                        </td>
                                        <td>454545</td>
                                        <td>dfsd</td>
                                        <td>₹sdfgdr</td>
                                        <td>₹sdef</td>
                                        <td className='text-danger fw-medium'>
                                            ₹325435
                                        </td>
                                        <td>
                                            <span className='static-status text-uppercase status-unpaid'>
                                                sdf
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons d-flex justify-content-center gap-2">
                                                <button className="btn-action edit" title="Edit">
                                                    <i className="bi bi-journal-text"></i>
                                                </button>
                                                <button className="btn-action edit" title="Edit">
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button className="btn-action delete" title="Delete">
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* <tr>
                                        <td colSpan="8" className="text-center py-4 pagination-text">No records found for this filter.</td>
                                    </tr> */}

                            </tbody>
                        </table>
                    </div>

                    {/* Ledger Pagination (Inner Accordion) */}
                    {/* {totalLedgerPages > 1 && (
                        <div className="ledger-pagination d-flex flex-column flex-sm-row gap-2 justify-content-between align-items-center mt-3 pt-3">
                            <span className="pagination-text text-start fs-xs">
                                Showing {((ledgerCurrentPage - 1) * ledgersPerPage) + 1} to {Math.min(ledgerCurrentPage * ledgersPerPage, filteredLedgers.length)} of {filteredLedgers.length} records
                            </span>
                            <div className="d-flex align-items-center justify-content-center gap-1">
                                <button
                                    className="btn-mini-page"
                                    disabled={ledgerCurrentPage === 1}
                                    onClick={() => handleLedgerPageChange(payer.id, ledgerCurrentPage - 1)}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                <span className="pagination-text fs-xs px-2 fw-medium">
                                    Page {ledgerCurrentPage} of {totalLedgerPages}
                                </span>
                                <button
                                    className="btn-mini-page"
                                    disabled={ledgerCurrentPage === totalLedgerPages}
                                    onClick={() => handleLedgerPageChange(payer.id, ledgerCurrentPage + 1)}
                                >
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    )} */}

                </div>
            </div>
        </div>
    );
}

export default PayerCard;