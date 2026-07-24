import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import PayerCardSkeleton from '../../components/common/PayerCardSkeleton.jsx';
import Sidebar from '../../components/common/Sidebar.jsx';
import Header from '../../components/common/Header.jsx';

import EmptyCard from '../../components/common/EmptyCard.jsx';
import PayerCard from './PayerCard.jsx';
import PayersControl from './PayersControl.jsx';

import AddPayerModal from '../../components/modals/AddPayerModal.jsx';
import EditPayerModal from '../../components/modals/EditPayerModal.jsx';
import DeletePayerModal from '../../components/modals/DeletePayerModal.jsx';
import AddPayerLedgerModal from '../../components/modals/AddPayerLedgerModal.jsx';
import EditPayerLedgerModal from '../../components/modals/EditPayerLedgerModal.jsx';
import DescriptionModal from '../../components/modals/DescriptionModal.jsx';
import DeleteLedgerModal from '../../components/modals/DeleteLedgerModal.jsx';
import BulkActionPayerModal from '../../components/modals/BulkActionPayerModal.jsx';

import displayPayer from './fetchPayer.js';
import '../../styles/payers.scss';

export default function Payers() {
    const navigate = useNavigate();
    const sidebarRef = useRef(null);

    const [pageLoader, setPageLoader] = useState(true);
    const [emptyState, setEmptyState] = useState(false);
    const [pageRefresh, setPageRefresh] = useState(0);
    const [resetSelection, setResetSelection] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOption, setFilterOption] = useState('All');
    const [sortOption, setSortOption] = useState('Newest First');

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [payerDetails, setPayerDetails] = useState([]);
    const [payerData, setPayerData] = useState({});
    const [recordData, setRecordData] = useState({});
    const [selectedLedgersList, setSelectedLedgersList] = useState([]);
    const [expandedPayerId, setExpandedPayerId] = useState(null);

    const [addPayerModal, setAddPayerModal] = useState(false);
    const [editPayerModal, setEditPayerModal] = useState(false);
    const [deletePayerModal, setDeletePayerModal] = useState(false);
    const [addLedgerModal, setAddLedgerModal] = useState(false);
    const [editLedgerModal, setEditLedgerModal] = useState(false);
    const [detailsModal, setDetailsModal] = useState(false);
    const [deleteLedgerModal, setDeleteLedgerModal] = useState(false);
    const [bulkActionModal, setbulkActionModal] = useState(false);

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

                    <PayersControl
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        setCurrentPage={setCurrentPage}
                        filterOption={filterOption}
                        setFilterOption={setFilterOption}
                        sortOption={sortOption}
                        setSortOption={setSortOption}
                    />

                    {/* Payers List */}
                    <div className="payers-list position-relative d-flex flex-column gap-2 mb-4 flex-grow-1">
                        <PayerCardSkeleton isLoading={pageLoader} />
                        <EmptyCard isActive={!pageLoader && emptyState} />

                        {payerDetails.map((payer) => (
                            <PayerCard
                                key={payer._id}
                                isVisible={!pageLoader}
                                payerData={payer}
                                pageRefresh={pageRefresh}
                                setEditPayerModal={setEditPayerModal}
                                setPayerData={setPayerData}
                                setDeletePayerModal={setDeletePayerModal}
                                setAddLedgerModal={setAddLedgerModal}
                                setEditLedgerModal={setEditLedgerModal}
                                setDetailsModal={setDetailsModal}
                                setRecordData={setRecordData}
                                setDeleteLedgerModal={setDeleteLedgerModal}
                                setbulkActionModal={setbulkActionModal}
                                setSelectedLedgersList={setSelectedLedgersList}
                                resetSelection={resetSelection}
                                expandedPayerId={expandedPayerId}
                                setExpandedPayerId={setExpandedPayerId}
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

        <DeleteLedgerModal 
            isOpen={deleteLedgerModal}
            onClose={() => setDeleteLedgerModal(false)}
            pageRefresh={setPageRefresh}
            payerData={payerData}
            ledgerData={recordData}
        />

        <BulkActionPayerModal
            isOpen={bulkActionModal}
            onClose={()=> setbulkActionModal(false)}
            pageRefresh={setPageRefresh}
            selectedLedgersList={selectedLedgersList}
            setSelectedLedgersList={setSelectedLedgersList}
            setResetSelection={setResetSelection}
            payerData={payerData}
        />
    </>
    );
}