import { useState } from 'react';
import '../../styles/home.scss';

function Home() {
    // State to handle mobile menu toggle
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Close menu when a link is clicked
    const closeMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav>
                <a href="#" className="logo">Spend Server.</a>

                {/* Mobile Hamburger Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
                </button>

                {/* Nav Menu Wrapper */}
                <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                    <div className="nav-links">
                        <a href="#home" className="nav-link active" onClick={closeMenu}>Home</a>
                        <a href="#about" className="nav-link" onClick={closeMenu}>Features</a>
                        <a href="#contact" className="nav-link" onClick={closeMenu}>Contact</a>
                    </div>
                    <div className="auth-buttons">
                        <a className="signup" href="/Auth/Login/">Sign In</a>
                    </div>
                </div>
            </nav>

            <main>
                <section id="home" className="hero">
                    <span className="pill">Finance Made Simple</span>
                    <h1>Master your money.<br />Pixel by pixel.</h1>
                    <p>Effortlessly record your daily expenses, manage lend/borrow entries, and generate professional invoices — built with clean design and performance in mind.</p>
                    <div className="cta-group">
                        <a className="cta-button" href="/Dashboard/Home/{{id}}/">Go to Dashboard</a>
                    </div>
                </section>

                <section id="about" className="section">
                    <h2>Everything you need.</h2>
                    <p>Spend Server replaces cluttered spreadsheets with a sleek, minimalist interface designed to give you instant clarity over your finances.</p>

                    <div className="features">
                        <div className="feature">
                            <div className="icon-wrapper"><i className="bi bi-wallet"></i></div>
                            <h3>Expense Tracking</h3>
                            <p>Quickly record and categorize daily transactions with a highly responsive interface designed for speed.</p>
                        </div>
                        <div className="feature">
                            <div className="icon-wrapper"><i className="bi bi-journal-text"></i></div>
                            <h3>Ledger Management</h3>
                            <p>Track peer-to-peer lending effortlessly. Automated reminders ensure you never lose track of a balance.</p>
                        </div>
                        <div className="feature">
                            <div className="icon-wrapper"><i className="bi bi-receipt"></i></div>
                            <h3>Smart Invoicing</h3>
                            <p>Generate striking, professional invoices for freelance projects instantly, ready for client delivery.</p>
                        </div>
                    </div>
                </section>

                <section id="contact" className="section">
                    <h2>Get in touch.</h2>
                    <p>Questions about the platform or need to report an issue? Drop us a line.</p>

                    <form className="contact-form" method="post">
                        <div className="form-group">
                            <input type="text" name="Name" placeholder="Full Name" required />
                        </div>
                        <div className="form-group">
                            <input type="email" name="Email" placeholder="Email Address" required />
                        </div>
                        <div className="form-group">
                            <textarea placeholder="How can we help?" name="Msg" required></textarea>
                        </div>
                        <button type="submit" className="cta-button">Send Message</button>
                    </form>
                </section>
            </main>

            <footer>
                <div className="footer-content">
                    <div className="footer-logo">
                        <a href="#" className="logo">Spend Server.</a>
                        <p>A precision-crafted financial tracker enabling you to take full control of your expenses, lending, and invoicing within a highly secure, intuitive ecosystem.</p>
                    </div>
                    <div className="link-group">
                        <h4>Platform</h4>
                        <a href="#home">Home</a>
                        <a href="#about">About</a>
                    </div>
                    <div className="link-group">
                        <h4>Connect</h4>
                        <a href="mailto:SpendServer@gmail.com">Email</a>
                        <a href="#contact">Contact</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2026 Spend Server. All rights reserved.</p>
                    <p>Designed with precision.</p>
                </div>
            </footer>
        </>
    );
}

export default Home;