import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import sendOtp from "./sendOtp.js";
import login from "./userLogin.js";

function OtpPage({ display, setDisplay, email }) {
    const navigate = useNavigate();
    const OTP_TIME = 120; // 2 minutes

    const [timeLeft, setTimeLeft] = useState(OTP_TIME);
    const [canResend, setCanResend] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [btnText, setBtnText] = useState('Resend OTP');

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const seconds = String(timeLeft % 60).padStart(2, "0");

    useEffect(() => {
        if (display) {
            setTimeLeft(OTP_TIME);
            setCanResend(false);
        }
    }, [display]);

    useEffect(() => {
        if (!display) return;

        if (timeLeft === 0) {
            setCanResend(true);
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, display]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isLoggedIn = await login(toast, { email, otp });

        setLoading(false);

        if (isLoggedIn) {
            const redirectPath = localStorage.getItem('postLoginRedirect') || '/dashboard';
            localStorage.removeItem('postLoginRedirect');
            navigate(redirectPath, { replace: true });
        }
    }

    const handleResend = async () => {
        setBtnText('Please Wait...');

        const isSuccess = await sendOtp(toast, email);

        setBtnText('Resend Otp');

        if (isSuccess) {
            setCanResend(false);
            setTimeLeft(OTP_TIME);
        }
    };

    return (
        <div className={display ? 'login w-100 py-5 px-4 px-sm-5 d-flex flex-column position-relative' : 'd-none'} >
            <div className="welcome-container">
                <h3 className='fs-4 fw-bold mb-3'>OTP Verification</h3>
                <p className="subtext mb-3">We've sent a verification code to your email address. Check spam section also for the code.</p>
            </div>

            <form className="auth-htmlForm w-100 d-flex flex-column position-relative z-1 gap-4" onSubmit={handleSubmit}>
                <div className="htmlForm-group d-flex flex-column gap-2">
                    <label className='fw-semibold'>Enter 6 Digit Code</label>
                    <div className="input-group position-relative d-flex align-items-center">
                        <i className="bi bi-key position-absolute"></i>
                        {loading ? (
                            <input type="text" className='w-100' placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} readOnly />
                        ) : (
                                <input type="text" className='w-100' placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} />
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
                            Verifying...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-check-circle"></i>
                            Verify & Continue
                        </>
                    )}
                </button>

                <div className="resend-container">
                    <p className="mb-0">
                        Didn't receive the code?{" "}

                        {canResend ? (
                            <button
                                type="button"
                                className="resendBtn"
                                onClick={handleResend}
                            >
                                {btnText}
                            </button>
                        ) : (
                            <span className="timer">
                                {minutes}:{seconds}
                            </span>
                        )}
                    </p>
                </div>
            </form>
        </div>
    );
}

export default OtpPage;