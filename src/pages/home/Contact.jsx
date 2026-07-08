function Contact() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    }
    
    return (
        <section id="contact" className="section my-0 mx-auto pt-0">
            <h2>Get in touch.</h2>
            <p className='mb-4'>Questions about the platform or need to report an issue? Drop us a line.</p>

            <form className="contact-form py-5 px-4 p-sm-5" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="text" placeholder="Full Name" />
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Email Address" />
                </div>
                <div className="form-group">
                    <textarea placeholder="How can we help?"></textarea>
                </div>
                <button type="submit" className="cta-button"> <i className="bi bi-send"></i> Send Message </button>
            </form>
        </section>
    );
}

export default Contact;