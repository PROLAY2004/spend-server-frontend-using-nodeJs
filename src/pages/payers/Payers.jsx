import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../components/common/Sidebar.jsx';
import Header from '../../components/common/Header.jsx';
import '../../styles/payers.scss';

export default function Payers() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [expandedPayerId, setExpandedPayerId] = useState(null);

    // Main List State
    const [searchQuery, setSearchQuery] = useState('');
    const [globalFilter, setGlobalFilter] = useState('All');
    const [globalSort, setGlobalSort] = useState('Name A-Z');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Reduced to 4 so pagination is visible with dummy data

    // Ledger State (Search, Filter, Selection, and Pagination per Payer)
    const [ledgerSearch, setLedgerSearch] = useState({});
    const [ledgerFilters, setLedgerFilters] = useState({});
    const [selectedLedgers, setSelectedLedgers] = useState({});
    const [ledgerPages, setLedgerPages] = useState({});
    const ledgersPerPage = 2; // Reduced to 2 so inner pagination is visible with dummy data

    const sidebarRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const handleClickOutside = (event) => {
            if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileOpen]);

    const toggleAccordion = (id) => {
        setExpandedPayerId(expandedPayerId === id ? null : id);
    };

    const handleHeaderBtnClick = () => {
        console.log("Add New Payer Clicked");
    }

    // Payer Level Actions
    const handleEditPayer = (e, payerId) => {
        e.stopPropagation();
        console.log("Edit Payer:", payerId);
    };

    const handleDeletePayer = (e, payerId) => {
        e.stopPropagation();
        console.log("Delete Payer:", payerId);
    };

    // Ledger Level Actions
    const handleLedgerSearchChange = (payerId, value) => {
        setLedgerSearch(prev => ({ ...prev, [payerId]: value }));
        setLedgerPages(prev => ({ ...prev, [payerId]: 1 }));
    };

    const handleLedgerFilterChange = (payerId, value) => {
        setLedgerFilters(prev => ({ ...prev, [payerId]: value }));
        setSelectedLedgers(prev => ({ ...prev, [payerId]: [] }));
        setLedgerPages(prev => ({ ...prev, [payerId]: 1 }));
    };

    const handleSelectAllLedgers = (payerId, paginatedLedgers, isChecked) => {
        if (isChecked) {
            setSelectedLedgers(prev => ({ ...prev, [payerId]: paginatedLedgers.map(l => l.id) }));
        } else {
            setSelectedLedgers(prev => ({ ...prev, [payerId]: [] }));
        }
    };

    const handleSelectLedger = (payerId, ledgerId, isChecked) => {
        setSelectedLedgers(prev => {
            const currentSelected = prev[payerId] || [];
            if (isChecked) {
                return { ...prev, [payerId]: [...currentSelected, ledgerId] };
            } else {
                return { ...prev, [payerId]: currentSelected.filter(id => id !== ledgerId) };
            }
        });
    };

    const handleLedgerPageChange = (payerId, newPage) => {
        setLedgerPages(prev => ({ ...prev, [payerId]: newPage }));
    };

    // Dummy Data
    const rawPayersData = [
        {
            id: 1, name: "Sarah Jenkins", contact: "+91 98765 43210", idCardNo: "278415487512", dueAmount: 4500,
            ledgers: [
                { id: 101, date: "2026-03-15", category: "Hosting", spendAmount: 5000, originalAmount: 5000, dueAmount: 0, status: "Paid" },
                { id: 102, date: "2026-04-01", category: "Maintenance", spendAmount: 1500, originalAmount: 6000, dueAmount: 4500, status: "Non-Paid" },
                { id: 103, date: "2026-04-15", category: "Domain Renewal", spendAmount: 800, originalAmount: 800, dueAmount: 0, status: "Paid" }
            ]
        },
        {
            id: 2, name: "Rahul Sharma", contact: "+91 9123456789", idCardNo: "5441147581542", dueAmount: 0,
            ledgers: [
                { id: 201, date: "2026-02-10", category: "API Services", spendAmount: 12000, originalAmount: 12000, dueAmount: 0, status: "Paid" },
                { id: 202, date: "2026-05-12", category: "Consulting", spendAmount: 4000, originalAmount: 4000, dueAmount: 0, status: "Paid" }
            ]
        },
        { id: 3, name: "Amit Patel", contact: "+91 9988777665", idCardNo: "5441147581542", dueAmount: 15000, ledgers: [] },
        { id: 4, name: "Priya Singh", contact: "+91 9871234567", idCardNo: "5441147581542", dueAmount: 0, ledgers: [] },
        { id: 5, name: "Vikram Malhotra", contact: "+91 9122334455", idCardNo: "5441147581542", dueAmount: 2500, ledgers: [] },
        { id: 6, name: "Anita Desai", contact: "+91 9900112233", idCardNo: "5441147581542", dueAmount: 0, ledgers: [] }
    ];

    // Data Processing for Main List
    let processedData = rawPayersData.filter(payer => {
        const matchesSearch = payer.name.toLowerCase().includes(searchQuery.toLowerCase()) || payer.contact.includes(searchQuery);
        const matchesFilter = globalFilter === 'All' ? true : (globalFilter === 'Paid' ? payer.dueAmount === 0 : payer.dueAmount > 0);
        return matchesSearch && matchesFilter;
    });

    processedData.sort((a, b) => {
        if (globalSort === 'Name A-Z') return a.name.localeCompare(b.name);
        if (globalSort === 'Name Z-A') return b.name.localeCompare(a.name);
        if (globalSort === 'Due: High to Low') return b.dueAmount - a.dueAmount;
        if (globalSort === 'Due: Low to High') return a.dueAmount - b.dueAmount;
        return 0;
    });

    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const paginatedData = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchQuery, globalFilter, globalSort]);

    return (
        <div className="dashboard-wrapper d-flex h-100 overflow-hidden position-relative">
            <Sidebar isMobileOpen={isMobileOpen} sidebarRef={sidebarRef} />

            <main className="main-content d-flex flex-column h-100 flex-grow-1 overflow-auto overflow-x-hidden">
                <Header
                    setIsMobileOpen={setIsMobileOpen}
                    pageName={"Manage Payers"}
                    breadCrumb={"Directory"}
                    btnIcon={
                        <>
                            <i className="bi bi-person-plus"></i>
                            <span>Add Payer</span>
                        </>
                    }
                    btnFunc={handleHeaderBtnClick}
                />

                <div className="payers-body w-100 my-0 mx-auto p-3 p-md-4 d-flex flex-column h-100">

                    {/* Top Controls Bar */}
                    <div className="controls-bar d-flex flex-column flex-md-row justify-content-between gap-2 mb-4 w-100">
                        <div className="search-wrapper position-relative flex-grow-1">
                            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-lighter"></i>
                            <input
                                type="text"
                                className="custom-input form-control shadow-none ps-5 py-2 pe-3"
                                placeholder="Search by name or contact..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="filters-wrapper d-flex gap-2">
                            <select
                                className="custom-select py-2 w-100 form-select shadow-none"
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                            >
                                <option value="All">All Payers</option>
                                <option value="Paid">All Paid</option>
                                <option value="Non-Paid">Due Pending</option>
                            </select>

                            <select
                                className="custom-select py-2 w-100 form-select shadow-none"
                                value={globalSort}
                                onChange={(e) => setGlobalSort(e.target.value)}
                            >
                                <option value="Name A-Z">Name: A→Z</option>
                                <option value="Name Z-A">Name: Z→A</option>
                                <option value="Due: High to Low">Due: High to Low</option>
                                <option value="Due: Low to High">Due: Low to High</option>
                            </select>
                        </div>
                    </div>

                    {/* Payers List */}
                    <div className="payers-list d-flex flex-column gap-2 mb-4 flex-grow-1">
                        {paginatedData.length > 0 ? paginatedData.map((payer) => {

                            // Ledger Pagination & Filtering Logic
                            const innerSearch = (ledgerSearch[payer.id] || '').toLowerCase();
                            const currentLedgerFilter = ledgerFilters[payer.id] || 'All';

                            const filteredLedgers = payer.ledgers.filter(ledger => {
                                const matchesFilter = currentLedgerFilter === 'All' ? true : ledger.status === currentLedgerFilter;
                                const matchesSearch = ledger.category.toLowerCase().includes(innerSearch) ||
                                    ledger.date.includes(innerSearch);
                                return matchesFilter && matchesSearch;
                            });

                            const ledgerCurrentPage = ledgerPages[payer.id] || 1;
                            const totalLedgerPages = Math.ceil(filteredLedgers.length / ledgersPerPage);
                            const paginatedLedgers = filteredLedgers.slice((ledgerCurrentPage - 1) * ledgersPerPage, ledgerCurrentPage * ledgersPerPage);

                            const selectedForPayer = selectedLedgers[payer.id] || [];
                            const isAllSelected = paginatedLedgers.length > 0 && selectedForPayer.length === paginatedLedgers.length;
                            const isIndeterminate = selectedForPayer.length > 0 && selectedForPayer.length < paginatedLedgers.length;

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
                                                        value={ledgerSearch[payer.id] || ''}
                                                        onChange={(e) => handleLedgerSearchChange(payer.id, e.target.value)}
                                                    />
                                                </div>

                                                <div className="action-group d-flex gap-2 align-items-center h-100">
                                                    <select
                                                        className="custom-select form-select p-2 shadow-none"
                                                        value={currentLedgerFilter}
                                                        onChange={(e) => handleLedgerFilterChange(payer.id, e.target.value)}
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
                                                                        checked={isAllSelected}
                                                                        ref={input => { if (input) input.indeterminate = isIndeterminate; }}
                                                                        onChange={(e) => handleSelectAllLedgers(payer.id, paginatedLedgers, e.target.checked)}
                                                                        disabled={paginatedLedgers.length === 0}
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
                                                        {paginatedLedgers.length > 0 ? paginatedLedgers.map((ledger) => (
                                                            <tr key={ledger.id} className={selectedForPayer.includes(ledger.id) ? 'selected-row' : ''}>
                                                                <td className="checkbox-cell">
                                                                    <label className="custom-checkbox">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedForPayer.includes(ledger.id)}
                                                                            onChange={(e) => handleSelectLedger(payer.id, ledger.id, e.target.checked)}
                                                                        />
                                                                        <span className="checkmark"></span>
                                                                    </label>
                                                                </td>
                                                                <td>{ledger.date}</td>
                                                                <td>{ledger.category}</td>
                                                                <td>₹{ledger.originalAmount.toLocaleString()}</td>
                                                                <td>₹{ledger.spendAmount.toLocaleString()}</td>
                                                                <td className={ledger.dueAmount > 0 ? 'text-danger fw-medium' : ''}>
                                                                    ₹{ledger.dueAmount.toLocaleString()}
                                                                </td>
                                                                <td>
                                                                    <span className={`static-status text-uppercase ${ledger.status === 'Paid' ? 'status-paid' : 'status-unpaid'}`}>
                                                                        {ledger.status}
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
                                                        )) : (
                                                            <tr>
                                                                <td colSpan="8" className="text-center py-4 pagination-text">No records found for this filter.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Ledger Pagination (Inner Accordion) */}
                                            {totalLedgerPages > 1 && (
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
                                            )}

                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            // <div className="text-center py-5 pagination-text">No payers found matching your criteria.</div>
                            <div className="payer-card empty-state-card d-flex flex-column align-items-center justify-content-center text-center p-5 position-relative">
                                <div className="empty-icon position-relative mb-3">
                                    <i
                                        className="bi bi-search"
                                        style={{ fontSize: '2.5rem', opacity: '0.6' }}
                                    ></i>
                                </div>

                                <h4 className="text-white fw-medium fs-5 position-relative">No Payers Found</h4>

                                <p className="pagination-text mb-0 position-relative" style={{ fontSize: '0.85rem', maxWidth: '400px' }}>
                                    We couldn't find any records matching your search or filter criteria. Try adjusting your filters or add new one.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Main List Pagination Controls */}
                    {totalPages > 1 && (
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