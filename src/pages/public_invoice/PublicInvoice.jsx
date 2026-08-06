import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import formatDate from '../../utils/dateFormater.js';
import LedgerRowSkeleton from '../../components/common/LedgerRowSkeleton.jsx';
import PublicInvoiceSkeleton from '../../components/common/PublicInvoiceSkeleton.jsx';
import Header from './Header.jsx';
import DetailsCard from './DetailsCard.jsx';

import fetchPublicInvoiceData from './fetchPublicInvoice.js';
import '../../styles/public_invoice.scss';

export default function PublicInvoice() {
    const { token } = useParams();

    const [initialLoading, setInitialLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [emptyState, setEmptyState] = useState(false);

    const [invoiceData, setInvoiceData] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [amountDetails, setAmountDetails] = useState({ totalAmount: 0, dueAmount: 0 });
    const [ledgerData, setLedgerData] = useState(null);
    const [expandedRows, setExpandedRows] = useState(new Set());

    const handleDisplay = async (page) => {
        if (page === 1 && !invoiceData) {
            setInitialLoading(true);
        } else {
            setTableLoading(true);
        }

        const data = await fetchPublicInvoiceData(page, setInitialLoading, setTableLoading, token);

        if (data) {
            setInvoiceData(data.invoiceDetails);
            setUserDetails(data.userDetails);
            setLedgerData({
                records: data.records,
                currentPage: data.currentPage,
                totalPages: data.totalPages,
            });
            setAmountDetails({
                totalAmount: data.totalAmount,
                dueAmount: data.dueAmount,
            })
        }
        else {
            setEmptyState(true);
        }

        setInitialLoading(false);
        setTableLoading(false);
    }

    useEffect(() => {
        if (token) {
            handleDisplay(1);
        }
    }, [token]);

    const handlePageChange = async (newPage) => {
        setExpandedRows(new Set());
        await handleDisplay(newPage);
    };

    const toggleRow = (id) => {
        setExpandedRows(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <>
            <Helmet>
                <title>
                    Invoice - Spend Server
                </title>
            </Helmet>

            <div className="public-invoice-wrapper position-relative">
                <Header invoiceData={invoiceData} />

                {initialLoading ? (
                    <PublicInvoiceSkeleton isLoading={true} />
                ) : (
                    <main className="public-container my-5 mx-auto px-3">

                        <DetailsCard invoiceDetails={invoiceData} userDetails={userDetails} amountDetails={amountDetails} />

                        <div className={`${emptyState ? 'd-flex' : 'd-none'} justify-content-center align-items-center`}>
                            <div className="text-center">
                                <i className="bi bi-exclamation-triangle icon-text fs-1 mb-3"></i>
                                <h3 className="text-white">Invoice Not Found</h3>
                                <p className="icon-text">The link might be invalid, expired, or deleted.</p>
                            </div>
                        </div>

                        <div className={`table-section mb-5 ${emptyState ? 'd-none' : 'd-block'}`} >
                            <h5 className="text-white fs-sm fw-medium mb-3 tracking-tight">Ledger Summary</h5>
                            <div className="public-table-wrapper rounded-3 border overflow-auto">
                                <table className="w-100 public-table m-0">
                                    <thead>
                                        <tr>
                                            <th className="ps-4">Date</th>
                                            <th>Category</th>
                                            <th>Spend Amt</th>
                                            <th>Due Amt</th>
                                            <th className="pe-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <LedgerRowSkeleton loading={tableLoading} rows={3} />

                                        {!tableLoading && ledgerData?.records?.length > 0 ? (
                                            ledgerData.records.map((record) => {
                                                const isExpanded = expandedRows.has(record._id);

                                                return (
                                                    <React.Fragment key={record._id}>
                                                        <tr
                                                            className='public-ledger-row'
                                                            onClick={() => toggleRow(record._id)}
                                                            style={{ borderBottom: isExpanded ? 'none' : '1px solid rgba(255, 255, 255, 0.03)' }}
                                                        >
                                                            <td className="ps-4 ">{formatDate(record.date)}</td>
                                                            <td className="text-white">{record.category}</td>
                                                            <td >₹{record.spendAmount?.toFixed(2)}</td>
                                                            <td className={record.dueAmount > 0 ? 'text-danger fw-medium' : 'text-success fw-medium'}>
                                                                ₹{record.dueAmount?.toFixed(2)}
                                                            </td>
                                                            <td className="pe-4">
                                                                <div className="d-flex align-items-center justify-content-between">
                                                                    <span className={`public-status-dot ${record.status === 'paid' ? 'paid' : 'unpaid'}`}>
                                                                        {record.status}
                                                                    </span>
                                                                    <i
                                                                        className="bi bi-chevron-down icon-text ms-3"
                                                                        style={{
                                                                            fontSize: '0.75rem',
                                                                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                            transition: 'transform 0.3s ease'
                                                                        }}
                                                                    ></i>
                                                                </div>
                                                            </td>
                                                        </tr>

                                                        {/* Accordion Dropdown Content */}
                                                        {isExpanded && (
                                                            <tr className="accordion-row">
                                                                <td colSpan="5" className="px-4 py-3 border-bottom border-white-5">
                                                                    <div className="description-box p-3 rounded-2">
                                                                        <span className="d-block mb-2 fw-semibold text-primary-light text-uppercase tracking-wide fs-xs">
                                                                            Description / Notes
                                                                        </span>
                                                                        <p className="mb-0 icon-text lh-base" style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>
                                                                            {record.description || "No additional notes provided."}
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                )
                                            })
                                        ) : (
                                            !tableLoading && (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-5 text-muted fs-sm">
                                                        No ledger details available.
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>

                                {/* Pagination Controls */}
                                {!tableLoading && ledgerData?.totalPages > 0 && (
                                    <div className="public-pagination d-flex justify-content-between align-items-center p-3 border-top border-white-5">
                                        <span className="icon-text fs-xs tracking-wide text-uppercase">
                                            Page {ledgerData.currentPage} of {ledgerData.totalPages}
                                        </span>
                                        <div className="d-flex gap-1">
                                            <button
                                                className="btn-page"
                                                disabled={ledgerData.currentPage === 1}
                                                onClick={() => handlePageChange(ledgerData.currentPage - 1)}
                                            >
                                                <i className="bi bi-chevron-left"></i>
                                            </button>
                                            <button
                                                className="btn-page"
                                                disabled={ledgerData.currentPage === ledgerData.totalPages}
                                                onClick={() => handlePageChange(ledgerData.currentPage + 1)}
                                            >
                                                <i className="bi bi-chevron-right"></i>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                )
                }
            </div >
        </>
    );
}