import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import downloadInvoice from '../invoices/downloadInvoice.js';
import pdfDownloader from '../../utils/invoiceDownloader.js';


export default function Header({ invoiceData }) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true)

        if (!invoiceData) {
            toast.error("No Invoice Available to Download");
            setIsDownloading(false);
        }

        const data = await downloadInvoice(invoiceData._id);

        if (data) {
            pdfDownloader(data);
        }

        setIsDownloading(false);
    }


    const handleShare = async () => {
        const url = window.location.href;
        await navigator.clipboard.writeText(url);

        toast.success("Link copied to Clipboard");
    }
    return (
        <header className="public-header d-flex justify-content-between align-items-center px-4 py-3">
            <Link className="brand d-flex align-items-center gap-1">
                <img src="/favicon.png" className="logo-image" alt="Logo" />
                <span className="fw-semibold text-white tracking-tight">Spend Server</span>
            </Link>

            <div className="d-flex align-items-center gap-2">
                <button
                    className="btn-public secondary d-flex align-items-center gap-2"
                    onClick={handleShare}
                >
                    <i className="bi bi-link-45deg"></i>
                    <span className="d-none d-sm-inline">Copy Link</span>
                </button>
                <button
                    className="btn-public primary d-flex align-items-center gap-2"
                    onClick={handleDownload}
                    disabled={isDownloading}
                >
                    {isDownloading ? (
                        <div className="spinner-border" role="status" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></div>
                    ) : (
                        <i className="bi bi-download"></i>
                    )}
                    <span className="d-none d-sm-inline">{isDownloading ? 'Preparing...' : 'Download PDF'}</span>
                </button>
            </div>
        </header>
    );
}