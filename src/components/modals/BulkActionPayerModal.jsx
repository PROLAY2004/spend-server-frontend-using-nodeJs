import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import '../../styles/common/modal.scss';
import handleBulkAction from '../../pages/payers/bulkOperations.js';
import generateInvoice from '../../pages/invoices/createInvoice.js';

const BulkActionPayerModal = ({
    isOpen,
    onClose,
    pageRefresh,
    selectedLedgersList,
    setSelectedLedgersList,
    setResetSelection,
    payerData
}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [action, setAction] = useState('');
    const [canShowAllOptions, setCanShowAllOptions] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setAction(''); // Reset action on close
            return;
        }

        setCanShowAllOptions(
            selectedLedgersList.every(item => item.status === "paid") ||
            selectedLedgersList.every(item => item.status === "non-paid")
        );

    }, [isOpen, selectedLedgersList]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let isSuccess = false; 

        if (action === 'invoice') {
            const selectedLedgerIds = selectedLedgersList.map(record => record.id);
            isSuccess = await generateInvoice(navigate, toast, { payerId: payerData._id, recordIds : selectedLedgerIds });
        }
        else {
            isSuccess = await handleBulkAction(navigate, toast, { action, records: selectedLedgersList })
        }

        if (isSuccess) {
            onClose();
            setSelectedLedgersList([]);
            setResetSelection((prev) => prev + 1);
            pageRefresh((prev) => prev + 1);
        }

        setLoading(false);
    };

    return (
        <div className="modal-overlay position-fixed d-flex justify-content-center align-items-center">
            <div className="modal-container w-100 position-relative overflow-hidden">
                <div className="modal-glow position-absolute rounded-circle"></div>

                <div className="modal-header mb-3 d-flex justify-content-between align-items-center">
                    <h3 className="modal-title m-0 fw-semibold d-flex align-items-center gap-2">
                        <div className="title-icon-wrapper">
                            <i className="bi bi-list-task"></i>
                        </div>
                        Bulk Actions
                    </h3>
                    <button
                        className="btn-close-custom d-flex align-items-center justify-content-center bg-transparent border-0 fs-6"
                        onClick={() => {
                            if (loading) return;
                            onClose();
                        }}
                        type="button"
                        title="Close">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <form className="modal-body d-flex flex-column gap-3" onSubmit={handleSubmit}>

                    <div className="mb-2">
                        <span className="badge-custom success py-1 px-2">
                            {selectedLedgersList.length} {selectedLedgersList.length === 1 ? 'Record' : 'Records'} Selected
                        </span>
                    </div>

                    <div className="form-group">
                        <label className="form-label fs-xs fw-medium mb-1 text-uppercase">
                            Select Operation
                        </label>
                        <select
                            className="custom-input form-control shadow-none w-100 px-3 py-2"
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                        >
                            <option value="" disabled>Choose an action...</option>
                            <option value="delete">Delete Records</option>

                            {canShowAllOptions ? (
                                <>
                                    <option value="status">Change Status</option>
                                    <option value="invoice">Generate Invoice</option>
                                </>
                            ) : (
                                <>
                                    <option value="status" disabled>Change Status</option>
                                    <option value="invoice" disabled>Generate Invoice</option>
                                </>
                            )}
                        </select>

                        {!canShowAllOptions && (
                            <small className="icon-text d-block mt-2" style={{ fontSize: '0.7rem' }}>
                                *Status and Invoice options are disabled because the selected records have mixed statuses.
                            </small>
                        )}
                    </div>

                    <div className="modal-footer d-flex justify-content-end gap-2 mt-3 p-0 border-0">
                        <button type="button" className="btn-modal-cancel" onClick={() => {
                            if (loading) return;
                            onClose();
                        }}>
                            Cancel
                        </button>

                        <button
                            disabled={loading}
                            type="submit"
                            className={`d-flex align-items-center justify-content-center gap-2 ${action === 'delete' ? 'btn-modal-delete' : 'btn-modal-save'}`}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner-border" role="status" style={{ width: '20px', height: '20px' }}></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <i className={`bi ${action === 'delete' ? 'bi-trash3' : 'bi-check-circle-fill'}`} style={{ fontSize: '0.85rem' }}></i>
                                    Confirm Action
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BulkActionPayerModal;