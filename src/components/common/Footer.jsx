function Footer({scrollToSection}) {
    return (
        <footer>
            <div className="footer-content d-grid my-0 mx-auto mb-4">
                <div className="footer-logo">
                    <a href="#" className="logo">Spend Server.</a>
                    <p>A precision-crafted financial tracker enabling you to take full control of your expenses, lending, and invoicing within a highly secure, intuitive ecosystem.</p>
                </div>
                <div className="d-flex gap-5">
                    <div className="link-group w-100">
                        <h4>Platform</h4>
                        <button
                            className="bg-transparent border-0  text-decoration-none cursor-pointer"
                            onClick={() => scrollToSection("home")}
                        >
                            Home
                        </button>
                        <button
                            className="bg-transparent border-0  text-decoration-none cursor-pointer"
                            onClick={() => scrollToSection("about")}
                        >
                            About
                        </button>
                    </div>
                    <div className="link-group w-100">
                        <h4>Connect</h4>
                        <a href="mailto:SpendServer@gmail.com">Email</a>
                        <button
                            className="bg-transparent border-0  text-decoration-none cursor-pointer"
                            onClick={() => scrollToSection("contact")}
                        >
                            Contact
                        </button>
                    </div>
                </div>
            </div>
            <div className="footer-bottom d-flex justify-content-between align-items-center">
                <p>&copy; 2026 Spend Server. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;