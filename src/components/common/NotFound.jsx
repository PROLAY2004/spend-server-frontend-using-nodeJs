import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

export default function NotFound() {
    const navigate = useNavigate();
    const sidebarRef = useRef(null);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="dashboard-wrapper d-flex h-100 overflow-hidden position-relative">
            <Sidebar isMobileOpen={isMobileOpen} sidebarRef={sidebarRef} setIsMobileOpen={setIsMobileOpen} />

            <main className="main-content d-flex flex-column h-100 flex-grow-1 overflow-auto overflow-x-hidden">
                <Header
                    setIsMobileOpen={setIsMobileOpen}
                    pageName={"Page Not Found"}
                    breadCrumb={"Error 404"}
                    btnIcon={
                        <>
                            <i className="bi bi-house-door"></i>
                            <span>Dashboard</span>
                        </>
                    }
                    btnFunc={() => navigate('/dashboard')} // Adjust route as needed
                />

                <div className="w-100 my-0 mx-auto p-3 p-md-4 d-flex flex-column h-100">

                    {/* Using the existing empty-state-card class to get the dot texture and ambient purple glow */}
                    <div className="empty-state-card rounded-4 d-flex flex-column align-items-center justify-content-center flex-grow-1 text-center p-4 position-relative border">

                        {/* Z-index is handled by the empty-state-card children styling */}
                        <div className="empty-icon mb-3">
                            <i className="bi bi-compass display-1"></i>
                        </div>

                        <h1
                            className="fw-bold mb-2"
                            style={{
                                fontSize: '6rem',
                                color: '#c4b5fd',
                                textShadow: '0 4px 24px rgba(124, 58, 237, 0.4)',
                                lineHeight: '1'
                            }}
                        >
                            404
                        </h1>

                        <h3 className="text-white fw-medium mb-3">Oops! You've lost your way.</h3>

                        <p className="icon-text mb-4" style={{ maxWidth: '420px', fontSize: '0.9rem' }}>
                            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                        </p>

                        <button
                            className="btn d-flex align-items-center gap-2 hover-lift fw-medium"
                            style={{
                                background: 'rgba(124, 58, 237, 0.15)',
                                color: '#c4b5fd',
                                border: '1px solid rgba(124, 58, 237, 0.4)',
                                padding: '0.65rem 1.5rem',
                                borderRadius: '8px'
                            }}
                            onClick={() => navigate('/dashboard')}
                        >
                            <i className="bi bi-arrow-left"></i>
                            Return to Dashboard
                        </button>

                    </div>
                </div>
            </main>
        </div>
    );
}