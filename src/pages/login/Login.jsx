import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import EmailPage from './EmailPage.jsx'
import OtpPage from './OtpPage.jsx';

import '../../styles/login.scss';

function Login() {
    const [pageDisplay, setPageDisplay] = useState(false);
    const [email, setEmail] = useState('');

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

                <EmailPage display={pageDisplay} setDisplay={setPageDisplay} email={email} setEmail={setEmail} />

                <OtpPage display={pageDisplay} setDisplay={setPageDisplay} />
            </section>
        </main>
    );
}

export default Login;