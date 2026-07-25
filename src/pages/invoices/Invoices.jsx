import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Sidebar from '../../components/common/Sidebar.jsx';
import Header from '../../components/common/Header.jsx';
import EmptyCard from '../../components/common/EmptyCard.jsx';
import InvoiceSkeleton from '../../components/common/InvoiceSkeleton.jsx';
import InvoiceRows from './InvoiceRows.jsx';
import GenerateInvoiceModal1 from '../../components/modals/GenerateInvoiceModal1.jsx';
import GenerateInvoiceModal2 from '../../components/modals/GenerateInvoiceModal2.jsx';

import getInvoices from './fetchInvoices.js';
import getLedgers from '../ledger/fetchLedgers.js';
import InvoicesControl from './InvoiceControl.jsx';

import '../../styles/invoices.scss';

export default function Invoices() {
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [pageLoader, setPageLoader] = useState(false);
    const [emptyState, setEmptyState] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ledgerPage, setLedgerPage] = useState(1);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(2);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('All');
    const [sortOption, setSortOption] = useState('Newest First');

    const [invoices, setInvoices] = useState([]);
    const [payerList, setPayerList] = useState([]);
    const [ledgerData, setLedgerData] = useState({});
    const [form1Data, setForm1Data] = useState({
        selectedPayer: null,
        status: '',
    });

    const [generateModal1, setGenerateModal1] = useState(false);
    const [generateModal2, setGenerateModal2] = useState(false);

    const fetchLedgerPage = async (page) => {
        const data = await getLedgers(navigate, toast, {
            page,
            limit: 5,
            filter: form1Data.status,
            payerId: form1Data.selectedPayer?._id,
        });

        if (data) {
            setLedgerData(data);
            setLedgerPage(page);

            return true;
        }

        return false;
    };

    const handleDisplay = async () => {
        setLoading(true);

        const data = await getInvoices(navigate, toast);

        if(data){
            setInvoices(data.invoices)
            setEmptyState(false)
            setPayerList(data.payersList)
        }
        else{
            setEmptyState(true)
        }
        
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
                onClose={()=> setGenerateModal2(false)}
                payerInfo={form1Data.selectedPayer}
                ledgerData={ledgerData}
                onPageChange={fetchLedgerPage}
            />
        </>
    );
}