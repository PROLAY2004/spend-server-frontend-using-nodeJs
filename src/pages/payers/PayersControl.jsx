function PayersControl({
    searchQuery,
    setSearchQuery,
    setCurrentPage,
    filterOption,
    setFilterOption,
    sortOption,
    setSortOption
}) {
    return (
        <div className="controls-bar d-flex flex-column flex-md-row justify-content-between gap-2 mb-4 w-100">
            <div className="search-wrapper position-relative flex-grow-1">
                <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-lighter"></i>
                <input
                    type="text"
                    className="custom-input form-control shadow-none ps-5 py-2 pe-3"
                    placeholder="Search by name or contact..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // Reset to page 1 on new search
                    }}
                />
            </div>

            <div className="filters-wrapper d-flex gap-2">
                <select
                    className="custom-select py-2 w-100 form-select shadow-none"
                    value={filterOption}
                    onChange={(e) => {
                        setFilterOption(e.target.value);
                        setCurrentPage(1); // Reset to page 1 on filter change
                    }}
                >
                    <option value="All">All Payers</option>
                    <option value="Paid">All Paid</option>
                    <option value="Non-Paid">Due Pending</option>
                </select>

                <select
                    className="custom-select py-2 w-100 form-select shadow-none"
                    value={sortOption}
                    onChange={(e) => {
                        setSortOption(e.target.value);
                        setCurrentPage(1); // Reset to page 1 on sort change
                    }}
                >
                    <option value="Newest First">Newest First</option>
                    <option value="Name A-Z">Name: A→Z</option>
                    <option value="Name Z-A">Name: Z→A</option>
                    <option value="Due: High to Low">Due: High to Low</option>
                    <option value="Due: Low to High">Due: Low to High</option>
                </select>
            </div>
        </div>
    );
}

export default PayersControl;