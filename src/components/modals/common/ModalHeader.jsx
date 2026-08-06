const ModalHeader = ({ modalIcon, modalName, onClose }) => {
    return (
        <>
            <div className="modal-glow position-absolute rounded-circle"></div>
            <div className="modal-header mb-3 d-flex justify-content-between align-items-center">
                <h3 className="modal-title m-0 fw-semibold d-flex align-items-center gap-2">
                    <div className="title-icon-wrapper">
                        {modalIcon}
                    </div>
                    {modalName}
                </h3>
                <button
                    className="btn-close-custom d-flex align-items-center justify-content-center bg-transparent border-0 fs-6"
                    onClick={onClose}
                    type="button"
                    title="Close">
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>
        </>
    );
};

export default ModalHeader;