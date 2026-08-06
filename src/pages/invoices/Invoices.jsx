import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Sidebar from '../../components/common/Sidebar.jsx';
import Header from '../../components/common/Header.jsx';
import InvoicesControl from './InvoiceControl.jsx';
import EmptyCard from '../../components/common/EmptyCard.jsx';
import InvoiceSkeleton from '../../components/common/InvoiceSkeleton.jsx';
import InvoiceRows from './InvoiceRows.jsx';

import GenerateInvoiceModal1 from '../../components/modals/GenerateInvoiceModal1.jsx';
import GenerateInvoiceModal2 from '../../components/modals/GenerateInvoiceModal2.jsx';
import ViewInvoiceModal from '../../components/modals/ViewInvoiceModal.jsx';
import EditInvoiceModal from '../../components/modals/EditInvoiceModal.jsx';
import DeleteInvoiceModal from '../../components/modals/DeleteInvoiceModal.jsx';

import getInvoices from './fetchInvoices.js';
import getInvoiceDetails from '../../pages/invoices/viewInvoice.js';
import getLedgers from '../ledger/fetchLedgers.js';


import '../../styles/invoices.scss';

export default function Invoices() {
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [pageLoader, setPageLoader] = useState(0);
    const [loading, setLoading] = useState(true); // Default to true for initial skeleton load

    // Pagination & Filter States
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('All');
    const [sortOption, setSortOption] = useState('Newest First');
    const itemsPerPage = 5;

    const [invoices, setInvoices] = useState([]);
    const [payerList, setPayerList] = useState([]);
    const [ledgerData, setLedgerData] = useState({});
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [viewLedgerData, setViewLedgerData] = useState({});
    const [editLedgerData, setEditLedgerData] = useState({});

    // Modal Form States
    const [form1Data, setForm1Data] = useState({
        selectedPayer: null,
        status: '',
    });

    const [generateModal1, setGenerateModal1] = useState(false);
    const [generateModal2, setGenerateModal2] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const fetchViewLedgersPage = async (page, invoiceId = selectedInvoice?._id) => {
        const data = await getInvoiceDetails(navigate, toast, {
            invoiceId: invoiceId,
            page: page,
            limit: 5
        });

        if (data) {
            setViewLedgerData(data);
            setViewModalOpen(true);
            return true;
        }

        return false;
    };

    const fetchEditLedgersPage = async (page, invoiceId = selectedInvoice?._id) => {
        // Reusing the same API endpoint to get paginated ledgers for the invoice
        const data = await getInvoiceDetails(navigate, toast, {
            invoiceId: invoiceId,
            page: page,
            limit: 5
        });

        if (data) {
            setEditLedgerData(data);
            setEditModalOpen(true);
            return true;
        }

        return false;
    };

    const fetchLedgerPage = async (page) => {
        const data = await getLedgers(navigate, toast, {
            page,
            limit: 5,
            filter: form1Data.status,
            payerId: form1Data.selectedPayer?._id,
        });

        if (data) {
            setLedgerData(data);
            return true;
        }

        return false;
    };

    const handleDisplay = async () => {
        setLoading(true);

        const payload = {
            page: currentPage,
            limit: itemsPerPage,
            search: searchQuery,
            filter: filterOption,
            sort: sortOption
        };

        const data = await getInvoices(navigate, toast, payload);

        if (data && data.invoices?.length > 0) {
            setInvoices(data.invoices);
            setTotalPages(data.totalPages || 1);
            setPayerList(data.payersList || []);
        } else {
            setInvoices([]);
            setTotalPages(1);
            setPayerList(data?.payersList || []);
        }

        setLoading(false);
    };

    // Debounced fetch to handle search, filter, sort, and pagination changes dynamically
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleDisplay();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [pageLoader, currentPage, searchQuery, filterOption, sortOption]);

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
                        btnFunc={() => setGenerateModal1(true)}
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

                            {/* Empty Card specifically waits for loading to be false */}
                            <EmptyCard isActive={!loading && invoices.length === 0} />

                            {/* Show the table structure if we are loading OR if there is data */}
                            {(loading || invoices.length > 0) && (
                                <div className="invoice-table-wrapper rounded-3 border overflow-auto">
                                    <table className="w-100 invoice-table">
                                        <thead>
                                            <tr>
                                                <th>Invoice #</th>
                                                <th>Payer Name</th>
                                                <th>Payer Mobile</th>
                                                <th>Issue Date</th>
                                                <th>Amount</th>
                                                <th className='px-2'>Status</th>
                                                <th className="text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Render Skeleton if Loading, otherwise render data rows */}
                                            {loading ? (
                                                <InvoiceSkeleton isActive={true} />
                                            ) : (
                                                invoices.map((inv) => (
                                                    <InvoiceRows 
                                                        key={inv._id} 
                                                        inv={inv} 
                                                        fetchViewLedgersPage={fetchViewLedgersPage}   
                                                        fetchEditLedgersPage={fetchEditLedgersPage}
                                                        setSelectedInvoice={setSelectedInvoice}
                                                        setDeleteModalOpen={setDeleteModalOpen}
                                                    />
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </div>

                        {/* Hide pagination if loading or no data exists */}
                        {!loading && invoices.length > 0 && (
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

            <GenerateInvoiceModal1
                isOpen={generateModal1}
                onClose={() => setGenerateModal1(false)}
                payersList={payerList}
                form1Data={form1Data}
                setForm1Data={setForm1Data}
                fetchLedgerPage={fetchLedgerPage}
                setGenerateModal2={setGenerateModal2}
            />

            <GenerateInvoiceModal2
                isOpen={generateModal2}
                onClose={() => setGenerateModal2(false)}
                pageRefresh={setPageLoader}
                payerInfo={form1Data.selectedPayer}
                ledgerData={ledgerData}
                onPageChange={fetchLedgerPage}
                setGenerateModal1={setGenerateModal1}
            />

            <ViewInvoiceModal
                isOpen={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                invoiceData={selectedInvoice}
                ledgerData={viewLedgerData}
                onPageChange={fetchViewLedgersPage}
            />

            <EditInvoiceModal
                isOpen={editModalOpen}
                onClose={() => { setEditModalOpen(false) }}
                pageRefresh={setPageLoader}
                invoiceData={selectedInvoice}
                ledgerData={editLedgerData}
                onPageChange={fetchEditLedgersPage}
            />

            <DeleteInvoiceModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                pageRefresh={setPageLoader}
                invoiceData={selectedInvoice}
            />
        </>
    );
}