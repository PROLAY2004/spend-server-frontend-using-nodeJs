import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import addRecord from '../../pages/payers/addPayerRecord.js';
import '../../styles/common/modal.scss';

const AddPayerLedgerModal = ({ isOpen, onClose, pageRefresh, payerData }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const recordData = {
        date: new Date().toISOString().split('T')[0],
        category: '',
        payerId: '',
        originalAmount: '',
        spendAmount: '',
        dueAmount: '',
        status: '',
        description: '',
    }

    const [formData, setFormData] = useState(recordData);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "date" && !value
                    ? new Date().toISOString().split("T")[0]
                    : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isSuccess = await addRecord(navigate, toast, {
            ...formData,
            payerId: payerData._id,
        });

        setLoading(false);

        if (isSuccess) {
            onClose();
            setFormData(recordData);
            pageRefresh((prev) => prev + 1);
        }
    };  

    if (!isOpen) return;


    return (
        <div className="modal-overlay position-fixed d-flex justify-content-center align-items-center">
            <div className="modal-container w-100 position-relative">

                <div className="modal-glow position-absolute rounded-circle"></div>

                <div className="modal-header mb-4 d-flex justify-content-between align-items-center">
                    <h3 className="modal-title m-0 fw-semibold d-flex align-items-center gap-2">
                        <div className="title-icon-wrapper">
                            <i className="bi bi-journal-plus"></i>
                        </div>
                        Add Record
                    </h3>
                    <button
                        className="btn-close-custom d-flex align-items-center justify-content-center bg-transparent border-0 fs-6"
                        onClick={() => {
                            if (loading) return;
                            onClose();
                            setFormData(recordData);
                        }}
                        type="button"
                        title="Close"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="row g-2">
                        <div className="col-12 form-group">
                            <label className="form-label fs-xs fw-medium mb-1 text-uppercase">Date</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-calendar3 position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="custom-input text-uppercase form-control shadow-none ps-5"
                                />
                            </div>
                        </div>

                        <div className="col-12 form-group">
                            <label className="form-label  fs-xs fw-medium mb-1 text-uppercase">Category</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-tags position-absolute top-50 start-0 translate-middle-y ms-3 "></i>
                                <select
                                    className="custom-input form-select shadow-none ps-5"
                                    value={formData.category}
                                    name='category'
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Category</option>
                                    <option value="Bills & Utilities">Bills & Utilities</option>
                                    <option value="Food & Dining">Food & Dining</option>
                                    <option value="Medicine & Healthcare">Medicine & Healthcare</option>
                                    <option value="Money Transfer">Money Transfer</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Travel & Transport">Travel & Transport</option>
                                    <option value="Income or Cashback">Income or Cashback</option>
                                    <option value="Fuel">Fuel</option>
                                    <option value="Grocerry">Grocerry</option>
                                    <option value="Entertelment & Subscription">Entertelment & Subscription</option>
                                    <option value="Investment">Investment</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label className="form-label  fs-xs fw-medium mb-1 text-uppercase">Spend Amt</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-currency-rupee position-absolute top-50 start-0 translate-middle-y ms-3 "></i>
                                <input
                                    type="text"
                                    className="custom-input form-control shadow-none ps-5"
                                    placeholder="0.00"
                                    name='spendAmount'
                                    value={formData.spendAmount}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label className="form-label  fs-xs fw-medium mb-1 text-uppercase">Original Amt</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-currency-rupee position-absolute top-50 start-0 translate-middle-y ms-3 "></i>
                                <input
                                    type="text"
                                    className="custom-input form-control shadow-none ps-5"
                                    placeholder="0.00"
                                    name='originalAmount'
                                    value={formData.originalAmount}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Row 3: Due Amount & Status */}
                        <div className="col-12 col-sm-6 form-group">
                            <label className="form-label  fs-xs fw-medium mb-1 text-uppercase">Due Amt</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-currency-rupee position-absolute top-50 start-0 translate-middle-y ms-3 "></i>
                                <input
                                    type="text"
                                    className="custom-input form-control shadow-none ps-5"
                                    placeholder="0.00"
                                    name='dueAmount'
                                    onChange={handleChange}
                                    value={formData.dueAmount}
                                />
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label className="form-label  fs-xs fw-medium mb-1 text-uppercase">Status</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-check2-circle position-absolute top-50 start-0 translate-middle-y ms-3 "></i>
                                <select
                                    className="custom-input form-select shadow-none ps-5"
                                    name='status'
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Status</option>
                                    <option value="paid">Paid</option>
                                    <option value="non-paid">Non-Paid</option>
                                </select>
                            </div>
                        </div>

                        {/* Row 4: Description (Full Width) */}
                        <div className="col-12 form-group">
                            <label className="form-label  fs-xs fw-medium mb-1 text-uppercase">Description</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-text-paragraph position-absolute top-0 start-0 ms-3 mt-3 "></i>
                                <textarea
                                    className="custom-input form-control shadow-none ps-5 pt-3"
                                    placeholder="Enter ledger details or notes..."
                                    rows="3"
                                    value={formData.description}
                                    name='description'
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer d-flex justify-content-end gap-2 mt-4 p-0 border-0">
                        <button
                            type="button"
                            className="btn-modal-cancel"
                            onClick={() => {
                                if (loading) return;
                                onClose();
                                setFormData(recordData);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="btn-modal-save d-flex align-items-center justify-content-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div
                                        className="spinner-border"
                                        role="status"
                                        style={{ width: '20px', height: '20px' }}></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-plus-circle" style={{ fontSize: '0.85rem' }}></i>
                                    Save Ledger
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPayerLedgerModal;