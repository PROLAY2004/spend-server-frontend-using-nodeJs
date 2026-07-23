import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import LedgerRows from "../../components/dashboard/LedgerRow.jsx";
import LedgerRowSkeleton from '../../components/common/LedgerRowSkeleton.jsx';
import getLedgers from "./fetchLedgers.js";

function PayerCard({
    payerData,
    isVisible,
    setEditPayerModal,
    pageRefresh,
    setPayerData,
    setDeletePayerModal,
    setAddLedgerModal,
    setEditLedgerModal,
    setDetailsModal,
    setRecordData,
    setDeleteLedgerModal,
    setbulkActionModal,
    setSelectedLedgersList,
    resetSelection
}) {
    const navigate = useNavigate();
    const [expandedPayerId, setExpandedPayerId] = useState(null);
    const [ledgers, setLedgers] = useState([]);

    const [emptyState, setEmptyState] = useState(false);
    const [loading, setLoading] = useState(true);

    // Controls State
    const [ledgerCurrentPage, setLedgerCurrentPage] = useState(1);
    const [ledgerTotalPages, setLedgerTotalPages] = useState(1);
    const [totalLedgersCount, setTotalLedgersCount] = useState(0);
    const [ledgerSearch, setLedgerSearch] = useState('');
    const [ledgerFilter, setLedgerFilter] = useState('All');
    const [paginetionLimit, setPaginationLimit] = useState(2)

    // Selection State
    const [selectedLedgers, setSelectedLedgers] = useState([]);

    const fetchLedgers = async () => {
        setLoading(true);

        const payload = {
            page: ledgerCurrentPage,
            limit: paginetionLimit,
            search: ledgerSearch,
            filter: ledgerFilter
        };

        const data = await getLedgers(navigate, toast, payerData._id, payload);

        if (data && data.recordData.length) {
            setEmptyState(false);
            setLedgers(data.recordData);
            setLedgerTotalPages(data.totalPages);
            setTotalLedgersCount(data.totalLedgers);
        }
        else {
            setLedgers([]);
            setEmptyState(true);
            setLedgerTotalPages(1);
            setTotalLedgersCount(0);
        }

        setLoading(false);
    };

    useEffect(()=>{
        setSelectedLedgers([])
    }, [resetSelection])

    const toggleAccordion = (id) => {
        setExpandedPayerId(expandedPayerId === id ? null : id);
    };

    useEffect(() => {
        if (expandedPayerId !== payerData._id) return;

        const delayDebounceFn = setTimeout(() => {
            fetchLedgers();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [expandedPayerId, payerData._id, pageRefresh, ledgerCurrentPage, ledgerSearch, ledgerFilter]);

    const handleSelectAll = (e) => {
        const currentPageRecords = ledgers.map(l => ({
            id: l._id,
            status: l.status
        }));

        if (e.target.checked) {
            setSelectedLedgers(prev => [
                ...prev,
                ...currentPageRecords.filter(
                    record => !prev.some(item => item.id === record.id)
                )
            ]);
        } else {
            setSelectedLedgers(prev =>
                prev.filter(
                    item => !currentPageRecords.some(record => record.id === item.id)
                )
            );
        }
    };

    const handleCheckbox = (record) => {
        setSelectedLedgers((prev) => {
            const exists = prev.some(item => item.id === record._id);

            if (exists) {
                return prev.filter(item => item.id !== record._id);
            }

            return [
                ...prev,
                {
                    id: record._id,
                    status: record.status
                }
            ];
        });
    };

    return (
        <div className={`${isVisible ? '' : 'd-none'} payer-card overflow-hidden ${expandedPayerId === payerData._id ? 'expanded' : ''}`}>
            <div className="payer-header d-flex p-3 flex-column align-items-start" onClick={() => toggleAccordion(payerData._id)}>

                {/* Top Row */}
                <div className="d-flex w-100 align-items-center justify-content-between gap-2">
                    <div className="col-identity d-flex align-items-center gap-2 gap-sm-3 flex-grow-1 overflow-hidden">
                        <div className="avatar-placeholder d-flex justify-content-center align-items-center rounded-circle fw-medium flex-shrink-0">
                            {payerData.name.charAt(0)}
                        </div>
                        <div className="payer-details d-flex justify-content-center flex-column text-truncate">
                            <h4 className="payer-name text-truncate mb-0">{payerData.name}</h4>
                            <span className="contact-text text-truncate">+91 {payerData.mobile}</span>
                        </div>
                    </div>

                    <div className="col-stats d-none d-sm-flex align-items-center gap-4">
                        <div className="stat-group d-flex flex-column align-items-start">
                            <span className="stat-label text-uppercase fw-medium mb-1">Due</span>
                            <span className={`stat-value fw-medium fs-6 lh-1 ${payerData.totalDue > 0 ? 'text-danger' : 'text-success'}`}>
                                ₹{payerData.totalDue}
                            </span>
                        </div>

                        <div className="stat-badge d-flex justify-content-center">
                            {payerData.totalDue === 0 ? (
                                <span className="badge-custom success">All Paid</span>
                            ) : (
                                <span className="badge-custom danger">Due Pending</span>
                            )}
                        </div>
                    </div>

                    <div className="col-actions d-flex align-items-center gap-1 gap-sm-3 flex-shrink-0">
                        <div className="action-buttons d-flex gap-1">
                            <button
                                className="btn-action edit"
                                title="Edit Payer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPayerData(payerData);
                                    setEditPayerModal(true);
                                }}
                            >
                                <i className="bi bi-pencil"></i>
                            </button>
                            <button
                                className="btn-action delete"
                                title="Delete Payer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPayerData(payerData);
                                    setDeletePayerModal(true);
                                }}
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>

                        <div className="divider d-none d-sm-block"></div>

                        <button className="btn-chevron">
                            <i className={`bi bi-chevron-${expandedPayerId === null ? 'down' : 'up'} toggle-icon`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Stats */}
                <div className="col-stats-mobile d-flex d-sm-none w-100 mt-3 pt-3 justify-content-between align-items-center border-top">
                    <div className="stat-group d-flex flex-column align-items-start">
                        <span className="stat-label">Due</span>
                        <span className={`stat-value fw-medium fs-6 lh-1 ${payerData.totalDue > 0 ? 'text-danger' : 'text-success'}`}>
                            ₹{payerData.totalDue}
                        </span>
                    </div>
                    <div className="stat-badge d-flex justify-content-center">
                        {payerData.totalDue === 0 ? (
                            <span className="badge-custom success">All Paid</span>
                        ) : (
                            <span className="badge-custom danger">Due Pending</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="payer-body d-grid">
                <div className="payer-body-inner overflow-hidden">
                    <div className="body-controls d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3 gap-2">

                        <div className="search-wrapper position-relative w-100">
                            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 " style={{ fontSize: '0.8rem' }}></i>
                            <input
                                type="text"
                                className="custom-input shadow-none p-2 ps-5 w-100"
                                placeholder="Search records..."
                                value={ledgerSearch}
                                onChange={(e) => {
                                    setLedgerSearch(e.target.value);
                                    setLedgerCurrentPage(1);
                                }}
                            />
                        </div>

                        <div className="action-group d-flex gap-2 align-items-center h-100">
                            <select
                                className="custom-select form-select p-2 shadow-none"
                                value={ledgerFilter}
                                onChange={(e) => {
                                    setLedgerFilter(e.target.value);
                                    setLedgerCurrentPage(1);
                                }}
                            >
                                <option value="All">All Records</option>
                                <option value="Paid">Paid Only</option>
                                <option value="Non-Paid">Non-Paid Only</option>
                            </select>

                            <button className="btn btn-add-ledger fw-medium d-flex align-items-center justify-content-center gap-2 position-relative overflow-hidden border-0 text-light"
                                onClick={() => {
                                    setAddLedgerModal(true);
                                    setPayerData(payerData);
                                }}
                            >
                                <i className="bi bi-plus-circle"></i> Add Ledger
                            </button>
                        </div>
                    </div>

                    {selectedLedgers.length > 0 && (
                        <div className="bulk-operations d-flex align-items-center justify-content-between gap-2 py-2 px-2 mb-3">
                            <div className="d-flex align-items-center gap-2">
                                <span className="selection-badge d-flex align-items-center justify-content-center text-white fw-bold rounded-circle">
                                    {selectedLedgers.length}
                                </span>
                                <p className="selection-text mb-0 text-white fw-medium" style={{ fontSize: '0.85rem' }}>
                                    {selectedLedgers.length === 1 ? 'Record is selected' : 'Records are selected'}
                                </p>
                            </div>

                            <button 
                                className="btn-bulk btn-status d-flex align-items-center gap-2"
                                onClick={()=>{
                                    setbulkActionModal(true)
                                    setSelectedLedgersList(selectedLedgers)
                                }}
                            >
                                <i className="bi bi-list-task"></i>
                            </button>
                        </div>
                    )}

                    <div className="ledger-table-wrapper rounded-3 border overflow-auto">
                        <table className="w-100 ledger-table">
                            <thead>
                                <tr>
                                    <th className="checkbox-cell">
                                        <label className="custom-checkbox">
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={
                                                    ledgers.length > 0 &&
                                                    ledgers.every(record =>
                                                        selectedLedgers.some(item => item.id === record._id)
                                                    )
                                                }
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
                                <LedgerRowSkeleton loading={loading} />

                                {!loading &&
                                    ledgers.map((record) => (
                                        <LedgerRows
                                            key={record._id}
                                            record={record}
                                            setDetailsModal={setDetailsModal}
                                            setEditLedgerModal={setEditLedgerModal}
                                            setRecordData={setRecordData}
                                            setDeleteLedgerModal={setDeleteLedgerModal}
                                            setPayerData={setPayerData}
                                            payerData={payerData}
                                            isSelected={selectedLedgers.some(item => item.id === record._id)}
                                            onToggleSelect={handleCheckbox}
                                        />
                                    ))
                                }

                                <tr className={!loading && emptyState ? '' : 'd-none'}>
                                    <td colSpan="8" className="text-center py-4 pagination-text">No records found for this filter.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {ledgers.length > 0 && (
                        <div className="ledger-pagination d-flex flex-column flex-sm-row gap-2 justify-content-between align-items-center mt-3 pt-3">
                            <span className="pagination-text text-start fs-xs">
                                Showing {((ledgerCurrentPage - 1) * paginetionLimit) + 1} to {Math.min(ledgerCurrentPage * paginetionLimit, totalLedgersCount)} of {totalLedgersCount} records
                            </span>
                            <div className="d-flex align-items-center justify-content-center gap-1">
                                <button
                                    className="btn-mini-page"
                                    disabled={ledgerCurrentPage === 1}
                                    onClick={() => setLedgerCurrentPage(prev => prev - 1)}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                                <span className="pagination-text fs-xs px-2 fw-medium">
                                    Page {ledgerCurrentPage} of {ledgerTotalPages}
                                </span>
                                <button
                                    className="btn-mini-page"
                                    disabled={ledgerCurrentPage === ledgerTotalPages}
                                    onClick={() => setLedgerCurrentPage(prev => prev + 1)}
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
}

export default PayerCard;