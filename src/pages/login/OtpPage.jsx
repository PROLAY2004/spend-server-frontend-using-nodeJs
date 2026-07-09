function OtpPage({ display, setDisplay }) {
    return (
        <div className={display ? 'login w-100 py-5 px-4 px-sm-5 d-flex flex-column position-relative' : 'd-none'} >
            <div className="welcome-container">
                <h3 className='fs-4 fw-bold mb-3'>OTP Verification</h3>
                <p className="subtext mb-3">We've sent a verification code to your email address</p>
            </div>

            <form className="auth-htmlForm w-100 d-flex flex-column position-relative z-1 gap-4">
                <div className="htmlForm-group d-flex flex-column gap-2">
                    <label htmlFor="otp" className='fw-semibold'>Enter 6 Digit Code</label>
                    <div className="input-group position-relative d-flex align-items-center">
                        <i className="bi bi-key position-absolute"></i>
                        <input type="text" className='w-100' placeholder="123456" />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check-circle"></i> Verify & Continue
                </button>

                <div className="resend-container">
                    <p>Didn’t receive the code? <a href="/Auth/Login/">Resend</a></p>
                    <p className="timer">00:30</p>
                </div>
            </form>
        </div>
    );
}

export default OtpPage;