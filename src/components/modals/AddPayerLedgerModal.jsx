import { useState, useEffect } from 'react';
import '../../styles/common/modal.scss';

const AddPayerLedgerModal = ({ isOpen, onClose }) => {

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
                    <button className="btn-close-custom d-flex align-items-center justify-content-center bg-transparent border-0 fs-6" onClick={onClose} type="button" title="Close">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <form className="modal-body">
                    <div className="row g-2">
                        {/* Row 1: Date & Category */}
                        <div className="col-12 form-group">
                            <label className="form-label fs-xs fw-medium mb-1 text-uppercase">Date</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-calendar3 position-absolute top-50 start-0 translate-middle-y ms-3"></i>
                                <input
                                    type="date"
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
                                    required
                                >
                                    <option value="" disabled selected>Select Category</option>
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

                        {/* Row 2: Original & Spend Amount */}
                        <div className="col-12 col-sm-6 form-group">
                            <label className="form-label  fs-xs fw-medium mb-1 text-uppercase">Original Amt</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-currency-rupee position-absolute top-50 start-0 translate-middle-y ms-3 "></i>
                                <input
                                    type="text"
                                    className="custom-input form-control shadow-none ps-5"
                                    placeholder="0.00"
                                    required
                                />
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
                                    required
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
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-12 col-sm-6 form-group">
                            <label className="form-label  fs-xs fw-medium mb-1 text-uppercase">Status</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-check2-circle position-absolute top-50 start-0 translate-middle-y ms-3 "></i>
                                <select
                                    className="custom-input form-select shadow-none ps-5"
                                    required
                                >
                                    <option value="Paid">Paid</option>
                                    <option value="Non-Paid">Non-Paid</option>
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
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer d-flex justify-content-end gap-2 mt-4 p-0 border-0">
                        <button type="button" className="btn-modal-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-modal-save d-flex align-items-center gap-2">
                            <i className="bi bi-plus-circle" style={{ fontSize: '0.85rem' }}></i>
                            Save Ledger
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPayerLedgerModal;