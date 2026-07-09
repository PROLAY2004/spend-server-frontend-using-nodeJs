import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import '../../styles/login.scss';

function Login() {
    return (
        <main className="login-container d-flex align-items-center justify-content-center">
            <section className="box d-flex overflow-hidden rounded shadow">
                <div className="content d-none d-lg-flex flex-column justify-content-between position-relative overflow-hidden w-100 p-5">
                    <div className="logo-container d-flex align-items-center mb-4 gap-2 position-relative z-1">
                        <h1 className='fw-bold'>Spend Server</h1>
                    </div>
                    <div className="hero-text position-relative z-1">
                        <h2 className='fw-semibold mb-2'>Smart Spending,<br />Simplified</h2>
                        <p className="mb-0">Track, analyze, and optimize your expenses with our powerful platform.</p>
                    </div>
                </div>
                <div className="login w-100 py-5 px-4 px-sm-5 d-flex flex-column position-relative d-none">
                    <div className="welcome-container">
                        <h3 className='fs-4 fw-bold mb-3'>Welcome Back!</h3>
                        <p className="subtext mb-3">Sign in to access your dashboard and continue managing your expenses.</p>
                    </div>

                    <form className="auth-form w-100 d-flex flex-column position-relative z-1 gap-4">
                        <div className="form-group d-flex flex-column gap-2">
                            <label for="email" className='fw-semibold'>Email Address</label>
                            <div className="input-group position-relative d-flex align-items-center">
                                <i className="bi bi-envelope position-absolute"></i>
                                <input type="text" className='w-100' placeholder="your@email.com" />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary position-relative d-flex align-items-center justify-content-center gap-2 overflow-hidden border-0">
                            <i class="bi bi-box-arrow-in-right"></i> Sign In
                        </button>

                        <div className="divider d-flex align-items-center position-relative">
                            <span>Or continue with</span>
                        </div>

                        <button type="button" className="btn btn-google" onclick="handleGoogleLogin()">
                            <i className="bi bi-google"></i> Google
                        </button>
                    </form>
                </div>

                <div class="login login w-100 py-5 px-4 px-sm-5 d-flex flex-column position-relative">
                    <div class="welcome-container">
                        <h3 className='fs-4 fw-bold mb-3'>OTP Verification</h3>
                        <p className="subtext mb-3">We've sent a verification code to your email address</p>
                    </div>

                    <form class="auth-form w-100 d-flex flex-column position-relative z-1 gap-4">
                        <div className="form-group d-flex flex-column gap-2">
                            <label for="otp" className='fw-semibold'>Enter 6 Digit Code</label>
                            <div className="input-group position-relative d-flex align-items-center">
                                <i className="bi bi-key position-absolute"></i>
                                <input type="text" className='w-100' placeholder="123456" />
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-circle"></i> Verify & Continue
                        </button>

                        <div class="resend-container">
                            <p>Didn’t receive the code? <a href="/Auth/Login/">Resend</a><p class="timer">00:30</p></p>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default Login;