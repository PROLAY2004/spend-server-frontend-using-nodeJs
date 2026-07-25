function EmptyCard({ isActive }) {
    return (
        <div className={isActive ? "payer-card empty-state-card d-flex flex-column align-items-center justify-content-center text-center p-5 position-relative" : "d-none"}>
            <div className="empty-icon position-relative mb-3">
                <i
                    className="bi bi-search"
                    style={{ fontSize: '2.5rem', opacity: '0.6' }}
                ></i>
            </div>

            <h4 className="text-white fw-medium fs-5 position-relative">No Results Found</h4>

            <p className="pagination-text mb-0 position-relative" style={{ fontSize: '0.85rem', maxWidth: '400px' }}>
                We couldn't find any records matching your search or filter criteria. Try adjusting your filters or add new one.
            </p>
        </div>
    );
}

export default EmptyCard;