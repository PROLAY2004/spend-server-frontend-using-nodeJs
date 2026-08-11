function CardHeader({
    payerData,
    setLoading,
    setPayerData,
    setEditPayerModal,
    setDeletePayerModal,
    setExpandedPayerId,
    expandedPayerId
}) {
    const toggleAccordion = (id) => {
        setLoading(true)
        setExpandedPayerId(expandedPayerId === id ? null : id);
    };

    return (
        <div className="payer-header d-flex p-3 flex-column align-items-start" onClick={() => toggleAccordion(payerData._id)}>

            {/* Top Row */}
            <div className="d-flex w-100 align-items-center justify-content-between gap-2">
                <div className="col-identity d-flex align-items-center gap-2 gap-sm-3 flex-grow-1 overflow-hidden">
                    <div className="avatar-placeholder d-flex justify-content-center align-items-center rounded-circle fw-medium flex-shrink-0">
                        {payerData.name.charAt(0)}
                    </div>
                    <div className="payer-details d-flex justify-content-center flex-column text-truncate">
                        <h4 className="payer-name text-truncate mb-0">{payerData.name}</h4>
                        <span className="contact-text text-truncate">+91 {payerData.mobile}</span>
                    </div>
                </div>

                <div className="col-stats d-none d-sm-flex align-items-center gap-4">
                    <div className="stat-group d-flex flex-column align-items-start">
                        <span className="stat-label text-uppercase fw-medium mb-1">Due</span>
                        <span className={`stat-value fw-medium fs-6 lh-1 ${payerData.totalDue > 0 ? 'text-danger' : 'text-success'}`}>
                            ₹{payerData.totalDue}
                        </span>
                    </div>

                    <div className="stat-badge d-flex justify-content-center">
                        {payerData.totalDue === 0 ? (
                            <span className="badge-custom success">All Paid</span>
                        ) : (
                            <span className="badge-custom danger">Due Pending</span>
                        )}
                    </div>
                </div>

                <div className="col-actions d-flex align-items-center gap-1 gap-sm-3 flex-shrink-0">
                    <div className="action-buttons d-flex gap-1">
                        <button
                            className="btn-action edit"
                            title="Edit Payer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setPayerData(payerData);
                                setEditPayerModal(true);
                            }}
                        >
                            <i className="bi bi-pencil"></i>
                        </button>
                        <button
                            className="btn-action delete"
                            title="Delete Payer"
                            onClick={(e) => {
                                e.stopPropagation();
                                setPayerData(payerData);
                                setDeletePayerModal(true);
                            }}
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>

                    <div className="divider d-none d-sm-block"></div>

                    <button className="btn-chevron">
                        {/* CHANGED THIS LINE: Now checks against this specific payer's ID */}
                        <i className={`bi bi-chevron-${expandedPayerId === payerData._id ? 'up' : 'down'} toggle-icon`}></i>
                    </button>
                </div>
            </div>

            {/* Mobile Stats */}
            <div className="col-stats-mobile d-flex d-sm-none w-100 mt-3 pt-3 justify-content-between align-items-center border-top">
                <div className="stat-group d-flex flex-column align-items-start">
                    <span className="stat-label">Due</span>
                    <span className={`stat-value fw-medium fs-6 lh-1 ${payerData.totalDue > 0 ? 'text-danger' : 'text-success'}`}>
                        ₹{payerData.totalDue}
                    </span>
                </div>
                <div className="stat-badge d-flex justify-content-center">
                    {payerData.totalDue === 0 ? (
                        <span className="badge-custom success">All Paid</span>
                    ) : (
                        <span className="badge-custom danger">Due Pending</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CardHeader;