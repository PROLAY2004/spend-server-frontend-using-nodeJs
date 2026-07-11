import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import logout from '../../utils/logout.js';
import '../../styles/sidebar.scss';

function Sidebar({ isMobileOpen, sidebarRef }) {
    return (
        <>
            <div className={`sidebar-overlay ${isMobileOpen ? 'active' : ''}`} onClick={() => setIsMobileOpen(false)}></div>

            <aside className={`sidebar d-flex flex-column flex-shrink-0 h-100 ${isMobileOpen ? 'mobile-open' : ''}`} ref={sidebarRef}>
                {/* Top Section - Fixed */}
                <div className="sidebar-header-fixed flex-shrink-0 pb-3">
                    <div className="brand text-center py-4 px-3">
                        <h2 className='fw-bold'><span className='d-block d-sm-none d-lg-block'>Spend Server</span></h2>
                    </div>
                    <div className="user-profile-sidebar justify-content-sm-center justify-content-lg-start d-flex align-items-center py-0 px-4 gap-3 gap-sm-0 gap-lg-3">
                        <div className="avatar rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                            <i className="bi bi-person"></i>
                        </div>
                        <div className="user-info overflow-hidden">
                            <div className="name fw-semibold">John Doe</div>
                            <div className="email">johndoe@example.com</div>
                        </div>
                    </div>
                </div>

                {/* Middle Section - Scrollable */}
                <nav className="nav-links-scrollable flex-grow-1 overflow-auto overflow-x-hidden p-3 d-flex flex-column gap-2">
                    <Link to="/dashboard" className="active">
                        <i className="bi bi-grid-1x2-fill"></i>
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/ledger">
                        <i className="bi bi-journal-richtext"></i>
                        <span>Ledger</span>
                    </Link>
                    <Link to="/manage-records">
                        <i className="bi bi-folder2-open"></i>
                        <span>Manage Records</span>
                    </Link>
                    <Link to="/invoices">
                        <i className="bi bi-receipt"></i>
                        <span>Invoices</span>
                    </Link>
                    <Link to="/documents">
                        <i className="bi bi-file-earmark-text"></i>
                        <span>Documents</span>
                    </Link>
                </nav>

                {/* Bottom Section - Fixed */}
                <div className="sidebar-bottom-fixed flex-shrink-0 pt-3 pb-3 px-2">
                    <button className="logout-btn w-100 d-flex align-items-center gap-1 bg-transparent border-0 fw-semibold cursur-pointer text-nowrap">
                        <i className="bi bi-box-arrow-right d-flex justify-content-center"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;