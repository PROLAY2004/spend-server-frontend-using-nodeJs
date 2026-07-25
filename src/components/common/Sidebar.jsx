import { NavLink, replace, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import logout from '../../utils/logout.js';
import '../../styles/common/sidebar.scss';

function Sidebar({ isMobileOpen, sidebarRef, setIsMobileOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    
    return (
        <>
            <div className={`sidebar-overlay d-block d-sm-none top-0 start-0 end-0 bottom-0 position-fixed ${isMobileOpen ? 'active' : ''}`} onClick={() => setIsMobileOpen(false)}></div>

            <aside className={`sidebar position-fixed d-flex flex-column flex-shrink-0 h-100 ${isMobileOpen ? 'mobile-open' : ''}`} ref={sidebarRef}>
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
                            <div className="name fw-semibold">{localStorage.getItem('userName') || 'Guest User'}</div>
                            <div className="email">{localStorage.getItem('email')}</div>
                        </div>
                    </div>
                </div>

                {/* Middle Section - Scrollable */}
                <nav className="nav-links-scrollable flex-grow-1 overflow-auto overflow-x-hidden p-3 d-flex flex-column gap-2">
                    <div className={`side-links ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                        <i className="bi bi-grid-1x2-fill"></i>
                        <NavLink to="/dashboard">Dashboard</NavLink>
                    </div>

                    <div className={`side-links ${location.pathname === '/ledgers' ? 'active' : ''}`}>
                        <i className="bi bi-journal-richtext"></i>
                        <NavLink to="/ledgers">Ledgers</NavLink>
                    </div>

                    <div className={`side-links ${location.pathname === '/payers' ? 'active' : ''}`}>
                        <i className="bi bi-people"></i>
                        <NavLink to="/payers">Manage Payers</NavLink>
                    </div>

                    <div className={`side-links ${location.pathname === '/invoices' ? 'active' : ''}`}>
                        <i className="bi bi-receipt"></i>
                        <NavLink to="/invoices">Invoices</NavLink>
                    </div>

                    <div className={`side-links ${location.pathname === '/documents' ? 'active' : ''}`}>
                        <i className="bi bi-file-earmark-text"></i>
                        <NavLink to="/documents">Documents</NavLink>
                    </div>
                </nav>

                {/* Bottom Section - Fixed */}
                <div className="sidebar-bottom-fixed flex-shrink-0 pt-3 pb-3 px-2">
                    <button 
                        className="logout-btn w-100 d-flex align-items-center gap-1 bg-transparent border-0 fw-semibold cursur-pointer text-nowrap" 
                        onClick={() =>{ 
                            logout(toast);
                            navigate('/login', {replace : true})
                        }}
                    >
                        <i className="bi bi-box-arrow-right d-flex justify-content-center"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;