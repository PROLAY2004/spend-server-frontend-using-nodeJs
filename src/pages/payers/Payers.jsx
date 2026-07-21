import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import PayerCardSkeleton from '../../components/common/PayerCardSkeleton.jsx';
import Sidebar from '../../components/common/Sidebar.jsx';
import Header from '../../components/common/Header.jsx';

import EmptyCard from '../../components/common/EmptyCard.jsx';
import PayerCard from './PayerCard.jsx';

import AddPayerModal from '../../components/modals/AddPayerModal.jsx';
import EditPayerModal from '../../components/modals/EditPayerModal.jsx';
import DeletePayerModal from '../../components/modals/DeletePayerModal.jsx';
import AddPayerLedgerModal from '../../components/modals/AddPayerLedgerModal.jsx';
import EditPayerLedgerModal from '../../components/modals/EditPayerLedgerModal.jsx';
import DescriptionModal from '../../components/modals/DescriptionModal.jsx';

import displayPayer from './fetchPayer.js';
import '../../styles/payers.scss';

export default function Payers() {
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    const [pageLoader, setPageLoader] = useState(true);
    const [emptyState, setEmptyState] = useState(false);
    const [pageRefresh, setPageRefresh] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('All');
    const [sortOption, setSortOption] = useState('Newest First');

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [payerDetails, setPayerDetails] = useState([]);
    const [payerData, setPayerData] = useState({});
    const [recordData, setRecordData] = useState({});

    const [addPayerModal, setAddPayerModal] = useState(false);
    const [editPayerModal, setEditPayerModal] = useState(false);
    const [deletePayerModal, setDeletePayerModal] = useState(false);
    const [addLedgerModal, setAddLedgerModal] = useState(false);
    const [editLedgerModal, setEditLedgerModal] = useState(false);
    const [detailsModal, setDetailsModal] = useState(false);

    const handleDisplay = async () => {
        setPageLoader(true);

        const payload = {
            page: currentPage,
            limit: 5,
            search: searchQuery,
            filter: filterOption,
            sort: sortOption
        };

        const result = await displayPayer(navigate, toast, payload);

        if (result && result.payerDetails.length) {
            setPayerDetails(result.payerDetails);
            setTotalPages(result.totalPages);
            setEmptyState(false);
        } else {
            setPayerDetails([]);
            setTotalPages(1);
            setEmptyState(true);
        }

        setPageLoader(false);
    }

    useEffect(() => {
        // Implement debouncing for the search functionality
        const delayDebounceFn = setTimeout(() => {
            handleDisplay();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [pageRefresh, currentPage, searchQuery, filterOption, sortOption]);

    return (<>
        <div className="dashboard-wrapper d-flex h-100 overflow-hidden position-relative">
            <Sidebar isMobileOpen={isMobileOpen} sidebarRef={sidebarRef} setIsMobileOpen={setIsMobileOpen} />

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
                    btnFunc={() => setAddPayerModal(true)}
                />

                <div className="payers-body w-100 my-0 mx-auto p-3 p-md-4 d-flex flex-column h-100">

                    <div className="controls-bar d-flex flex-column flex-md-row justify-content-between gap-2 mb-4 w-100">
                        <div className="search-wrapper position-relative flex-grow-1">
                            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-lighter"></i>
                            <input
                                type="text"
                                className="custom-input form-control shadow-none ps-5 py-2 pe-3"
                                placeholder="Search by name or contact..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1); // Reset to page 1 on new search
                                }}
                            />
                        </div>

                        <div className="filters-wrapper d-flex gap-2">
                            <select
                                className="custom-select py-2 w-100 form-select shadow-none"
                                value={filterOption}
                                onChange={(e) => {
                                    setFilterOption(e.target.value);
                                    setCurrentPage(1); // Reset to page 1 on filter change
                                }}
                            >
                                <option value="All">All Payers</option>
                                <option value="Paid">All Paid</option>
                                <option value="Non-Paid">Due Pending</option>
                            </select>

                            <select
                                className="custom-select py-2 w-100 form-select shadow-none"
                                value={sortOption}
                                onChange={(e) => {
                                    setSortOption(e.target.value);
                                    setCurrentPage(1); // Reset to page 1 on sort change
                                }}
                            >
                                <option value="Newest First">Newest First</option>
                                <option value="Name A-Z">Name: A→Z</option>
                                <option value="Name Z-A">Name: Z→A</option>
                                <option value="Due: High to Low">Due: High to Low</option>
                                <option value="Due: Low to High">Due: Low to High</option>
                            </select>
                        </div>
                    </div>

                    {/* Payers List */}
                    <div className="payers-list d-flex flex-column gap-2 mb-4 flex-grow-1">
                        <PayerCardSkeleton isLoading={pageLoader} />
                        <EmptyCard isActive={emptyState} />

                        {payerDetails.map((payer) => (
                            <PayerCard
                                key={payer._id}
                                payerData={payer}
                                pageRefresh={pageRefresh}
                                setEditPayerModal={setEditPayerModal}
                                setPayerData={setPayerData}
                                setDeletePayerModal={setDeletePayerModal}
                                setAddLedgerModal={setAddLedgerModal}
                                setEditLedgerModal={setEditLedgerModal}
                                setDetailsModal={setDetailsModal}
                                setRecordData={setRecordData}
                            />
                        ))}
                    </div>

                    {payerDetails.length > 0 && (
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

        <AddPayerModal
            isOpen={addPayerModal}
            onClose={() => setAddPayerModal(false)}
            pageRefresh={setPageRefresh}
        />

        <EditPayerModal
            isOpen={editPayerModal}
            onClose={() => setEditPayerModal(false)}
            pageRefresh={setPageRefresh}
            payerData={payerData}
        />

        <DeletePayerModal
            isOpen={deletePayerModal}
            onClose={() => setDeletePayerModal(false)}
            pageRefresh={setPageRefresh}
            payerData={payerData}
        />

        <AddPayerLedgerModal 
            isOpen={addLedgerModal}
            onClose={() => setAddLedgerModal(false)}
            pageRefresh={setPageRefresh}
            payerData={payerData}
        />

        <DescriptionModal 
            isOpen={detailsModal}
            onClose={() => setDetailsModal(false)}
            recordData={recordData}
        />

        <EditPayerLedgerModal 
            isOpen={editLedgerModal}
            onClose={() => setEditLedgerModal(false)}
            pageRefresh={setPageRefresh}
            recordData={recordData}
        />
    </>
    );
}