import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Layout Components
import Sidebar from '../../components/common/Sidebar.jsx';
import Header from '../../components/common/Header.jsx';
import EmptyCard from '../../components/common/EmptyCard.jsx';
import LedgerRows from './LedgerRow.jsx';
import LedgersControl from './LedgersControl.jsx';
import LedgerSkeletonRow from '../../components/common/LedgerSkeletonRow.jsx';

import DescriptionModal from '../../components/modals/DescriptionModal.jsx';
import BulkActionPayerModal from '../../components/modals/BulkActionPayerModal.jsx';
import DeleteLedgerModal from '../../components/modals/DeleteLedgerModal.jsx';
import AddLedgerModal from '../../components/modals/AddLedgerModal.jsx';
import EditLedgerModal from '../../components/modals/EditLedgerModal.jsx';

import getLedgers from './fetchLedgers.js';
import '../../styles/ledger.scss';

export default function Ledgers() {
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    // Layout States
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [pageLoader, setPageLoader] = useState(false);
    const [pageRefresh, setPageRefresh] = useState(0);
    const [loading, setLoading] = useState(true);
    const [resetSelection, setResetSelection] = useState(0);

    // Pagination & Filter States
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [filters, setFilters] = useState({
        searchQuery: '',
        statusFilter: 'All',
        selectedPayer: null,
        dateFrom: '',
        dateTo: ''
    });

    // Data States
    const [ledgers, setLedgers] = useState([]);
    const [payersList, setPayersList] = useState([]);

    // Updated to hold objects: [{ id: '...', status: '...' }]
    const [selectedLedgers, setSelectedLedgers] = useState([]);
    const [ignoredLedgerIds, setIgnoredLedgerIds] = useState([]);
    const [ignoredTotalDue, setIgnoredTotalDue] = useState(0);

    // Server-Side Totals
    const [globalTotalDue, setGlobalTotalDue] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);

    // Modal states
    const [detailsModal, setDetailsModal] = useState(false);
    const [editLedgerModal, setEditLedgerModal] = useState(false);
    const [deleteLedgerModal, setDeleteLedgerModal] = useState(false);
    const [bulkActionModal, setBulkActionModal] = useState(false);
    const [addLedgerModal, setAddLedgerModal] = useState(false);
    const [recordData, setRecordData] = useState({});

    useEffect(() => {
        setSelectedLedgers([]);
        setIgnoredLedgerIds([]);
        setIgnoredTotalDue(0);
    }, [
        filters.searchQuery,
        filters.statusFilter,
        filters.selectedPayer?._id,
        filters.dateFrom,
        filters.dateTo,
        resetSelection,
    ]);

    // Fetch Function
    const fetchLedgerData = async () => {
        setLoading(true);

        const payload = {
            page: currentPage,
            limit: 10,
            searchQuery: filters.searchQuery,
            statusFilter: filters.statusFilter,
            dateFrom: filters.dateFrom,
            dateTo: filters.dateTo,
            payerId: filters.selectedPayer?._id || null
        };

        const data = await getLedgers(navigate, toast, payload);

        if (data) {
            setLedgers(data.ledgers);
            setPayersList(data.payersList);
            setTotalPages(data.totalPages);
            setTotalRecords(data.totalRecords);
            setGlobalTotalDue(data.totalDueAmount);
        }

        setLoading(false);
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchLedgerData();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [currentPage, filters, pageLoader, pageRefresh]);

    const adjustedTotalDue = globalTotalDue - ignoredTotalDue;

    const handleToggleIgnore = (record) => {
        const isIgnored = ignoredLedgerIds.includes(record._id);
        const amountToDeduct = record.status === 'non-paid' ? (record.dueAmount || 0) : 0;

        if (isIgnored) {
            // Restore it: Remove ID and subtract from ignored total
            setIgnoredLedgerIds(prev => prev.filter(id => id !== record._id));
            setIgnoredTotalDue(prev => prev - amountToDeduct);
        } else {
            // Ignore it: Add ID and add to ignored total
            setIgnoredLedgerIds(prev => [...prev, record._id]);
            setIgnoredTotalDue(prev => prev + amountToDeduct);

            // Unselect the checkbox if it gets ignored
            setSelectedLedgers(prev => prev.filter(item => item.id !== record._id));
        }
    };

    const handleSelectAll = (e) => {
        const activePageRecords = ledgers
            .filter(l => !ignoredLedgerIds.includes(l._id))
            .map(l => ({
                id: l._id,
                status: l.status,
                payerId: typeof l.payerId === 'object' ? l.payerId._id : l.payerId
            }));

        if (e.target.checked) {
            setSelectedLedgers(prev => [
                ...prev,
                ...activePageRecords.filter(
                    record => !prev.some(item => item.id === record.id)
                )
            ]);
        } else {
            setSelectedLedgers(prev =>
                prev.filter(
                    item => !activePageRecords.some(record => record.id === item.id)
                )
            );
        }
    };

    const handleCheckbox = (record) => {
        if (ignoredLedgerIds.includes(record._id)) return;

        setSelectedLedgers((prev) => {
            const exists = prev.some(item => item.id === record._id);

            if (exists) {
                return prev.filter(item => item.id !== record._id);
            }

            return [
                ...prev,
                {
                    id: record._id,
                    status: record.status,
                    payerId: typeof record.payerId === 'object' ? record.payerId._id : record.payerId,
                }
            ];
        });
    };

    const activeLedgers = ledgers.filter(l => !ignoredLedgerIds.includes(l._id));
    const isAllOnPageSelected = activeLedgers.length > 0 && activeLedgers.every(l => selectedLedgers.some(item => item.id === l._id));

    return (
        <>
            <div className="dashboard-wrapper d-flex h-100 overflow-hidden position-relative">
                <Sidebar isMobileOpen={isMobileOpen} sidebarRef={sidebarRef} setIsMobileOpen={setIsMobileOpen} />

                <main className="main-content d-flex flex-column h-100 flex-grow-1 overflow-auto overflow-x-hidden">
                    <Header
                        setIsMobileOpen={setIsMobileOpen}
                        pageName={"All Ledgers"}
                        breadCrumb={"Finance"}
                        btnIcon={
                            <>
                                <i className="bi bi-plus-circle"></i>
                                <span>Add Ledger</span>
                            </>
                        }
                        btnFunc={() => setAddLedgerModal(true)}
                    />

                    <div className="payers-body w-100 my-0 mx-auto p-3 p-md-4 d-flex flex-column h-100">

                        <LedgersControl
                            filters={filters}
                            payersList={payersList}
                            setFilters={setFilters}
                            setCurrentPage={setCurrentPage}
                        />

                        {/* Stats Bar */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3 p-3 rounded-3" style={{ background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                            <div className="d-flex flex-column">
                                <span className="text-white fw-medium">Total Due Amount: <span className="text-danger">₹{adjustedTotalDue.toFixed(2)}</span></span>
                                <span className="icon-text fs-xs">From {totalRecords} total records across all pages</span>
                            </div>

                            {/* Action Buttons Wrapper */}
                            <div className="d-flex align-items-center gap-2">
                                {ignoredLedgerIds.length > 0 && (
                                    <button
                                        className="border-0 rounded-1 px-3 py-2 gap-1 fw-medium restore-btn d-flex justify-content-center align-items-center"
                                        onClick={() => {
                                            setIgnoredLedgerIds([]);
                                            setIgnoredTotalDue(0);
                                        }}
                                    >
                                        <i className="bi bi-arrow-counterclockwise"></i>
                                        Restore All
                                    </button>
                                )}

                                {/* 3-Dot Bulk Action Button */}
                                {selectedLedgers.length > 0 && (
                                    <button
                                        className="btn-bulk btn-status d-flex align-items-center gap-2"
                                        onClick={() => setBulkActionModal(true)}
                                    >
                                        <i className="bi bi-list-task"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="ledgers-list position-relative d-flex flex-column gap-2 mb-4 flex-grow-1">
                            {
                                <div className="ledger-table-wrapper rounded-3 border overflow-auto">
                                    <table className="w-100 ledger-table">
                                        <thead>
                                            <tr>
                                                <th className="text-center" style={{ width: '40px' }}>Ex</th>
                                                <th className="checkbox-cell px-0" style={{ width: '40px' }}>
                                                    <label className="custom-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            onChange={handleSelectAll}
                                                            checked={!loading && isAllOnPageSelected}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </th>
                                                <th>Date</th>
                                                <th>Payer Details</th>
                                                <th>Category</th>
                                                <th style={{ minWidth: '80px' }}>Spend_Amt</th>
                                                <th style={{ minWidth: '80px' }}>Org_Amt</th>
                                                <th style={{ minWidth: '80px' }}>Due_Amt</th>
                                                <th className="px-0">Status</th>
                                                <th className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading && <LedgerSkeletonRow isActive={loading} />}

                                            {!loading && ledgers.map((record) => (
                                                <LedgerRows
                                                    key={record._id}
                                                    record={record}
                                                    setRecordData={setRecordData}
                                                    isSelected={selectedLedgers.some(item => item.id === record._id)}
                                                    isIgnored={ignoredLedgerIds.includes(record._id)}
                                                    onToggleSelect={handleCheckbox}
                                                    onToggleIgnore={handleToggleIgnore}
                                                    setDetailsModal={setDetailsModal}
                                                    setDeleteLedgerModal={setDeleteLedgerModal}
                                                    setEditLedgerModal={setEditLedgerModal}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            }

                            <EmptyCard isActive={ledgers.length === 0 && !loading} />
                        </div>

                        {totalPages > 0 && (
                            <div className="pagination-wrapper d-flex justify-content-center align-items-center gap-2 mt-auto pt-3 pb-2">
                                {/* Previous Button */}
                                <button
                                    className="page-btn"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </button>

                                {/* Dynamic Page Numbers with Ellipsis Effect */}
                                {(() => {
                                    const pages = [];
                                    if (totalPages <= 5) {
                                        // Show all if 5 or fewer pages
                                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                                    } else {
                                        // Logic for larger page counts
                                        if (currentPage <= 3) {
                                            pages.push(1, 2, 3, 4, '...', totalPages);
                                        } else if (currentPage >= totalPages - 2) {
                                            pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                                        } else {
                                            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                                        }
                                    }

                                    return pages.map((page, index) => (
                                        page === '...' ? (
                                            <span key={`dots-${index}`} className="pagination-dots text-muted px-1" style={{ letterSpacing: '2px' }}>
                                                ...
                                            </span>
                                        ) : (
                                            <button
                                                    key={page}
                                                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </button>
                                        )
                                    ));
                                })()}

                                {/* Next Button */}
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

            <DescriptionModal
                isOpen={detailsModal}
                onClose={() => setDetailsModal(false)}
                recordData={recordData}
            />

            <BulkActionPayerModal
                isOpen={bulkActionModal}
                onClose={() => setBulkActionModal(false)}
                pageRefresh={setPageRefresh}
                selectedLedgersList={selectedLedgers} // Pass the array of objects directly
                setSelectedLedgersList={setSelectedLedgers}
                payerData={recordData}
                setResetSelection={setResetSelection}
            />

            <DeleteLedgerModal
                isOpen={deleteLedgerModal}
                onClose={() => setDeleteLedgerModal(false)}
                pageRefresh={setPageRefresh}
                ledgerData={recordData}
            />

            <AddLedgerModal
                isOpen={addLedgerModal}
                onClose={() => setAddLedgerModal(false)}
                pageRefresh={setPageRefresh}
                payersList={payersList}
            />

            <EditLedgerModal
                isOpen={editLedgerModal}
                onClose={() => setEditLedgerModal(false)}
                pageRefresh={setPageRefresh}
                recordData={recordData}
                payersList={payersList}
            />
        </>
    );
}