import { useState } from 'react';
import { toast } from 'react-toastify';

import sendResponse from './sendMessage.js';

function Contact() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const isSent = await sendResponse(toast, formData);

        setLoading(false);

        if (isSent) {
            setFormData({
                name: "",
                email: "",
                message: "",
            });
        }

    };

    return (
        <section id="contact" className="section my-0 mx-auto pt-0">
            <h2>Get in touch.</h2>
            <p className='mb-4'>Questions about the platform or need to report an issue? Drop us a line.</p>

            <form className="contact-form py-5 px-4 p-sm-5" onSubmit={handleSubmit} >
                <div className="form-group">
                    <input type="text" name='name' placeholder="Full Name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <input type="text" name='email' placeholder="Email Address" value={formData.email} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <textarea name='message' placeholder="How can we help?" value={formData.message} onChange={handleChange}></textarea>
                </div>
                <button disabled={loading} type="submit" className="cta-button">{loading ? (
                    <>
                        <div
                            className="spinner-border"
                            role="status"
                            style={{ width: '20px', height: '20px' }}></div>
                        Sending, Please wait...
                    </>
                ) : (
                    <i className="bi bi-send me-2"> Send Message</i>
                )}</button>


            </form>
        </section>
    );
}

export default Contact;