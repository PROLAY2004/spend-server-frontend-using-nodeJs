import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import isAuthenticated from '../../utils/checkAuth.js';
import Navbar from '../../components/common/Navbar.jsx';
import Footer from '../../components/common/Footer.jsx';
import Contact from './Contact.jsx';

import '../../styles/home.scss';

function Home() {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

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
            <Navbar 
                isAuthenticated={isUserAuthenticated} 
                setIsUserAuthenticated={setIsUserAuthenticated} 
                activeSection={activeSection} 
                isMobileMenuOpen={isMobileMenuOpen} 
                setIsMobileMenuOpen={setIsMobileMenuOpen} 
                scrollToSection={scrollToSection} 
            />

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

                <Contact />
            </main>

            <Footer scrollToSection={scrollToSection} />
        </>
    );
}

export default Home;