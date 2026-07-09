import { useState } from 'react';
import { toast } from 'react-toastify';

import sendOtp from './sendOtp.js';

function EmailPage({ display, setDisplay, email, setEmail }) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isSuccess = await sendOtp(toast, email);

        setLoading(false);

        if (isSuccess) {
            setDisplay(true);
        }
    }

    return (
        <div className={display ? 'd-none' : 'login w-100 py-5 px-4 px-sm-5 flex-column position-relative d-flex'}>
            <div className="welcome-container">
                <h3 className='fs-4 fw-bold mb-3'>Welcome Back!</h3>
                <p className="subtext mb-3">Sign in to access your dashboard and continue managing your expenses.</p>
            </div>

            <form className="auth-htmlForm w-100 d-flex flex-column position-relative z-1 gap-4" onSubmit={handleSubmit}>
                <div className="htmlForm-group d-flex flex-column gap-2">
                    <label htmlFor="email" className='fw-semibold'>Email Address</label>
                    <div className="input-group position-relative d-flex align-items-center">
                        <i className="bi bi-envelope position-absolute"></i>
                        {loading ? (
                            <input type="text" className='w-100' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" readOnly />
                        ) : (
                                <input type="text" className='w-100' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                        )}

                    </div>
                </div>

                <button disabled={loading} type="submit" className="btn btn-primary position-relative d-flex align-items-center justify-content-center gap-2 overflow-hidden border-0">
                    {loading ? (
                        <>
                            <div
                                className="spinner-border"
                                role="status"
                                style={{ width: '20px', height: '20px' }}></div>
                            Signing In ...
                        </>
                    ) : (
                        <>
                            < i className="bi bi-box-arrow-in-right"></i>
                            Sign In
                        </>
                    )}
                </button>

                <div className="divider d-flex align-items-center position-relative">
                    <span>Or continue with</span>
                </div>

                <button type="button" className="btn btn-google">
                    <i className="bi bi-google"></i> Google
                </button>
            </form>
        </div >
    );
}

export default EmailPage;