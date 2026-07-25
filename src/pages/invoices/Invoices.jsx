import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Sidebar from '../../components/common/Sidebar.jsx';
import Header from '../../components/common/Header.jsx';
import EmptyCard from '../../components/common/EmptyCard.jsx';
import InvoiceSkeleton from '../../components/common/InvoiceSkeleton.jsx';
import InvoiceRows from './InvoiceRows.jsx';
import GenerateInvoiceModal1 from '../../components/modals/GenerateInvoiceModal1.jsx';

import getInvoices from './fetchInvoices.js';

import '../../styles/invoices.scss';


function InvoicesControl({ searchQuery, setSearchQuery, setCurrentPage, filterOption, setFilterOption, sortOption, setSortOption }) {
    return (
        <div className="controls-bar d-flex flex-column flex-md-row justify-content-between gap-2 mb-4 w-100">
            <div className="search-wrapper position-relative flex-grow-1">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-lighter"></i>
                <input
                    type="text"
                    className="custom-input form-control shadow-none ps-5 py-2 pe-3"
                    placeholder="Search by invoice number or payer name..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <div className="filters-wrapper d-flex gap-2">
                <select
                    className="custom-select py-2 w-100 form-select shadow-none"
                    value={filterOption}
                    onChange={(e) => {
                        setFilterOption(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="All">All Invoices</option>
                    <option value="Paid">All Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Pending">Due Pending</option>
                </select>

                <select
                    className="custom-select py-2 w-100 form-select shadow-none"
                    value={sortOption}
                    onChange={(e) => {
                        setSortOption(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="Newest First">Newest First</option>
                    <option value="Oldest First">Oldest First</option>
                    <option value="Amount: High to Low">Amount: High to Low</option>
                    <option value="Amount: Low to High">Amount: Low to High</option>
                </select>
            </div>
        </div>
    );
}

export default function Invoices() {
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [pageLoader, setPageLoader] = useState(false);
    const [emptyState, setEmptyState] = useState(false);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(2);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('All');
    const [sortOption, setSortOption] = useState('Newest First');

    const [invoices, setInvoices] = useState([]);

    // Handlers
    const handleGenerateInvoice = () => toast.success("Opening Generate Invoice modal...");
    const handleView = (id) => toast.info(`Viewing details for invoice ${id}`);
    const handleShare = (id) => toast.info(`Opening share options for invoice ${id}`);
    const handleEdit = (id) => toast.warning(`Editing invoice ${id}`);
    const handleDelete = (id) => toast.error(`Deleted invoice ${id}`);

    const handleDisplay = async () => {
        setLoading(true);

        const data = await getInvoices(navigate, toast);

        setInvoices(data.invoices)
        setLoading(false);
    }

    useEffect(() => {
        handleDisplay();
    }, [])

    return (
        <>
            <div className="dashboard-wrapper d-flex h-100 overflow-hidden position-relative">
                <Sidebar isMobileOpen={isMobileOpen} sidebarRef={sidebarRef} setIsMobileOpen={setIsMobileOpen} />

                <main className="main-content d-flex flex-column h-100 flex-grow-1 overflow-auto overflow-x-hidden">
                    <Header
                        setIsMobileOpen={setIsMobileOpen}
                        pageName={"Invoices"}
                        breadCrumb={"Billing"}
                        btnIcon={
                            <>
                                <i className="bi bi-receipt"></i>
                                <span>Generate Invoice</span>
                            </>
                        }
                        btnFunc={handleGenerateInvoice}
                    />

                    <div className="invoices-body w-100 my-0 mx-auto p-3 p-md-4 d-flex flex-column h-100">

                        <InvoicesControl
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            setCurrentPage={setCurrentPage}
                            filterOption={filterOption}
                            setFilterOption={setFilterOption}
                            sortOption={sortOption}
                            setSortOption={setSortOption}
                        />

                        <div className="invoices-list-wrapper position-relative d-flex flex-column gap-2 mb-4 flex-grow-1">
                            <EmptyCard isActive={emptyState} />

                            <div className="invoice-table-wrapper rounded-3 border overflow-auto">
                                <table className="w-100 invoice-table">
                                    <thead style={{}}>
                                        <tr>
                                            <th>Invoice #</th>
                                            <th>Payer Name</th>
                                            <th>Payer Mobile</th>
                                            <th>Issue Date</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                            <th className="text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <InvoiceSkeleton isActive={loading} />

                                        {!loading && invoices.map((inv) => (
                                            <InvoiceRows key={inv._id} inv={inv} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        {/* Pagination matching Payers UI */}
                        {invoices.length > 0 && (
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

            <GenerateInvoiceModal1/>
        </>
    );
}