import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import logout from '../../utils/logout.js';

function Nav({ isAuthenticated, setIsUserAuthenticated, activeSection, isMobileMenuOpen, setIsMobileMenuOpen, scrollToSection }) {
        const handleLogout = () => {
        logout(toast);
        setIsUserAuthenticated(false);
    }

    return (
        <nav className="d-flex align-items-center justify-content-between position-fixed w-100 py-3 px-4 z-1">
            <Link to="/" className="logo fw-semibold">Spend Server.</Link>

            {/* Mobile Hamburger Toggle */}
            <button
                className="mobile-toggle d-block d-md-none bg-transparent border-0 cursor-pointer"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation"
            >
                <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
            </button>

            {/* Nav Menu Wrapper */}
            <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="nav-links d-flex gap-4">
                    <button
                        className={`nav-link ${activeSection === "home" ? "active" : ""}`}
                        onClick={() => scrollToSection("home")}
                    >
                        Home
                    </button>

                    <button
                        className={`nav-link ${activeSection === "about" ? "active" : ""}`}
                        onClick={() => scrollToSection("about")}
                    >
                        Features
                    </button>
                    <button
                        className={`nav-link ${activeSection === "contact" ? "active" : ""}`}
                        onClick={() => scrollToSection("contact")}
                    >
                        Contact
                    </button>
                </div>
                <div className="auth-buttons d-flex gap-3 align-items-center">
                    {isAuthenticated ? (
                        <button className="signup btn fw-semibold h-auto" onClick={handleLogout}>Logout</button>
                    ) : (
                            <Link className="signup btn fw-semibold h-auto" to="/login">Sign In</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Nav;