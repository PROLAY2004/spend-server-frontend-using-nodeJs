const ModalFooter = ({ onClose, isDisabled, iconText, btnName, loading, loadingName }) => {
    return (
        <div className="modal-footer d-flex justify-content-end gap-2 mt-3 p-0 border-0">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
                Cancel
            </button>

            <button
                disabled={isDisabled}
                type="submit"
                className="btn-modal-save d-flex align-items-center justify-content-center gap-2"
            >
                {loading ? (
                    <>
                        <div className="spinner-border" role="status" style={{ width: '20px', height: '20px' }}></div>
                        {loadingName}...
                    </>
                ) : (
                    <>
                        <i className={`bi bi-${iconText}`} style={{ fontSize: '0.85rem' }}></i>
                        {btnName}
                    </>
                )}
            </button>
        </div>
    );
};

export default ModalFooter;