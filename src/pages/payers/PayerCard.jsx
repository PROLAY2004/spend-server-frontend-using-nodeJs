import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import LedgerRows from "../../components/dashboard/LedgerRow.jsx";
import LedgerRowSkeleton from '../../components/common/LedgerRowSkeleton.jsx';
import LedgerControl from "./LedgerContol.jsx";
import CardHeader from './CardHeader.jsx';

import getLedgers from "../ledger/fetchLedgers.js";

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
    resetSelection,
    expandedPayerId,
    setExpandedPayerId,
    innerCardRefresh
}) {
    const navigate = useNavigate();
    const [ledgers, setLedgers] = useState([]);

    const [emptyState, setEmptyState] = useState(false);
    const [loading, setLoading] = useState(true);

    // Controls State
    const [ledgerCurrentPage, setLedgerCurrentPage] = useState(1);
    const [ledgerTotalPages, setLedgerTotalPages] = useState(1);
    const [totalLedgersCount, setTotalLedgersCount] = useState(0);
    const [ledgerSearch, setLedgerSearch] = useState('');
    const [ledgerFilter, setLedgerFilter] = useState('All');
    const [paginetionLimit, setPaginationLimit] = useState(10)

    // Selection State
    const [selectedLedgers, setSelectedLedgers] = useState([]);

    const fetchLedgers = async () => {
        setLoading(true);

        const payload = {
            page: ledgerCurrentPage,
            limit: paginetionLimit,
            searchQuery: ledgerSearch,
            statusFilter: ledgerFilter,
            payerId: payerData._id,
        };

        const data = await getLedgers(navigate, toast, payload);

        if (data && data.ledgers.length) {
            setEmptyState(false);
            setLedgers(data.ledgers);
            setLedgerTotalPages(data.totalPages);
            setTotalLedgersCount(data.totalRecords);
        }
        else {
            setLedgers([]);
            setEmptyState(true);
            setLedgerTotalPages(1);
            setTotalLedgersCount(0);
        }

        setLoading(false);
    };

    useEffect(() => {
        setSelectedLedgers([]);
    }, [resetSelection, ledgerSearch, ledgerFilter]);

    useEffect(() => {
        if (expandedPayerId !== payerData._id) return;

        const delayDebounceFn = setTimeout(() => {
            fetchLedgers();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [expandedPayerId, payerData._id, pageRefresh, ledgerCurrentPage, ledgerSearch, ledgerFilter, innerCardRefresh]);

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
            <CardHeader 
                payerData={payerData}
                setLoading={setLoading}
                setPayerData={setPayerData}
                setEditPayerModal={setEditPayerModal}
                setDeletePayerModal={setDeletePayerModal}
                expandedPayerId={expandedPayerId}
                setExpandedPayerId={setExpandedPayerId}
            />

            <div className="payer-body d-grid">
                <div className="payer-body-inner overflow-hidden">
                    <LedgerControl 
                        payerData={payerData}
                        ledgerSearch={ledgerSearch}
                        setLedgerSearch={setLedgerSearch}
                        setLedgerCurrentPage={setLedgerCurrentPage}
                        ledgerFilter={ledgerFilter}
                        setLedgerFilter={setLedgerFilter}
                        setAddLedgerModal={setAddLedgerModal}
                        setPayerData={setPayerData}
                    />

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
                                    setPayerData(payerData)
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
                                    <th>Spend_Amt</th>
                                    <th>Original_Amt</th>
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