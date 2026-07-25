import { useState, useEffect, useRef } from 'react';
import '../../styles/common/modal.scss';

const GenerateInvoiceModal1 = ({ isOpen, onClose, payersList = [], onShowLedgers }) => {
    const [loading, setLoading] = useState(false);

    // Form State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPayer, setSelectedPayer] = useState(null);
    const [status, setStatus] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setSelectedPayer(null);
            setStatus('');
            setIsDropdownOpen(false);
        }
    }, [isOpen]);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    // Filter payers based on search input
    const filteredPayers = payersList.filter(payer =>
        payer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setSelectedPayer(null); // Reset selection if user types something new
        setIsDropdownOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPayer || !status) return;

        setLoading(true);
        // Execute the parent function to fetch/show ledgers
        await onShowLedgers({ payerId: selectedPayer._id, status });
        setLoading(false);
    };

    return (
        <div className="modal-overlay position-fixed d-flex justify-content-center align-items-center">
            <div className="modal-container w-100 position-relative overflow-hidden" style={{ overflow: 'visible' }}>

                <div className="modal-glow position-absolute rounded-circle"></div>

                <div className="modal-header mb-3 d-flex justify-content-between align-items-center">
                    <h3 className="modal-title m-0 fw-semibold d-flex align-items-center gap-2">
                        <div className="title-icon-wrapper">
                            <i className="bi bi-receipt"></i>
                        </div>
                        Generate Invoice
                    </h3>
                    <button
                        className="btn-close-custom d-flex align-items-center justify-content-center bg-transparent border-0 fs-6"
                        onClick={() => {
                            if (loading) return;
                            onClose();
                        }}
                        type="button"
                        title="Close">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <form className="modal-body d-flex flex-column gap-3" onSubmit={handleSubmit}>

                    {/* Searchable Dropdown for Payers */}
                    <div className="form-group" ref={dropdownRef}>
                        <label className="form-label fs-xs fw-medium mb-1 text-uppercase">
                            Select Payer
                        </label>
                        <div className="input-wrapper position-relative">
                            <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 icon-text"></i>
                            <input
                                type="text"
                                className="custom-input form-control shadow-none ps-5 py-2"
                                placeholder="Search payer name..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onFocus={() => setIsDropdownOpen(true)}
                                required
                            />

                            {/* Custom Dropdown Menu */}
                            {isDropdownOpen && (
                                <div
                                    className="position-absolute w-100 mt-1 rounded-2 shadow-lg overflow-hidden"
                                    style={{
                                        background: '#111',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        maxHeight: '180px',
                                        overflowY: 'auto',
                                        zIndex: 1060
                                    }}
                                >
                                    {filteredPayers.length > 0 ? (
                                        filteredPayers.map(payer => (
                                            <div
                                                key={payer._id}
                                                className="px-3 py-2 text-white"
                                                style={{ cursor: 'pointer', transition: 'background 0.2s', fontSize: '0.85rem' }}
                                                onMouseDown={() => {
                                                    setSelectedPayer(payer);
                                                    setSearchTerm(payer.name);
                                                    setIsDropdownOpen(false);
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
                                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                            >
                                                {payer.name}
                                                <small className="d-block text-muted" style={{ fontSize: '0.75rem' }}>{payer.mobile}</small>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-3 py-3 text-muted text-center" style={{ fontSize: '0.85rem' }}>
                                            No payers found
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Standard Dropdown for Status */}
                    <div className="form-group">
                        <label className="form-label fs-xs fw-medium mb-1 text-uppercase">
                            Ledger Status
                        </label>
                        <div className="input-wrapper position-relative">
                            <i className="bi bi-funnel position-absolute top-50 start-0 translate-middle-y ms-3 icon-text"></i>
                            <select
                                className="custom-input form-control shadow-none w-100 px-3 py-2 ps-5"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                required
                            >
                                <option value="" disabled>Choose status...</option>
                                <option value="paid">Paid</option>
                                <option value="non-paid">Non-Paid</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer d-flex justify-content-end gap-2 mt-3 p-0 border-0">
                        <button type="button" className="btn-modal-cancel" onClick={() => {
                            if (loading) return;
                            onClose();
                        }}>
                            Cancel
                        </button>

                        <button
                            disabled={loading || !selectedPayer || !status}
                            type="submit"
                            className="btn-modal-save d-flex align-items-center justify-content-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="spinner-border" role="status" style={{ width: '20px', height: '20px' }}></div>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-journal-text" style={{ fontSize: '0.85rem' }}></i>
                                    Show Ledgers
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GenerateInvoiceModal1;