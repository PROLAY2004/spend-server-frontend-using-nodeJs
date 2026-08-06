import React, { useState, useRef, useEffect } from 'react';

export default function LedgersControl({
    filters,
    payersList,
    setFilters,
    setCurrentPage
}) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [payerSearchTerm, setPayerSearchTerm] = useState(filters.selectedPayer?.name || '');
    const dropdownRef = useRef(null);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);

                // Optional UI Fix: If the user clicks outside without selecting a new payer, 
                // revert the text back to the currently selected payer (or clear it).
                if (filters.selectedPayer) {
                    setPayerSearchTerm(filters.selectedPayer.name);
                } else {
                    setPayerSearchTerm('');
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [filters.selectedPayer]); // Added dependency to keep track of current selection

    // --- 1. ADD LOCAL FILTERING BACK ---
    const filteredPayers = payersList.filter(payer =>
        payer.name.toLowerCase().includes(payerSearchTerm.toLowerCase()) ||
        payer.mobile.includes(payerSearchTerm)
    );

    return (
        <div className="controls-bar mb-4 w-100">
            <div className="row g-2">
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="search-wrapper position-relative w-100">
                        <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-lighter"></i>
                        <input
                            type="text"
                            className="custom-input form-control shadow-none ps-5 py-2 pe-3 w-100"
                            placeholder="Search ledgers by category or amount..."
                            value={filters.searchQuery}
                            style={{ minWidth: 0 }}
                            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-md-6 col-xl-3">
                    <div className="position-relative w-100" ref={dropdownRef}>
                        <div className="input-wrapper position-relative h-100 w-100">
                            <i className="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3 text-lighter"></i>
                            <input
                                type="text"
                                className="custom-input form-control shadow-none ps-5 py-2 w-100"
                                placeholder="Filter by Payer..."
                                value={payerSearchTerm}
                                style={{ minWidth: 0 }}
                                onChange={(e) => {
                                    setPayerSearchTerm(e.target.value);

                                    // --- 2. PREVENT UNNECESSARY BACKEND REFETCHES ---
                                    // Only clear the global filter if one was already selected.
                                    // This stops the page from reloading on every keystroke.
                                    if (filters.selectedPayer !== null) {
                                        handleFilterChange('selectedPayer', null);
                                    }

                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                            />
                            {filters.selectedPayer && (
                                <i
                                    className="bi bi-x-circle position-absolute top-50 end-0 translate-middle-y me-3 text-lighter"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        handleFilterChange('selectedPayer', null);
                                        setPayerSearchTerm('');
                                    }}
                                ></i>
                            )}
                        </div>

                        {isDropdownOpen && (
                            <div className="ledger-filter-dropdown position-absolute w-100 mt-1 rounded-2 shadow-lg overflow-auto">
                                {/* --- 3. USE filteredPayers INSTEAD OF payersList --- */}
                                {filteredPayers.length > 0 ? (
                                    filteredPayers.map(payer => (
                                        <div
                                            key={payer._id}
                                            className="ledger-filter-dropdown-list px-3 py-2 text-white"
                                            onMouseDown={() => {
                                                // Selecting a name updates the full page data
                                                handleFilterChange('selectedPayer', payer);
                                                setPayerSearchTerm(payer.name);
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            <div className="d-flex justify-content-between">
                                                <span>{payer.name}</span>
                                                <span className="icon-text">{payer.mobile}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="ledger-filter-dropdown-list p-3 icon-text text-center">
                                        No Payers Found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-md-4 col-xl-2">
                    <select
                        className="custom-select py-2 form-select shadow-none w-100"
                        value={filters.statusFilter}
                        style={{ minWidth: 0 }}
                        onChange={(e) => handleFilterChange('statusFilter', e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Non-Paid">Non-Paid</option>
                    </select>
                </div>

                <div className="col-12 col-md-8 col-xl-3">
                    <div className="d-flex align-items-center gap-1 w-100">
                        <input
                            type="date"
                            className="custom-input shadow-none py-2 px-2 w-100"
                            title="From Date"
                            value={filters.dateFrom}
                            style={{ minWidth: 0, flex: '1 1 auto' }}
                            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                        />
                        <span className="icon-text fs-xs fw-medium px-1">TO</span>
                        <input
                            type="date"
                            className="custom-input shadow-none py-2 px-2 w-100"
                            title="To Date"
                            value={filters.dateTo}
                            style={{ minWidth: 0, flex: '1 1 auto' }}
                            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}