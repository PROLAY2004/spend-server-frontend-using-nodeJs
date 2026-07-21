import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import delPayer from '../../pages/payers/deletePayer.js';
import "../../styles/common/modal.scss";


const DeletePayerModal = ({
    isOpen,
    onClose,
    pageRefresh,
    payerData,
}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleDelete = async () => {
        setLoading(true);

        const isDeleted = await delPayer(navigate, toast, payerData._id);

        setLoading(false);

        if(isDeleted){
            onClose();
            pageRefresh((prev) => prev+1);
        }
    };

    return (
        <div className="modal-overlay position-fixed d-flex justify-content-center align-items-center">
            <div className="modal-container w-100 position-relative overflow-hidden">

                <div className="modal-glow position-absolute rounded-circle"></div>

                <div className="modal-header mb-3 d-flex justify-content-between align-items-center">
                    <h3 className="modal-title m-0 fw-semibold d-flex align-items-center gap-2">
                        <div className="title-icon-wrapper">
                            <i className="bi bi-trash3"></i>
                        </div>
                        Confirm Delete
                    </h3>

                    <button
                        className="btn-close-custom d-flex align-items-center justify-content-center bg-transparent border-0 fs-6"
                        type="button"
                        disabled={loading}
                        onClick={onClose}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="modal-body">
                    <p
                        className="mb-0"
                        style={{
                            fontSize: "0.9rem",
                            lineHeight: "1.7",
                            color: "var(--text-secondary)",
                        }}
                    >
                        Are you sure you want to delete{" "}
                        <strong>{payerData.name}</strong>?
                        <br />
                        This action cannot be undone.

                    </p>
                </div>

                <div className="modal-footer d-flex justify-content-end gap-2 mt-3 p-0 border-0">
                    <button
                        type="button"
                        className="btn-modal-cancel"
                        disabled={loading}
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="btn-modal-delete d-flex align-items-center justify-content-center gap-2"
                        disabled={loading}
                        onClick={handleDelete}
                    >
                        {loading ? (
                            <>
                                <div
                                    className="spinner-border"
                                    role="status"
                                    style={{ width: "20px", height: "20px" }}
                                ></div>
                                Deleting...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-trash3"></i>
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeletePayerModal;