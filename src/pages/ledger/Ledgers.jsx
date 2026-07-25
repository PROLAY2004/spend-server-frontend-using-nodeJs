import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Layout Components
import Sidebar from '../../components/common/Sidebar.jsx';
import Header from '../../components/common/Header.jsx';
import EmptyCard from '../../components/common/EmptyCard.jsx';
import LedgerRows from '../../components/dashboard/LedgerRow.jsx';
import LedgersControl from './LedgersControl.jsx';

// (Assuming you import your modal components and fetch logic here)

export default function Ledgers() {
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    // Layout States
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [pageLoader, setPageLoader] = useState(false);

    // Pagination & Filter States
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedPayer, setSelectedPayer] = useState(null);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // Data States
    const [ledgers, setLedgers] = useState([]); // Array of ledgers
    const [payersList, setPayersList] = useState([]); // Array of payers for the dropdown
    const [selectedLedgerIds, setSelectedLedgerIds] = useState([]); // For checkboxes

    // Placeholder Modal states for LedgerRows to function
    const [detailsModal, setDetailsModal] = useState(false);
    const [editLedgerModal, setEditLedgerModal] = useState(false);
    const [deleteLedgerModal, setDeleteLedgerModal] = useState(false);
    const [recordData, setRecordData] = useState({});

    // Checkbox Handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedLedgerIds(ledgers.map(l => l._id));
        } else {
            setSelectedLedgerIds([]);
        }
    };

    const handleCheckbox = (record) => {
        setSelectedLedgerIds(prev =>
            prev.includes(record._id)
                ? prev.filter(id => id !== record._id)
                : [...prev, record._id]
        );
    };

    return (
        <div className="dashboard-wrapper d-flex h-100 overflow-hidden position-relative">
            <Sidebar isMobileOpen={isMobileOpen} sidebarRef={sidebarRef} setIsMobileOpen={setIsMobileOpen} />

            <main className="main-content d-flex flex-column h-100 flex-grow-1 overflow-auto overflow-x-hidden">
                <Header
                    setIsMobileOpen={setIsMobileOpen}
                    pageName={"All Ledgers"}
                    breadCrumb={"Finance"}
                    btnIcon={
                        <>
                            <i className="bi bi-file-earmark-spreadsheet"></i>
                            <span>Export CSV</span>
                        </>
                    }
                    btnFunc={() => toast.info("Exporting ledgers...")}
                />

                {/* You can reuse the .payers-body class as it simply sets max-width and min-height */}
                <div className="payers-body w-100 my-0 mx-auto p-3 p-md-4 d-flex flex-column h-100">

                    <LedgersControl
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        dateFrom={dateFrom}
                        setDateFrom={setDateFrom}
                        dateTo={dateTo}
                        setDateTo={setDateTo}
                        selectedPayer={selectedPayer}
                        setSelectedPayer={setSelectedPayer}
                        payersList={payersList}
                        setCurrentPage={setCurrentPage}
                    />

                    <div className="ledgers-list position-relative d-flex flex-column gap-2 mb-4 flex-grow-1">
                        <EmptyCard isActive={!pageLoader && ledgers.length === 0} />

                        {ledgers.length > 0 && (
                            <div className="ledger-table-wrapper rounded-3 border overflow-auto">
                                <table className="w-100 ledger-table">
                                    <thead>
                                        <tr>
                                            <th className="checkbox-cell">
                                                <label className="custom-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={ledgers.length > 0 && selectedLedgerIds.length === ledgers.length}
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
                                        {ledgers.map((record) => (
                                            <LedgerRows
                                                key={record._id}
                                                record={record}
                                                setDetailsModal={setDetailsModal}
                                                setEditLedgerModal={setEditLedgerModal}
                                                setRecordData={setRecordData}
                                                setDeleteLedgerModal={setDeleteLedgerModal}
                                                setPayerData={() => { }} // Pass generic function or specific payer info
                                                payerData={record.payerId} // Adapt based on your data shape
                                                isSelected={selectedLedgerIds.includes(record._id)}
                                                onToggleSelect={handleCheckbox}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Identical Bottom Pagination */}
                    {ledgers.length > 0 && (
                        <div className="pagination-wrapper d-flex justify-content-center align-items-center gap-2 mt-auto pt-3 pb-2">
                            <button
                                className="page-btn"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>

                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                className="page-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}