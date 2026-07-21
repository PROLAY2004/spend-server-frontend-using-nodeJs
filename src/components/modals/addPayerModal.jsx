import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import '../../styles/common/modal.scss';
import insertPayer from '../../pages/payers/addPayer.js';

const AddPayerModal = ({ isOpen, onClose, pageRefresh }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
    });

    if (!isOpen) return;
    
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            mobile: "",
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isSuccess = await insertPayer(navigate, toast, formData);

        setLoading(false);

        if (isSuccess) {
            onClose();
            resetForm();   
            pageRefresh((prev) => prev+1);         
        }
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
                    <button
                        className="btn-close-custom d-flex align-items-center justify-content-center bg-transparent border-0 fs-6"
                        onClick={() => {
                            if (loading) return;
                            onClose();
                            resetForm();
                        }}
                        type="button"
                        title="Close">
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
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
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
                                name='mobile'
                                className="custom-input form-control shadow-none ps-5"
                                placeholder="e.g. 98765 43210"
                                value={formData.mobile}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="modal-footer d-flex justify-content-end gap-2 mt-3 p-0 border-0">
                        <button type="button" className="btn-modal-cancel" onClick={() => {
                            if (loading) return;
                            onClose();
                            resetForm();
                        }}>
                            Cancel
                        </button>

                        <button disabled={loading} type="submit" className="btn-modal-save d-flex align-items-center justify-content-center gap-2">{loading ? (
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
                                Save Payer
                            </>
                        )}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPayerModal;