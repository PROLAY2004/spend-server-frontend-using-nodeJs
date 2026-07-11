import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import '../../styles/common/header.scss';

function Header() {
    return (
        <header className="top-header d-flex align-items-center justify-content-between sticky-top z-2 p-3 px-md-4">
            <div className="header-left d-flex align-items-center">
                <button className="hamburger d-block d-sm-none bg-transparent border-0 cursur-pointer fs-3 me-3 me-sm-0 text-white" onClick={() => setIsMobileOpen(true)}>
                    <i className="bi bi-list"></i>
                </button>
                <div className="header-title-group">
                    <h1 className='fw-semibold mb-0'>Dashboard</h1>
                    <div className="breadcrumbs">
                        Home <span>/</span> <span className="current">Overview</span>
                    </div>
                </div>
            </div>
            <div className="header-right">
                <button className="btn cursur-pointer fw-medium export-btn d-flex align-items-center gap-2">
                    <i className="bi bi-cloud-download"></i>
                    Export
                </button>
            </div>
        </header>
    );
}

export default Header;