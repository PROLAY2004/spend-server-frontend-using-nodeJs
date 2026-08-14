import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Adjust this import based on your actual generic ledger edit API function
import updateRecord from '../../pages/payers/editPayerRecord.js';
import ModalHeader from './common/ModalHeader.jsx';
import ModalFooter from './common/ModalFooter.jsx';
import '../../styles/common/modal.scss';

const EditLedgerModal = ({ isOpen, onClose, pageRefresh, recordData, payersList = [] }) => {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const recordDetails = {
        date: new Date().toISOString().split('T')[0],
        category: '',
        payerId: '',
        originalAmount: '',
        spendAmount: '',
        dueAmount: '',
        status: '',
        description: '',
    };

    const [formData, setFormData] = useState(recordDetails);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [payerSearchTerm, setPayerSearchTerm] = useState('');

    // Hydrate form data when recordData or modal state changes[cite: 9]
    useEffect(() => {
        if (recordData && isOpen) {
            const date = new Date(recordData.date);

            const formattedDate =
                date.getFullYear() +
                "-" +
                String(date.getMonth() + 1).padStart(2, "0") +
                "-" +
                String(date.getDate()).padStart(2, "0");

            // Handle payerId whether it's an object (populated) or string
            const currentPayerId = typeof recordData.payerId === 'object' ? recordData.payerId._id : recordData.payerId;

            setFormData({
                date: formattedDate || new Date().toISOString().split('T')[0],
                category: recordData.category || '',
                payerId: currentPayerId || '',
                originalAmount: recordData.originalAmount ?? '',
                spendAmount: recordData.spendAmount ?? '',
                dueAmount: recordData.dueAmount ?? '',
                status: recordData.status || '',
                description: recordData.description || '',
            });

            // Set the search term text based on the matched payer
            const selectedPayer = payersList.find(p => p._id === currentPayerId);
            if (selectedPayer) {
                setPayerSearchTerm(selectedPayer.name);
            } else if (recordData.payerName) {
                setPayerSearchTerm(recordData.payerName);
            } else {
                setPayerSearchTerm('');
            }
        }
    }, [recordData, isOpen, payersList]);

    // Handle clicking outside the payer dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);

                // Revert text if a valid payer is already selected, else clear it
                const selectedPayer = payersList.find(p => p._id === formData.payerId);
                if (selectedPayer) {
                    setPayerSearchTerm(selectedPayer.name);
                } else {
                    setPayerSearchTerm('');
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [formData.payerId, payersList]);

    if (!isOpen) return null;

    // Filter payers based on search input
    const filteredPayers = payersList.filter(payer =>
        payer.name.toLowerCase().includes(payerSearchTerm.toLowerCase()) ||
        payer.mobile.includes(payerSearchTerm)
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "date" && !value ? new Date().toISOString().split("T")[0] : value,
        }));
    };

    const resetModalState = () => {
        setFormData(recordDetails);
        setPayerSearchTerm('');
        setIsDropdownOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isSuccess = await updateRecord(navigate, toast, recordData._id, formData);

        if (isSuccess) {
            onClose();
            resetModalState();
            pageRefresh((prev) => prev + 1);
        }

        setLoading(false);
    };

    return (
        <div className="modal-overlay position-fixed d-flex justify-content-center align-items-center">
            <div className="modal-container w-100 position-relative">
                <ModalHeader
                    modalIcon={<i className="bi bi-pencil-square"></i>}
                    modalName={'Edit Record'}
                    onClose={() => {
                        if (loading) return;
                        onClose();
                        resetModalState();
                    }}
                />

                <form className="modal-body" onSubmit={handleSubmit}>
                    <div className="row g-2">
                        {/* Searchable Payer Dropdown */}
                        <div className="col-12 form-group" ref={dropdownRef}>
                            <label className="form-label fs-xs fw-medium mb-1 text-uppercase">Select Payer</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3 icon-text"></i>
                                <input
                                    type="text"
                                    className="custom-input form-control shadow-none ps-5 pe-5"
                                    placeholder="Search by name or mobile..."
                                    value={payerSearchTerm}
                                    onChange={(e) => {
                                        setPayerSearchTerm(e.target.value);
                                        // Clear selection if user starts typing a new name
                                        if (formData.payerId) {
                                            setFormData(prev => ({ ...prev, payerId: '' }));
                                        }
                                        setIsDropdownOpen(true);
                                    }}
                                    onFocus={() => setIsDropdownOpen(true)}
                                    autoComplete="off"
                                />
                                {formData.payerId && (
                                    <i className="bi bi-check-circle-fill text-success position-absolute top-50 end-0 translate-middle-y me-3"></i>
                                )}

                                {/* Dropdown List */}
                                {isDropdownOpen && (
                                    <div className="search-dropdown modal-search-dropdown position-absolute w-100 mt-1 rounded-2 shadow-lg overflow-hidden d-flex flex-column">
                                        <div className="dropdown-options overflow-auto" style={{ maxHeight: '180px' }}>
                                            {filteredPayers.length > 0 ? (
                                                filteredPayers.map(payer => (
                                                    <div
                                                        key={payer._id}
                                                        className="dropdown-payer-info px-3 py-2 text-white d-flex justify-content-between align-items-center"
                                                        onMouseDown={() => {
                                                            setFormData(prev => ({ ...prev, payerId: payer._id }));
                                                            setPayerSearchTerm(payer.name);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <span className="fw-medium">{payer.name}</span>
                                                        <span className="icon-text fs-xs">{payer.mobile}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="dropdown-payer-info p-3 icon-text text-center">
                                                    No Payers Found
                                                </div>
                                            )}
                                        </div>

                                        <div className="add-payer-action p-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                            <button
                                                type="button"
                                                className="btn w-100 d-flex justify-content-center align-items-center gap-2"
                                                style={{
                                                    background: 'rgba(124, 58, 237, 0.1)',
                                                    color: '#c4b5fd',
                                                    border: '1px dashed rgba(124, 58, 237, 0.4)',
                                                    fontSize: '0.85rem'
                                                }}
                                                onMouseDown={() => {
                                                    console.log("Trigger add payer flow");
                                                }}
                                            >
                                                <i className="bi bi-person-plus"></i>
                                                <span className="fw-medium">Add New Payer</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date */}
                        <div className="col-12 col-sm-6 form-group">
                            <label className="form-label fs-xs fw-medium mb-1 text-uppercase">Date</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-calendar3 position-absolute top-50 start-0 translate-middle-y ms-3 icon-text"></i>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="custom-input text-uppercase form-control shadow-none ps-5"
                                    required
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="col-12 col-sm-6 form-group">
                            <label className="form-label fs-xs fw-medium mb-1 text-uppercase">Category</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-tags position-absolute top-50 start-0 translate-middle-y ms-3 icon-text"></i>
                                <select
                                    className="custom-input form-select shadow-none ps-5"
                                    value={formData.category}
                                    name='category'
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Category</option>
                                    <option value="Bills & Utilities">Bills & Utilities</option>
                                    <option value="Food & Dining">Food & Dining</option>
                                    <option value="Medicine & Healthcare">Medicine & Healthcare</option>
                                    <option value="Money Transfer">Money Transfer</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Travel & Transport">Travel & Transport</option>
                                    <option value="Income or Cashback">Income or Cashback</option>
                                    <option value="Fuel">Fuel</option>
                                    <option value="Grocerry">Grocerry</option>
                                    <option value="Entertelment & Subscription">Entertelment & Subscription</option>
                                    <option value="Investment">Investment</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                        </div>

                        {/* Spend Amount */}
                        <div className="col-12 col-sm-6 form-group">
                            <label className="form-label fs-xs fw-medium mb-1 text-uppercase">Spend Amt</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-currency-rupee position-absolute top-50 start-0 translate-middle-y ms-3 icon-text"></i>
                                <input
                                    type="text"
                                    className="custom-input form-control shadow-none ps-5"
                                    placeholder="0.00"
                                    name='spendAmount'
                                    value={formData.spendAmount}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Original Amount */}
                        <div className="col-12 col-sm-6 form-group">
                            <label className="form-label fs-xs fw-medium mb-1 text-uppercase">Original Amt</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-currency-rupee position-absolute top-50 start-0 translate-middle-y ms-3 icon-text"></i>
                                <input
                                    type="text"
                                    className="custom-input form-control shadow-none ps-5"
                                    placeholder="0.00"
                                    name='originalAmount'
                                    value={formData.originalAmount}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Due Amount */}
                        <div className="col-12 col-sm-6 form-group">
                            <label className="form-label fs-xs fw-medium mb-1 text-uppercase">Due Amt</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-currency-rupee position-absolute top-50 start-0 translate-middle-y ms-3 icon-text"></i>
                                <input
                                    type="text"
                                    className="custom-input form-control shadow-none ps-5"
                                    placeholder="0.00"
                                    name='dueAmount'
                                    value={formData.dueAmount}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="col-12 col-sm-6 form-group">
                            <label className="form-label fs-xs fw-medium mb-1 text-uppercase">Status</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-check2-circle position-absolute top-50 start-0 translate-middle-y ms-3 icon-text"></i>
                                <select
                                    className="custom-input form-select shadow-none ps-5"
                                    name='status'
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Status</option>
                                    <option value="paid">Paid</option>
                                    <option value="non-paid">Non-Paid</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="col-12 form-group">
                            <label className="form-label fs-xs fw-medium mb-1 text-uppercase">Description</label>
                            <div className="input-wrapper position-relative">
                                <i className="bi bi-list-columns-reverse position-absolute top-0 start-0 ms-3 mt-3 icon-text"></i>
                                <textarea
                                    className="custom-input form-control shadow-none ps-5 pt-3"
                                    placeholder="Enter ledger details or notes..."
                                    rows="3"
                                    value={formData.description}
                                    name='description'
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <ModalFooter
                        onClose={() => {
                            if (loading) return;
                            onClose();
                            resetModalState();
                        }}
                        isDisabled={loading}
                        iconText={'check-circle'}
                        btnName={'Update Ledger'}
                        loading={loading}
                        loadingName={'Updating'}
                    />
                </form>
            </div>
        </div>
    );
};

export default EditLedgerModal;