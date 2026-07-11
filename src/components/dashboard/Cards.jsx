import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import '../../styles/common/cards.scss';

function Cards({ cardNumber, cardTitle }) {
    return (
        <div className="stat-card d-flex flex-column position-relative overflow-hidden">
            <div className="stat-header  d-flex justify-content-between align-items-start mb-3 position-relative z-1">
                <h4 className='fw-medium'>{cardTitle}</h4>
                <div className="icon-wrapper d-flex align-items-center justify-content-center">
                    {
                        cardNumber === 1 ? (
                            <i className="bi bi-piggy-bank"></i>
                        ) : cardNumber === 2 ? (
                            <i className="bi bi-exclamation-circle"></i>
                        ) : (
                            <i className="bi bi-wallet2"></i>
                        )
                    }
                </div>
            </div>
            <div className="stat-body position-relative d-flex align-items-end justify-content-between z-1">
                {
                    cardNumber === 1 ? (
                        <div className="stat-value lh-1 fw-bold fs-2">₹45,230</div>
                    ) : cardNumber === 2 ? (
                        <div className="stat-value lh-1 fw-bold fs-2">4</div>
                    ) : (
                        <div className="stat-value lh-1 fw-bold fs-2">₹12,500</div>
                    )
                }

                {
                    cardNumber === 1 ? (
                        <div className="stat-trend d-flex align-items-center fw-medium gap-1 py-1 px-2 rounded-pill positive">
                            <i className="bi bi-arrow-up-short"></i> 12%
                        </div>
                    ) : cardNumber === 2 ? (
                        <div className="stat-trend d-flex align-items-center fw-medium gap-1 py-1 px-2 rounded-pill neutral">
                            <i className="bi bi-dash"></i> 0%
                        </div>
                    ) : (
                        <div className="stat-trend d-flex align-items-center fw-medium gap-1 py-1 px-2 rounded-pill negative">
                            <i className="bi bi-arrow-down-short"></i> 4%
                        </div>
                    )
                }

            </div>
        </div>
    );
}

export default Cards;