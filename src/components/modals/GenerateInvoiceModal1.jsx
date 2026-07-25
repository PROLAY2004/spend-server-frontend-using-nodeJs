import { useState, useEffect, useRef } from 'react';

import ModalHeader from './common/ModalHeader';
import ModalFooter from './common/ModalFooter';
import '../../styles/common/modal.scss';

const GenerateInvoiceModal1 = ({
    isOpen,
    onClose,
    payersList,
    form1Data,
    setForm1Data,
    fetchLedgerPage,
    setGenerateModal2
}) => {
    const { selectedPayer, status } = form1Data;

    const dropdownRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setForm1Data({
                selectedPayer: null,
                status: '',
            });
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

    const filteredPayers = payersList.filter(payer =>
        payer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setForm1Data(prev => ({
            ...prev,
            selectedPayer: null,
        }));
        setIsDropdownOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        const isSuccess = await fetchLedgerPage(1);

        if (isSuccess) {
            setGenerateModal2(true);
        }

        setLoading(false);
    }

    return (
        <div className="modal-overlay position-fixed d-flex justify-content-center align-items-center">
            <div className="modal-container w-100 position-relative overflow-hidden" style={{ overflow: 'visible' }}>
                <div className="modal-glow position-absolute rounded-circle"></div>

                <ModalHeader
                    modalIcon={<i className="bi bi-receipt"></i>}
                    modalName={'Generate Invoice'}
                    loading={loading}
                    onClose={() => {
                        if (loading) return;
                        onClose();
                    }}
                />

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
                                <div className="search-dropdown position-absolute w-100 mt-1 rounded-2 shadow-lg">
                                    {filteredPayers.length > 0 ? (
                                        filteredPayers.map(payer => (
                                            <div
                                                key={payer._id}
                                                className="dropdown-payer-info px-3 py-2 text-white"
                                                onMouseDown={() => {
                                                    setForm1Data(prev => ({
                                                        ...prev,
                                                        selectedPayer: payer,
                                                    }));
                                                    setSearchTerm(payer.name);
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                {payer.name}
                                                <small className="d-block icon-text" style={{ fontSize: '0.75rem' }}>{payer.mobile}</small>
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
                                onChange={(e) =>
                                    setForm1Data(prev => ({
                                        ...prev,
                                        status: e.target.value,
                                    }))
                                }
                                required
                            >
                                <option value="" disabled>Choose status...</option>
                                <option value="paid">Paid</option>
                                <option value="non-paid">Non-Paid</option>
                            </select>
                        </div>
                    </div>

                    <ModalFooter
                        onClose={() => {
                            if (loading) return;
                            onClose();
                        }}
                        isDisabled={loading || !status || !selectedPayer}
                        iconText={'journal-text'}
                        btnName={'Show Ledgers'}
                        loading={loading}
                        loadingName={'Loading'}
                    />
                </form>
            </div>
        </div>
    );
};

export default GenerateInvoiceModal1;