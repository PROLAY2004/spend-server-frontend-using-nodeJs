import React, { useState, useRef, useEffect } from 'react';

export default function LedgersControl({
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    selectedPayer, setSelectedPayer,
    payersList, setCurrentPage
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [payerSearchTerm, setPayerSearchTerm] = useState(selectedPayer?.name || '');
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredPayers = payersList.filter(payer =>
        payer.name.toLowerCase().includes(payerSearchTerm.toLowerCase())
    );

    return (
        <div className="controls-bar d-flex flex-column flex-xl-row gap-2 mb-4 w-100">

            {/* Global Search */}
            <div className="search-wrapper position-relative flex-grow-1">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-lighter"></i>
                <input
                    type="text"
                    className="custom-input form-control shadow-none ps-5 py-2 pe-3"
                    placeholder="Search ledgers by category or amount..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <div className="filters-wrapper d-flex flex-column flex-md-row gap-2">

                {/* Searchable Payer Dropdown */}
                <div className="position-relative" ref={dropdownRef} style={{ minWidth: '200px' }}>
                    <div className="input-wrapper position-relative h-100">
                        <i className="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3 text-lighter"></i>
                        <input
                            type="text"
                            className="custom-input form-control shadow-none ps-5 py-2"
                            placeholder="Filter by Payer..."
                            value={payerSearchTerm}
                            onChange={(e) => {
                                setPayerSearchTerm(e.target.value);
                                setSelectedPayer(null); // Clear selection if typing
                                setCurrentPage(1);
                                setIsDropdownOpen(true);
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                        />
                        {/* Clear Selection Button */}
                        {selectedPayer && (
                            <i
                                className="bi bi-x-circle position-absolute top-50 end-0 translate-middle-y me-3 text-lighter"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    setSelectedPayer(null);
                                    setPayerSearchTerm('');
                                    setCurrentPage(1);
                                }}
                            ></i>
                        )}
                    </div>

                    {isDropdownOpen && (
                        <div
                            className="position-absolute w-100 mt-1 rounded-2 shadow-lg overflow-hidden"
                            style={{
                                background: '#111',
                                border: '1px solid rgba(255,255,255,0.08)',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                zIndex: 1050
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
                                            setPayerSearchTerm(payer.name);
                                            setIsDropdownOpen(false);
                                            setCurrentPage(1);
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.08)'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    >
                                        {payer.name}
                                    </div>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-muted text-center" style={{ fontSize: '0.85rem' }}>No payers found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Status Dropdown */}
                <select
                    className="custom-select py-2 form-select shadow-none"
                    style={{ minWidth: '140px' }}
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="All">All Status</option>
                    <option value="Paid">Paid</option>
                    <option value="Non-Paid">Non-Paid</option>
                </select>

                {/* Date Filters */}
                <div className="d-flex align-items-center gap-2">
                    <input
                        type="date"
                        className="custom-input form-control shadow-none py-2 px-3"
                        title="From Date"
                        value={dateFrom}
                        onChange={(e) => {
                            setDateFrom(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <span className="text-muted fs-xs fw-medium px-1">TO</span>
                    <input
                        type="date"
                        className="custom-input form-control shadow-none py-2 px-3"
                        title="To Date"
                        value={dateTo}
                        onChange={(e) => {
                            setDateTo(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}