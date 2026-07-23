function LedgerControl({
    payerData,
    ledgerSearch,
    setLedgerSearch,
    setLedgerCurrentPage,
    ledgerFilter,
    setAddLedgerModal,
    setPayerData
}) {
    return (
        <div className="body-controls d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3 gap-2">

            <div className="search-wrapper position-relative w-100">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 " style={{ fontSize: '0.8rem' }}></i>
                <input
                    type="text"
                    className="custom-input shadow-none p-2 ps-5 w-100"
                    placeholder="Search records..."
                    value={ledgerSearch}
                    onChange={(e) => {
                        setLedgerSearch(e.target.value);
                        setLedgerCurrentPage(1);
                    }}
                />
            </div>

            <div className="action-group d-flex gap-2 align-items-center h-100">
                <select
                    className="custom-select form-select p-2 shadow-none"
                    value={ledgerFilter}
                    onChange={(e) => {
                        setLedgerFilter(e.target.value);
                        setLedgerCurrentPage(1);
                    }}
                >
                    <option value="All">All Records</option>
                    <option value="Paid">Paid Only</option>
                    <option value="Non-Paid">Non-Paid Only</option>
                </select>

                <button className="btn btn-add-ledger fw-medium d-flex align-items-center justify-content-center gap-2 position-relative overflow-hidden border-0 text-light"
                    onClick={() => {
                        setAddLedgerModal(true);
                        setPayerData(payerData);
                    }}
                >
                    <i className="bi bi-plus-circle"></i> Add Ledger
                </button>
            </div>
        </div>
    );
}

export default LedgerControl;