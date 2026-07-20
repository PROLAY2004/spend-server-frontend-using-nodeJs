import React, { useState, useEffect, useRef } from 'react';

import Sidebar from '../../components/common/Sidebar.jsx';
import Header from '../../components/common/Header.jsx';
import PayerCard from './PayerCard.jsx';
import PayerCardSkeleton from '../../components/common/PayerCardSkeleton.jsx';
import AddPayerModal from '../../components/modals/addPayerModal.jsx'

import '../../styles/payers.scss';

export default function Payers() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [expandedPayerId, setExpandedPayerId] = useState(null);

    // Main List State
    const [searchQuery, setSearchQuery] = useState('');
    const [globalFilter, setGlobalFilter] = useState('All');
    const [globalSort, setGlobalSort] = useState('Name A-Z');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Reduced to 4 so pagination is visible with dummy data

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

    return (<>
        <AddPayerModal isOpen={true} />

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
                                <PayerCardSkeleton />
                                // <PayerCard expandedPayerId={expandedPayerId} payer={payer}/>
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
    </>
    );
}