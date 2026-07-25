import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import '../../styles/common/modal.scss';
import updatePayer from '../../pages/payers/editPayer.js';
import ModalHeader from './common/ModalHeader.jsx';
import ModalFooter from './common/ModalFooter.jsx';

const EditPayerModal = ({ isOpen, onClose, pageRefresh, payerData }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
    });

    useEffect(() => {
        if (payerData) {
            setFormData({
                name: payerData.name || "",
                mobile: payerData.mobile || "",
            });
        }
    }, [payerData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isSuccess = await updatePayer(navigate, toast, payerData._id, formData);

        setLoading(false);

        if (isSuccess) {
            onClose();
            pageRefresh((prev) => prev+1);         
        }
    };

    return (
        <div className="modal-overlay position-fixed d-flex justify-content-center align-items-center">
            <div className="modal-container w-100 position-relative overflow-hidden">
                <ModalHeader
                    modalIcon={<i className="bi bi-person-plus"></i>}
                    modalName={'Edit Payer Details'}
                    onClose={() => {
                        if (loading) return;
                        onClose();
                    }}
                />

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

                    <ModalFooter
                        onClose={() => {
                            if (loading) return;
                            onClose();
                        }}
                        isDisabled={loading}
                        iconText={'check-circle-fill'}
                        btnName={'Update Payer'}
                        loading={loading}
                        loadingName={'Updating'}
                    />
                </form>
            </div>
        </div>
    );
};

export default EditPayerModal;