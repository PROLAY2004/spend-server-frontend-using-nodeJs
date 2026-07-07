import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import isAuthenticated from '../../utils/checkAuth.js';
import logout from '../../utils/logout.js';
import '../../styles/home.scss';

function Home() {
    const navigate = useNavigate();

    // State to handle mobile menu toggle
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

    const handleLogout = () => {
        logout(toast);
        setIsUserAuthenticated(false);
    }

    const scrollToSection = (id) => {
        const section = document.getElementById(id);

        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }

        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        const sections = document.querySelectorAll("section");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id || 'home');
                    }
                });
            },
            {
                threshold: 0.6,
            }
        );

        sections.forEach((section) => observer.observe(section));
        setIsUserAuthenticated(isAuthenticated());

        return () => observer.disconnect();
    }, []);

    return (
        <>
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
                        {isUserAuthenticated ? (
                            <button className="signup btn fw-semibold" onClick={handleLogout}>Logout</button>
                        ) : (
                            <Link className="signup btn fw-semibold" to="/login">Sign In</Link>
                        )}
                    </div>
                </div>
            </nav>

            <main>
                <section id="home" className="hero d-flex align-items-center justify-content-center flex-column text-center position-relative overflow-hidden">
                    <span className="pill text-uppercase mb-4 fw-semibold py-2 px-3 d-inline-block">Finance Made Simple</span>
                    <h1 className='fw-bold'>Master your money.<br />Pixel by pixel.</h1>
                    <p className='fw-normal mb-5'>Effortlessly record your daily expenses, manage lend/borrow entries, and generate professional invoices — built with clean design and performance in mind.</p>
                    {isUserAuthenticated ? (
                        <Link className="cta-button px-4 py-3 fw-semibold btn" to="/dashboard">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <Link className="cta-button px-4 py-3 fw-semibold btn" to="/login">
                            Get Started for Free
                        </Link>
                    )}
                </section>

                <section id="about" className="section my-0 mx-auto">
                    <h2 className='fw-bold mb-3'>Everything you need.</h2>
                    <p>Spend Server replaces cluttered spreadsheets with a sleek, minimalist interface designed to give you instant clarity over your finances.</p>

                    <div className="features d-grid gap-4">
                        <div className="feature p-4 p-md-5">
                            <div className="icon-wrapper d-flex align-items-center justify-content-center mb-3"><i className="bi bi-wallet"></i></div>
                            <h3 className="fw-semibold mb-3">Expense Tracking</h3>
                            <p>Quickly record and categorize daily transactions with a highly responsive interface designed for speed.</p>
                        </div>
                        <div className="feature p-4 p-md-5">
                            <div className="icon-wrapper d-flex align-items-center justify-content-center mb-3"><i className="bi bi-journal-text"></i></div>
                            <h3 className="fw-semibold mb-3">Ledger Management</h3>
                            <p>Track peer-to-peer lending effortlessly. Automated reminders ensure you never lose track of a balance.</p>
                        </div>
                        <div className="feature p-4 p-md-5">
                            <div className="icon-wrapper d-flex align-items-center justify-content-center mb-3"><i className="bi bi-receipt"></i></div>
                            <h3 className="fw-semibold mb-3">Smart Invoicing</h3>
                            <p>Generate striking, professional invoices for freelance projects instantly, ready for client delivery.</p>
                        </div>
                    </div>
                </section>

                <section id="contact" className="section my-0 mx-auto pt-0">
                    <h2>Get in touch.</h2>
                    <p className='mb-4'>Questions about the platform or need to report an issue? Drop us a line.</p>

                    <form className="contact-form py-5 px-4 p-sm-5">
                        <div className="form-group">
                            <input type="text" name="Name" placeholder="Full Name" required />
                        </div>
                        <div className="form-group">
                            <input type="email" name="Email" placeholder="Email Address" required />
                        </div>
                        <div className="form-group">
                            <textarea placeholder="How can we help?" name="Msg" required></textarea>
                        </div>
                        <button type="submit" className="cta-button"> <i className="bi bi-send"></i> Send Message </button>
                    </form>
                </section>
            </main>

            <footer>
                <div className="footer-content d-grid my-0 mx-auto mb-4">
                    <div className="footer-logo">
                        <a href="#" className="logo">Spend Server.</a>
                        <p>A precision-crafted financial tracker enabling you to take full control of your expenses, lending, and invoicing within a highly secure, intuitive ecosystem.</p>
                    </div>
                    <div className="d-flex gap-5">
                        <div className="link-group w-100">
                            <h4>Platform</h4>
                            <a href="#home">Home</a>
                            <a href="#about">About</a>
                        </div>
                        <div className="link-group w-100">
                            <h4>Connect</h4>
                            <a href="mailto:SpendServer@gmail.com">Email</a>
                            <a href="#contact">Contact</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom d-flex justify-content-between align-items-center">
                    <p>&copy; 2026 Spend Server. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
}

export default Home;