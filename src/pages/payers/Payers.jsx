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
            id: 1, name: "Sarah Jenkins", contact: "+91 98765 43210", idCardNo: "ID-9923-X", dueAmount: 4500,
            ledgers: [
                { id: 101, date: "2026-03-15", category: "Hosting", spendAmount: 5000, originalAmount: 5000, dueAmount: 0, status: "Paid" },
                { id: 102, date: "2026-04-01", category: "Maintenance", spendAmount: 1500, originalAmount: 6000, dueAmount: 4500, status: "Non-Paid" },
                { id: 103, date: "2026-04-15", category: "Domain Renewal", spendAmount: 800, originalAmount: 800, dueAmount: 0, status: "Paid" }
            ]
        },
        {
            id: 2, name: "Rahul Sharma", contact: "+91 91234 56789", idCardNo: "ID-4412-Y", dueAmount: 0,
            ledgers: [
                { id: 201, date: "2026-02-10", category: "API Services", spendAmount: 12000, originalAmount: 12000, dueAmount: 0, status: "Paid" },
                { id: 202, date: "2026-05-12", category: "Consulting", spendAmount: 4000, originalAmount: 4000, dueAmount: 0, status: "Paid" }
            ]
        },
        { id: 3, name: "Amit Patel", contact: "+91 99887 77665", idCardNo: "ID-1102-Z", dueAmount: 15000, ledgers: [] },
        { id: 4, name: "Priya Singh", contact: "+91 98712 34567", idCardNo: "ID-8834-A", dueAmount: 0, ledgers: [] },
        { id: 5, name: "Vikram Malhotra", contact: "+91 91223 34455", idCardNo: "ID-5567-B", dueAmount: 2500, ledgers: [] },
        { id: 6, name: "Anita Desai", contact: "+91 99001 12233", idCardNo: "ID-3321-C", dueAmount: 0, ledgers: [] }
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
                    <div className="controls-bar d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                        <div className="search-wrapper position-relative flex-grow-1" style={{ maxWidth: '400px' }}>
                            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                            <input
                                type="text"
                                className="custom-input form-control shadow-none ps-5"
                                placeholder="Search by name or contact..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="filters-wrapper d-flex gap-2">
                            <select
                                className="custom-select form-select shadow-none w-auto"
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                            >
                                <option value="All">All Payers</option>
                                <option value="Paid">All Paid</option>
                                <option value="Non-Paid">Due Pending</option>
                            </select>

                            <select
                                className="custom-select form-select shadow-none w-auto"
                                value={globalSort}
                                onChange={(e) => setGlobalSort(e.target.value)}
                            >
                                <option value="Name A-Z">Sort: Name A-Z</option>
                                <option value="Name Z-A">Sort: Name Z-A</option>
                                <option value="Due: High to Low">Due: High to Low</option>
                                <option value="Due: Low to High">Due: Low to High</option>
                            </select>
                        </div>
                    </div>

                    {/* Payers List */}
                    <div className="payers-list d-flex flex-column gap-3 mb-4 flex-grow-1">
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
                                <div className={`payer-card ${expandedPayerId === payer.id ? 'expanded' : ''}`} key={payer.id}>

                                    {/* Accordion Header */}
                                    <div
                                        className="payer-header d-flex flex-wrap flex-md-nowrap align-items-center justify-content-between cursur-pointer"
                                        onClick={() => toggleAccordion(payer.id)}
                                    >
                                        <div className="payer-info d-flex align-items-center gap-3">
                                            <div className="avatar-placeholder d-flex justify-content-center align-items-center rounded-circle">
                                                {payer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="payer-name mb-0">{payer.name}</h4>
                                                <span className="contact-text fs-xs">{payer.contact}</span>
                                            </div>
                                        </div>

                                        <div className="payer-meta d-flex align-items-center mt-3 mt-md-0">
                                            <div className="text-end d-none d-sm-block me-4">
                                                <div className="fs-xs text-muted mb-1">ID Card No.</div>
                                                <div className="fw-medium text-white fs-sm">{payer.idCardNo}</div>
                                            </div>
                                            <div className="text-end me-4">
                                                <div className="fs-xs text-muted mb-1">Due Amount</div>
                                                <div className={`fw-semibold fs-sm ${payer.dueAmount > 0 ? 'text-danger' : 'text-success'}`}>
                                                    ₹{payer.dueAmount.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="status-badge me-4">
                                                {payer.dueAmount === 0 ? (
                                                    <span className="badge-custom success">All Paid</span>
                                                ) : (
                                                    <span className="badge-custom danger">Due Pending</span>
                                                )}
                                            </div>

                                            <i className={`bi bi-chevron-down toggle-icon ${expandedPayerId === payer.id ? 'rotated' : ''} me-3`}></i>

                                            {/* Payer Action Buttons (Edit/Delete) */}
                                            <div className="payer-actions d-flex gap-2 border-start border-subtle ps-3">
                                                <button className="btn-action edit" onClick={(e) => handleEditPayer(e, payer.id)} title="Edit Payer">
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button className="btn-action delete" onClick={(e) => handleDeletePayer(e, payer.id)} title="Delete Payer">
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Accordion Body */}
                                    <div className="payer-body">
                                        <div className="payer-body-inner">

                                            <div className="body-controls d-flex flex-wrap justify-content-between align-items-center mb-3 gap-3">

                                                {/* Inner Search Bar */}
                                                <div className="search-wrapper position-relative" style={{ maxWidth: '300px', flexGrow: 1 }}>
                                                    <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ fontSize: '0.8rem' }}></i>
                                                    <input
                                                        type="text"
                                                        className="custom-input form-control form-control-sm shadow-none ps-5"
                                                        placeholder="Search records..."
                                                        value={ledgerSearch[payer.id] || ''}
                                                        onChange={(e) => handleLedgerSearchChange(payer.id, e.target.value)}
                                                    />
                                                </div>

                                                <div className="action-group d-flex gap-2 align-items-center">
                                                    <select
                                                        className="custom-select form-select form-select-sm shadow-none"
                                                        value={currentLedgerFilter}
                                                        onChange={(e) => handleLedgerFilterChange(payer.id, e.target.value)}
                                                    >
                                                        <option value="All">All Records</option>
                                                        <option value="Paid">Paid Only</option>
                                                        <option value="Non-Paid">Non-Paid Only</option>
                                                    </select>

                                                    <button className="btn-add-ledger d-flex align-items-center justify-content-center gap-2">
                                                        <i className="bi bi-plus-circle-fill"></i> Add Ledger
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="ledger-table-wrapper rounded-3 border overflow-hidden">
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
                                                            <th>Original Amt</th>
                                                            <th>Spend Amt</th>
                                                            <th>Due Amt</th>
                                                            <th>Status</th>
                                                            <th className="text-end">Actions</th>
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
                                                                    <span className={`static-status ${ledger.status === 'Paid' ? 'status-paid' : 'status-unpaid'}`}>
                                                                        {ledger.status}
                                                                    </span>
                                                                </td>
                                                                <td className="text-end">
                                                                    <div className="action-buttons d-flex justify-content-end gap-2">
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
                                                                <td colSpan="8" className="text-center py-4 text-muted">No records found for this filter.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* Ledger Pagination (Inner Accordion) */}
                                            {totalLedgerPages > 1 && (
                                                <div className="ledger-pagination d-flex justify-content-between align-items-center mt-3 pt-3">
                                                    <span className="text-muted fs-xs">
                                                        Showing {((ledgerCurrentPage - 1) * ledgersPerPage) + 1} to {Math.min(ledgerCurrentPage * ledgersPerPage, filteredLedgers.length)} of {filteredLedgers.length} records
                                                    </span>
                                                    <div className="d-flex align-items-center gap-1">
                                                        <button
                                                            className="btn-mini-page"
                                                            disabled={ledgerCurrentPage === 1}
                                                            onClick={() => handleLedgerPageChange(payer.id, ledgerCurrentPage - 1)}
                                                        >
                                                            <i className="bi bi-chevron-left"></i>
                                                        </button>
                                                        <span className="text-muted fs-xs px-2 fw-medium">
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
                            <div className="text-center py-5 text-muted">No payers found matching your criteria.</div>
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