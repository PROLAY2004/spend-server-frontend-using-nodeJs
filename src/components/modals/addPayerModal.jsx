import React, { useState, useEffect } from 'react';
import '../../styles/common/modal.scss';

const AddPayerModal = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName('');
            setMobile('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Saving Payer:", { name, mobile });
        onClose();
    };

    return (
        <div className="modal-overlay position-fixed d-flex justify-content-center align-items-center">
            <div className="modal-container w-100 position-relative overflow-hidden">
                {/* Ambient backdrop glow */}
                <div className="modal-glow position-absolute rounded-circle"></div>

                <div className="modal-header mb-3 d-flex justify-content-between align-items-center">
                    <h3 className="modal-title m-0 fw-semibold d-flex align-items-center gap-2">
                        {/* New subtle title icon */}
                        <div className="title-icon-wrapper">
                            <i className="bi bi-person-plus"></i>
                        </div>
                        Add New Payer
                    </h3>
                    <button className="btn-close-custom d-flex align-items-center justify-content-center bg-transparent border-0 fs-6" onClick={onClose} type="button" title="Close">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-body d-flex flex-column gap-3">
                    <div className="form-group">
                        <label className="form-label fs-xs fw-medium mb-1 text-uppercase">
                            Full Name
                        </label>
                        <div className="input-wrapper position-relative">
                            <i className="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3 "></i>
                            <input
                                type="text"
                                className="custom-input form-control shadow-none ps-5"
                                placeholder="e.g. Sarah Jenkins"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label fs-xs fw-medium mb-1 text-uppercase">
                            Mobile Number
                        </label>
                        <div className="input-wrapper position-relative">
                            <i className="bi bi-telephone position-absolute top-50 start-0 translate-middle-y ms-3 "></i>
                            <input
                                type="tel"
                                className="custom-input form-control shadow-none ps-5"
                                placeholder="e.g. +91 98765 43210"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-footer d-flex justify-content-end gap-2 mt-3 p-0 border-0">
                        <button type="button" className="btn-modal-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        {/* Added icon to the primary action button */}
                        <button type="submit" className="btn-modal-save d-flex align-items-center gap-2">
                            <i className="bi bi-plus-lg" style={{ fontSize: '0.85rem' }}></i>
                            Save Payer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPayerModal;