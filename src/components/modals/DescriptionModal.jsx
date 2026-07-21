import '../../styles/common/modal.scss'

const DescriptionModal = ({
    isOpen,
    onClose,
    recordData,
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay d-flex justify-content-center align-items-center position-fixed">

            {/* Main glass-panel container with custom scrollbar support[cite: 12] */}
            <div className="modal-container position-relative w-100">

                {/* Ambient purple glow in the top right corner[cite: 12] */}
                <div className="modal-glow position-absolute"></div>

                <div className="modal-header d-flex justify-content-between align-items-center mb-4">
                    <h3 className="modal-title m-0 fw-semibold d-flex align-items-center gap-2">
                        {/* Premium icon wrapper matching your design system */}
                        <div
                            className="title-icon-wrapper d-flex align-items-center justify-content-center rounded"
                            style={{
                                width: '28px',
                                height: '28px',
                                background: 'rgba(124, 58, 237, 0.1)',
                                color: '#c4b5fd',
                                border: '1px solid rgba(124, 58, 237, 0.2)'
                            }}
                        >
                            <i className="bi bi-text-paragraph"></i>
                        </div>
                        Ledger Description
                    </h3>

                    {/* Hover-responsive custom close button[cite: 12] */}
                    <button
                        className="btn-close-custom d-flex align-items-center justify-content-center bg-transparent border-0"
                        onClick={onClose}
                        style={{ width: '32px', height: '32px' }}
                        title="Close"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="modal-body mb-2">
                    <label className="form-label text-uppercase mb-2 d-block">
                        Details
                    </label>

                    {/* Inset content box for the description text to give it depth */}
                    <div
                        className="description-content p-3 rounded-3"
                        style={{
                            background: 'rgba(0, 0, 0, 0.25)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            color: '#e4e4e7',
                            fontSize: '0.85rem',
                            lineHeight: '1.7',
                            whiteSpace: 'pre-wrap' // Preserves line breaks if the user typed them
                        }}
                    >

                        {recordData.description}
                    </div>
                </div>

                {/* Footer with your styled cancel button[cite: 12] */}
                <div className="modal-footer d-flex justify-content-end p-0 border-0 mt-4">
                    <button
                        type="button"
                        className="btn-modal-cancel"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DescriptionModal;