import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import AddressAutocomplete from './AddressAutocomplete';
import { loadGoogleScript, geocodePincode } from '../utils/googleMaps';
import axios from 'axios';
import { Printer, CheckCircle } from 'lucide-react';

const TRADE_FEES = {
    'ELECTRICIAN': 40000,
    'FITTER': 30000,
    'COPA': 15000,
    'WELDER': 18000,
    'DIESEL MECHANIC': 20000,
    'DCA': 11000,
    'PGDCA': 12000,
    'HSI': 28000,
    'HEALTH SANITARY INSPECTOR': 28000,
    'Health Sanitary Inspector': 28000
};

const getTradeFee = (trade) => {
    if (!trade) return '';
    return TRADE_FEES[trade] || TRADE_FEES[trade.toUpperCase()] || '';
};


const schoolsByBoard = {
    CBSE: [
        "Delhi Public School", "Kendriya Vidyalaya No.1", "Ryan International School",
        "St. Xavier's School", "DAV Public School", "Amity International School",
        "Blue Bells School", "Mount Abu School", "Sanskriti School", "Vasant Valley School"
    ],
    MPBSE: [
        "Govt. Excellence School Seoni", "Model High School Seoni", "Shri Sai Higher Secondary Seoni",
        "Jawahar Navodaya Vidyalaya Seoni", "Govt. Boys School Seoni", "Govt. Girls School Seoni",
        "Vivekanand School Seoni", "Saraswati Shishu Mandir Seoni", "Tagore Higher Secondary Seoni",
        "Gandhi School Seoni", "SGM Higher Secondary Seoni"
    ],
    ICSE: [
        "St. Joseph's Convent", "St. Mary's School", "Bishop Cotton School",
        "St. Paul's School", "Christ Church School", "St. John's School",
        "St. Helena's School"
    ],
    Other: [
        "National Institute of Open Schooling (NIOS)", "Private Candidate", "Madhyamik Shiksha Mandal"
    ],
};

function SchoolAutoSuggest({ board, value, onChange, name, placeholder, error }) {
    const [query, setQuery] = useState(value || "");
    const [showList, setShowList] = useState(false);
    const [focused, setFocused] = useState(false);

    const allSchools = schoolsByBoard[board] || [];

    const suggestions = focused && query.length >= 1 && board
        ? allSchools.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
        : [];

    const handleSelect = (school) => {
        setQuery(school);
        setShowList(false);
        onChange(school);
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        onChange(val);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setFocused(false);
            setShowList(false);
        }, 200);
    };

    return (
        <div style={{ position: "relative" }}>
            <input
                type="text"
                name={name}
                className="form-control"
                placeholder={placeholder || "School / College Name"}
                value={query}
                onChange={handleChange}
                onFocus={() => { setFocused(true); setShowList(true); }}
                onBlur={handleBlur}
                autoComplete="off"
            />
            {showList && suggestions.length > 0 && (
                <ul
                    style={{
                        position: "absolute", top: "100%", left: 0, right: 0, zIndex: 1000,
                        listStyle: "none", padding: 0, margin: 0, border: "1px solid #ccc",
                        background: "#fff", maxHeight: "180px", overflowY: "auto",
                        borderRadius: "0 0 6px 6px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                >
                    {suggestions.map((school) => (
                        <li
                            key={school}
                            onMouseDown={() => handleSelect(school)}
                            style={{
                                padding: "8px 12px", cursor: "pointer", fontSize: "13px",
                                borderBottom: "1px solid #f0f0f0"
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#f1f5f9"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#fff"}
                        >
                            {school}
                        </li>
                    ))}
                </ul>
            )}
            {error && <div className="text-danger small mt-1">{error}</div>}
        </div>
    );
}

export default function AdmissionForm() {
    const { t } = useLanguage();

    useEffect(() => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
        link.id = 'bootstrap-form-css';
        document.head.appendChild(link);
        return () => {
            const el = document.getElementById('bootstrap-form-css');
            if (el) el.remove();
        };
    }, []);

    useEffect(() => {
        const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (key && key !== "YOUR_API_KEY_HERE" && !window.google?.maps) {
            loadGoogleScript().catch(() => { });
        }
    }, []);

    const [savedData] = useState(() => {
        const draft = localStorage.getItem('itiFormDraft');
        if (!draft) return null;
        const parsed = JSON.parse(draft);
        ['photo', 'signature', 'tenthDocument', 'twelfthDocument', 'aadharDocument', 'samagraDocument', 'paymentReceipt'].forEach(k => {
            if (parsed[k] !== undefined && !(parsed[k] instanceof File)) {
                parsed[k] = null;
            }
        });
        return parsed;
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [submittedData, setSubmittedData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fileSizeErrors, setFileSizeErrors] = useState({});

    // Payment States
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('UPI');
    const [amountPaid, setAmountPaid] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
    const [paymentReceipt, setPaymentReceipt] = useState(null);
    const [paymentReceiptError, setPaymentReceiptError] = useState('');


    const FILE_LIMITS = {
        photo: { maxKB: 2048, label: 'Passport Photo' },
        signature: { maxKB: 2048, label: 'Signature' },
        aadharDocument: { maxKB: 2048, label: 'Aadhar Card' },
        samagraDocument: { maxKB: 2048, label: 'Samagra ID' },
        tenthDocument: { maxKB: 2048, label: '10th Marksheet' },
        twelfthDocument: { maxKB: 2048, label: '12th Marksheet' },
    };

    const handleFileChange = (e, fieldName, setFieldValue) => {
        const file = e.currentTarget.files[0];
        if (!file) return;
        const limit = FILE_LIMITS[fieldName];
        if (limit && file.size > limit.maxKB * 1024) {
            setFileSizeErrors(prev => ({ ...prev, [fieldName]: `File size must be under ${limit.maxKB / 1024} MB` }));
            e.target.value = '';
            return;
        }
        setFileSizeErrors(prev => ({ ...prev, [fieldName]: '' }));
        setFieldValue(fieldName, file);
    };

    const validationSchema = Yup.object({
        trade: Yup.string().required('Please select a trade'),
        fullName: Yup.string().required('Full Name is required'),
        fatherName: Yup.string().required('Father Name is required'),
        motherName: Yup.string().required('Mother Name is required'),
        aadharNo: Yup.string().matches(/^\d{12}$/, 'Aadhar must be exactly 12 digits').required('Aadhar is required'),
        samagraId: Yup.string().matches(/^\d{9}$/, 'Samagra ID must be exactly 9 digits').required('Samagra ID is required'),
        dob: Yup.date().required('Date of Birth is required'),
        religion: Yup.string().required('Religion is required'),
        mobile: Yup.string().matches(/^[6-9]\d{9}$/, 'Invalid mobile number').required('Mobile number is required'),
        email: Yup.string().email('Invalid email format').required('Email is required'),
        pin: Yup.string().matches(/^[0-9]{6}$/, 'Enter 6 digit Pin Code').required('Pin is required'),
        tenthBoard: Yup.string().required('10th Board name is required'),
        photo: Yup.mixed().required('Passport photo is required'),
        signature: Yup.mixed().required('Signature is required'),
        tenthDocument: Yup.mixed().required('10th Marksheet is required'),
        aadharDocument: Yup.mixed().required('Aadhar Card is required'),
        samagraDocument: Yup.mixed().required('Samagra ID is required')
    });

    const initialValues = savedData || {
        trade: '', fullName: '', fatherName: '', motherName: '', aadharNo: '', samagraId: '',
        dob: '', category: '', gender: '', religion: '',
        address: '', post: '', tehsil: '', distt: '', state: '', pin: '', mobile: '', parentMobile: '', whatsapp: '', email: '',
        tenthBoard: '', tenthSchool: '', tenthRollNo: '', tenthYear: '', tenthTotalMarks: '', tenthMarksObt: '',
        twelfthBoard: '', twelfthSchool: '', twelfthRollNo: '', twelfthYear: '', twelfthTotalMarks: '', twelfthMarksObt: '',
        photo: null, signature: null, tenthDocument: null, twelfthDocument: null, aadharDocument: null, samagraDocument: null,
        casteDocument: null, incomeDocument: null, domicileDocument: null
    };

    const handlePreview = (values) => {
        setPreviewData(values);
        setShowPreview(true);
    };

    const confirmAndSubmit = async () => {
        // Obsoleted by direct flow, but kept for compatibility
    };

    const submitPaymentAndForm = async () => {
        const utrTrimmed = (transactionId || "").trim();
        if (!utrTrimmed) {
            alert("Please enter the Transaction ID / UTR Number.");
            return;
        }
        if (paymentMethod === 'UPI' || paymentMethod === 'QR Code') {
            const upiRegex = /^\d{12}$/;
            if (!upiRegex.test(utrTrimmed)) {
                alert("UPI Transaction ID / UTR must be exactly 12 digits (numeric only).");
                return;
            }
        } else {
            const bankRegex = /^[a-zA-Z0-9]{12,22}$/;
            if (!bankRegex.test(utrTrimmed)) {
                alert("Bank Transfer Transaction ID / UTR must be alphanumeric and between 12 and 22 characters long.");
                return;
            }
        }
        if (!amountPaid) {
            alert("Please enter the Amount Paid.");
            return;
        }
        if (Number(amountPaid) < 0) {
            alert("Amount Paid cannot be negative.");
            return;
        }
        if (!paymentReceipt) {
            alert("Please upload the Payment Receipt / Screenshot.");
            return;
        }

        setShowPayment(false);
        setLoading(true);
        try {
            const fd = new FormData();
            Object.entries(previewData).forEach(([key, val]) => {
                if (val instanceof File) {
                    fd.append(key, val);
                } else if (val !== null && val !== undefined && val !== '' && typeof val !== 'object') {
                    fd.append(key, val);
                }
            });
            fd.append("paymentMethod", paymentMethod);
            fd.append("transactionId", transactionId);
            fd.append("amountPaid", amountPaid);
            fd.append("paymentDate", paymentDate);
            fd.append("paymentReceipt", paymentReceipt);

            const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admissions`, fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSubmittedData({
                ...previewData,
                id: res.data.id,
                paymentMethod,
                transactionId,
                amountPaid,
                paymentDate,
                courseFee: res.data.courseFee,
                outstandingBalance: res.data.outstandingBalance
            });
            setIsSubmitted(true);
            localStorage.removeItem('itiFormDraft');
        } catch (err) {
            alert("Submission failed: " + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
        window.scrollTo(0, 0);
    };


    const handleSaveDraft = (values) => {
        const safeValues = Object.fromEntries(
            Object.entries(values).filter(([_, v]) => !(v instanceof File))
        );
        localStorage.setItem('itiFormDraft', JSON.stringify(safeValues));
        alert('✅ Draft Saved! You can continue filling later from this device.');
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="print-wrapper">
            <style>{`
          /* === Reset Bootstrap interference on layout === */
          body { font-family: inherit !important; }
          address, article, aside, div, footer, form, h1, h2, h3, h4, h5, h6, header, hr, main, nav, p, pre, section { font-family: inherit !important; }
          a { color: inherit !important; text-decoration: none !important; }
          a:hover { color: inherit !important; }
          ul, ol { padding-left: 0 !important; margin: 0 !important; }
          li { margin: 0 !important; }
          button, input, select, textarea { font-family: inherit !important; }

          .bg-theme { background-color: #1e3a5f !important; color: #fff !important; }
          .text-theme { color: #1e3a5f !important; }
          .section-title {
            background-color: #1e3a5f; color: #ffffff; padding: 10px 15px; border-radius: 6px;
            font-size: 15px; font-weight: bold; margin-top: 35px; margin-bottom: 20px;
            text-transform: uppercase; border-left: 6px solid #f97316; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .form-label { font-weight: 600; color: #444; font-size: 13px; margin-bottom: 6px; }
          .form-control, .form-select { border-radius: 6px; border: 1px solid #ced4da; font-size: 14px; padding: 8px 12px; }
          .form-control:focus, .form-select:focus { border-color: #1e3a5f; box-shadow: 0 0 0 0.2rem rgba(30, 58, 95, 0.25); }
          .custom-card { border-radius: 12px; overflow: hidden; border: none; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .modal-header.bg-theme .btn-close { filter: brightness(0) invert(1); }
          .table-bordered th { background-color: #f1f5f9 !important; }
          @media print {
            @page { size: A4; margin: 10mm; }
            body { background-color: #fff !important; margin: 0; padding: 0; font-size: 11px !important; color: #000 !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .no-print { display: none !important; }
            .print-wrapper > *:not(.print-area):not(.no-print) { display: none !important; }
            .container { padding: 0 !important; width: 100% !important; max-width: 100% !important; margin: 0 !important; }
            .custom-card { box-shadow: none !important; border: 2px solid #1e3a5f !important; border-radius: 8px !important; }
            .card-body { padding: 15px !important; }
            .row { display: flex !important; flex-wrap: wrap !important; margin-left: -5px !important; margin-right: -5px !important; }
            .row > * { padding-left: 5px !important; padding-right: 5px !important; }
            .col-md-12 { width: 100% !important; flex: 0 0 100% !important; max-width: 100% !important; }
            .col-md-6 { width: 50% !important; flex: 0 0 50% !important; max-width: 50% !important; }
            .col-md-4 { width: 33.333% !important; flex: 0 0 33.333% !important; max-width: 33.333% !important; }
            .col-md-3 { width: 25% !important; flex: 0 0 25% !important; max-width: 25% !important; }
            .col-md-2 { width: 16.666% !important; flex: 0 0 16.666% !important; max-width: 16.666% !important; }
            .col-6 { width: 50% !important; flex: 0 0 50% !important; max-width: 50% !important; }
            input.form-control, select.form-select {
              border: none !important;
              border-bottom: 1px dotted #000 !important;
              border-radius: 0 !important;
              padding: 0 !important;
              height: 20px !important;
              font-size: 11px !important;
              background: transparent !important;
            }
            .form-label { font-size: 10px !important; margin-bottom: 2px !important; }
            .section-title {
              background-color: #1e3a5f !important; color: #fff !important;
              border-left: 6px solid #f97316 !important;
              margin-top: 15px !important; margin-bottom: 10px !important; padding: 5px 10px !important;
              font-size: 12px !important; box-shadow: none !important;
            }
            .table { margin-bottom: 10px !important; border-collapse: collapse !important; width: 100% !important; }
            .table-bordered th, .table-bordered td { border: 1px solid #333 !important; padding: 4px 6px !important; font-size: 11px !important; }
            .table-bordered th { background-color: #f0f0f0 !important; }
            .mt-5 { margin-top: 20px !important; }
            .mb-4, .mb-3 { margin-bottom: 8px !important; }
            .pt-5, .pt-4 { padding-top: 15px !important; }
          }
        `}</style>
            <div className="bg-theme py-2 px-4 no-print">
                <Link to="/" className="text-white text-decoration-none" style={{ opacity: 0.8 }}>{t.backToHome}</Link>
            </div>

            <button
                className="btn no-print shadow-lg"
                onClick={() => window.print()}
                style={{ position: 'fixed', bottom: '30px', right: '30px', borderRadius: '50px', padding: '15px 30px', fontSize: '16px', fontWeight: 'bold', zIndex: 1000, transition: 'transform 0.2s', backgroundColor: '#1e3a5f', color: '#fff', border: 'none' }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
                {t.printForm}
            </button>

            {showPreview && previewData && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-light no-print" style={{ zIndex: 1050, overflowY: 'auto' }}>
                    <div className="container-fluid px-2 px-md-4 py-3 py-md-5" style={{ maxWidth: '1200px' }}>
                        <div className="card shadow-lg border-0" style={{ borderRadius: '12px' }}>
                            <div className="card-header bg-theme text-white p-4">
                                <h3 className="fw-bold mb-0">{t.verifyTitle} - Full Application Review</h3>
                            </div>
                            <div className="card-body p-3 p-md-5">
                                <div className="alert alert-warning mb-4 fw-semibold border-warning">
                                    {t.verifyNotice}
                                </div>
                                <h5 className="fw-bold text-theme border-bottom pb-2 mb-3">1. Personal Details</h5>
                                <div className="row mb-4">
                                    <div className="col-md-4 mb-2"><strong>Trade Applied:</strong> <span className="text-danger fw-bold">{previewData.trade}</span></div>
                                    <div className="col-md-4 mb-2"><strong>Full Name:</strong> {previewData.fullName}</div>
                                    <div className="col-md-4 mb-2"><strong>DOB:</strong> {previewData.dob}</div>
                                    <div className="col-md-4 mb-2"><strong>Father's Name:</strong> {previewData.fatherName}</div>
                                    <div className="col-md-4 mb-2"><strong>Mother's Name:</strong> {previewData.motherName}</div>
                                    <div className="col-md-4 mb-2"><strong>Aadhar No:</strong> {previewData.aadharNo}</div>
                                    <div className="col-md-4 mb-2"><strong>Samagra ID:</strong> {previewData.samagraId}</div>
                                    <div className="col-md-4 mb-2"><strong>Category:</strong> {previewData.category}</div>
                                    <div className="col-md-4 mb-2"><strong>Gender:</strong> {previewData.gender}</div>
                                </div>

                                <h5 className="fw-bold text-theme border-bottom pb-2 mb-3">2. Contact Information</h5>
                                <div className="row mb-4">
                                    <div className="col-md-4 mb-2"><strong>Mobile:</strong> {previewData.mobile}</div>
                                    <div className="col-md-4 mb-2"><strong>Email:</strong> {previewData.email}</div>
                                    <div className="col-md-4 mb-2"><strong>Address:</strong> {previewData.address}, {previewData.distt}, {previewData.state} - {previewData.pin}</div>
                                </div>

                                <h5 className="fw-bold text-theme border-bottom pb-2 mb-3">3. Academic Details</h5>
                                <div className="row mb-4">
                                    <div className="col-md-6 mb-2"><strong>10th Board:</strong> {previewData.tenthBoard}</div>
                                    <div className="col-md-6 mb-2"><strong>10th Score:</strong> {previewData.tenthMarksObt} / {previewData.tenthTotalMarks}</div>
                                    {previewData.twelfthBoard && (
                                        <>
                                        <div className="col-md-6 mb-2"><strong>12th Board:</strong> {previewData.twelfthBoard}</div>
                                        <div className="col-md-6 mb-2"><strong>12th Score:</strong> {previewData.twelfthMarksObt} / {previewData.twelfthTotalMarks}</div>
                                        </>
                                    )}
                                </div>

                                <h5 className="fw-bold text-theme border-bottom pb-2 mb-3">4. Uploaded Documents</h5>
                                <div className="row mb-4">
                                    {['photo', 'signature', 'tenthDocument', 'twelfthDocument', 'aadharDocument', 'samagraDocument', 'casteDocument', 'incomeDocument', 'domicileDocument'].map(doc => {
                                        if (previewData[doc]) {
                                            return <div key={doc} className="col-md-4 mb-2"><strong>{doc}:</strong> <span className="badge bg-success">Uploaded ✓</span></div>
                                        }
                                        return null;
                                    })}
                                </div>
                                
                                <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                                    <button type="button" className="btn btn-outline-secondary btn-lg px-5 fw-bold" onClick={() => setShowPreview(false)}>{t.editForm}</button>
                                    <button type="button" className="btn btn-lg px-5 fw-bold shadow text-white" style={{ backgroundColor: '#f97316', borderColor: '#f97316' }} onClick={() => { setShowPreview(false); setShowPayment(true); setAmountPaid(getTradeFee(previewData.trade)); }}>Proceed to Payment</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPayment && previewData && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-light no-print" style={{ zIndex: 1050, overflowY: 'auto' }}>
                    <div className="container-fluid px-2 px-md-4 py-3 py-md-5" style={{ maxWidth: '1200px' }}>
                        <div className="card shadow-lg border-0" style={{ borderRadius: '12px' }}>
                            <div className="card-header bg-theme text-white p-4">
                                <h3 className="fw-bold mb-0">Admission Registration Fee Payment</h3>
                            </div>
                            <div className="card-body p-3 p-md-5">
                                <div className="alert alert-info py-3 mb-4 shadow-sm" style={{ fontSize: '1.1rem' }}>
                                    Please make a payment of <strong>₹ {(getTradeFee(previewData.trade) || 0).toLocaleString('en-IN')}</strong> using the options below and enter the payment details.
                                </div>
                                <div className="row g-3 g-md-5">
                                    <div className="col-md-6">
                                        <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#f8fafc', borderRadius: '16px' }}>
                                            <div className="card-body p-3 p-md-4 text-center">
                                                <h4 className="fw-bold mb-4" style={{ color: '#5f259f' }}>Pay via PhonePe / UPI</h4>
                                                <div className="bg-white p-3 d-inline-block rounded-3 shadow-sm mb-4">
                                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=sarfaraj.baig2@axl%26pn=SARFARAJ%20AHMED%20BAIG%26mc=0000%26tr=SUNSHINE`} alt="UPI QR Code" style={{ width: '200px', height: '200px' }} />
                                                </div>
                                                <h5 className="fw-bold text-dark">SARFARAJ AHMED BAIG</h5>
                                                <p className="text-muted mb-4">UPI ID: <strong>sarfaraj.baig2@axl</strong></p>
                                                
                                                <div className="d-grid gap-3">
                                                    <button type="button" className="btn btn-outline-primary btn-lg" onClick={() => { navigator.clipboard.writeText("sarfaraj.baig2@axl"); alert("UPI ID copied!"); }}>Copy UPI ID</button>
                                                    <a href="upi://pay?pa=sarfaraj.baig2@axl&pn=SARFARAJ%20AHMED%20BAIG&mc=0000&tr=SUNSHINE" className="btn btn-lg text-white fw-bold shadow-sm" style={{ backgroundColor: '#5f259f' }}>Open UPI App to Pay</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: '#f8fafc', borderRadius: '16px' }}>
                                            <div className="card-body p-3 p-md-4">
                                                <h5 className="fw-bold mb-3 text-theme">Bank Transfer Details</h5>
                                                <table className="table table-borderless mb-0">
                                                    <tbody>
                                                        <tr><th width="45%">Account Holder:</th><td>SARFARAJ AHMED BAIG</td></tr>
                                                        <tr><th>Account Number:</th><td className="fw-bold fs-5 text-primary">50100676012097</td></tr>
                                                        <tr><th>IFSC:</th><td className="fw-bold">HDFC0005405</td></tr>
                                                        <tr><th>Branch:</th><td>CHHINDWARA CHOWK SEONI</td></tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        
                                        <div className="card border-0 shadow-sm" style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0 !important' }}>
                                            <div className="card-body p-3 p-md-4">
                                                <h5 className="fw-bold mb-4 text-theme">Enter Transaction Details</h5>
                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">Payment Method *</label>
                                                    <select className="form-select form-select-lg" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                                        <option value="UPI">UPI Transfer</option>
                                                        <option value="QR Code">PhonePe QR Code</option>
                                                        <option value="Bank Transfer">Bank Account Transfer</option>
                                                    </select>
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-semibold">Amount Paid (₹) *</label>
                                                        <input type="number" min="0" className="form-control form-control-lg" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} required />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-semibold">Payment Date *</label>
                                                        <input type="date" className="form-control form-control-lg" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required />
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label fw-semibold">Transaction ID / UTR Number *</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control form-control-lg" 
                                                        placeholder={paymentMethod === 'Bank Transfer' ? "12 to 22-digit Ref" : "12-digit UTR"} 
                                                        value={transactionId} 
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (paymentMethod === 'UPI' || paymentMethod === 'QR Code') {
                                                                setTransactionId(val.replace(/\D/g, '').substring(0, 12));
                                                            } else {
                                                                setTransactionId(val.replace(/[^a-zA-Z0-9]/g, '').substring(0, 22));
                                                            }
                                                        }} 
                                                        required 
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="form-label fw-semibold">Upload Payment Receipt *</label>
                                                    <input type="file" accept="image/*, .pdf" className="form-control form-control-lg" onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            if (file.size > 5 * 1024 * 1024) {
                                                                setPaymentReceiptError("Receipt file size must be under 5MB");
                                                                e.target.value = '';
                                                            } else {
                                                                setPaymentReceiptError("");
                                                                setPaymentReceipt(file);
                                                            }
                                                        }
                                                    }} required />
                                                    {paymentReceiptError && <div className="text-danger mt-2">{paymentReceiptError}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                                    <button type="button" className="btn btn-outline-secondary btn-lg px-5 fw-bold" onClick={() => { setShowPayment(false); setShowPreview(true); }}>Back to Review</button>
                                    <button type="button" className="btn btn-lg px-5 fw-bold shadow text-white" style={{ backgroundColor: '#22c55e', borderColor: '#22c55e' }} onClick={submitPaymentAndForm} disabled={loading}>
                                        {loading ? '⏳ Submitting...' : 'Complete Admission & Pay'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="print-area container py-4" style={{ backgroundColor: '#f8f9fa' }}>
                {isSubmitted && submittedData ? (
                    <div className="card custom-card">
                        <div className="card-header text-center bg-theme p-5 no-print" style={{ borderBottom: '3px solid #ffc107' }}>
                            <div className="d-inline-flex justify-content-center align-items-center rounded-circle bg-success bg-opacity-25 p-3 mb-3" style={{ border: '2px solid #22c55e' }}>
                                <CheckCircle size={40} className="text-success" />
                            </div>
                            <h2 className="fw-bold mb-2" style={{ color: '#ffc107', fontSize: '2rem' }}>{t.submittedTitle}</h2>
                            <p className="mb-3 text-white fs-5">{t.submittedDesc}</p>
                            
                            <div className="bg-white text-dark rounded-3 p-3 mb-4 mx-auto shadow-lg" style={{ maxWidth: '500px' }}>
                                <h4 className="mb-2 fw-bold text-theme">{t.applicationNumber}: <span className="text-danger fw-extrabold fs-3">ITI/2026/{submittedData.id}</span></h4>
                                <p className="mb-0 small text-muted fw-semibold">{t.applicationNumNotice}</p>
                            </div>

                            <div className="d-flex justify-content-center mt-3">
                                <button 
                                    className="btn btn-lg fw-bold shadow-lg px-5 py-3 text-white border-0" 
                                    onClick={() => window.print()}
                                    style={{
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        fontSize: '1.25rem',
                                        borderRadius: '50px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        animation: 'pulse-print 2s infinite',
                                        boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Printer size={24} /> {t.printApp}
                                </button>
                            </div>
                            <style>{`
                                @keyframes pulse-print {
                                    0% {
                                        transform: scale(1);
                                        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
                                    }
                                    70% {
                                        transform: scale(1.03);
                                        box-shadow: 0 0 0 15px rgba(16, 185, 129, 0);
                                    }
                                    100% {
                                        transform: scale(1);
                                        box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
                                    }
                                }
                            `}</style>
                        </div>
                        <div className="card-body p-4 p-md-5 bg-white">
                            <div className="text-center mb-4 pb-3" style={{ borderBottom: '2px dashed #003366' }}>
                                <h1 className="fw-bold mb-1 text-theme">SUNSHINE PVT. ITI</h1>
                                <h5 className="fw-semibold mb-2 text-danger">SEONI (M.P.)</h5>
                                <p className="mb-0 small fw-bold text-muted">AFFILIATION -DGT-12/1/18-TC | MIS CODE - PU23001071</p>
                                <h4 className="mt-3 fw-bold text-uppercase text-theme">Admission Application Form</h4>
                            </div>
                            <div className="alert alert-info border-info text-center fw-bold mb-4">
                                <span className="fs-5">Admission Process is Underway</span>
                                <br />
                                <small className="text-muted">Your form and payment details have been submitted and are pending verification.</small>
                            </div>
                            <div className="row mb-3 fw-bold fs-6 align-items-center">
                                <div className="col-md-3 col-6 mb-2">{t.applicationNumber}: <span className="text-primary">ITI/2026/{submittedData.id}</span></div>
                                <div className="col-md-3 col-6 mb-2 text-md-center">{t.tradeApplied}: <span className="text-danger">{submittedData.trade}</span></div>
                                <div className="col-md-3 col-6 mb-2 text-md-center">{t.applicationStatus}: <span className="badge bg-warning text-dark px-2 py-1">Under Process</span></div>
                                <div className="col-md-3 col-6 mb-2 text-md-end">{t.date}: <span className="text-danger">{today}</span></div>
                            </div>
                            <div className="section-title mt-0">{t.personalDetails}</div>
                            <table className="table table-bordered mb-4">
                                <tbody>
                                    <tr><th width="25%" className="bg-light text-muted">Candidate's Name</th><td width="25%" className="fw-bold">{submittedData.fullName}</td><th width="25%" className="bg-light text-muted">Date of Birth</th><td width="25%" className="fw-bold">{submittedData.dob}</td></tr>
                                    <tr><th className="bg-light text-muted">Father's Name</th><td>{submittedData.fatherName}</td><th className="bg-light text-muted">Mother's Name</th><td>{submittedData.motherName}</td></tr>
                                    <tr><th className="bg-light text-muted">Aadhar Number</th><td>{submittedData.aadharNo}</td><th className="bg-light text-muted">Samagra ID</th><td>{submittedData.samagraId}</td></tr>
                                    <tr><th className="bg-light text-muted">Category / Gender</th><td>{submittedData.category} / {submittedData.gender}</td><th className="bg-light text-muted">Religion</th><td>{submittedData.religion}</td></tr>
                                    <tr><th className="bg-light text-muted">Mobile Number</th><td>{submittedData.mobile}</td><th className="bg-light text-muted">Email Address</th><td>{submittedData.email}</td></tr>
                                    <tr><th className="bg-light text-muted">Permanent Address</th><td colSpan="3">{submittedData.address}, {submittedData.distt}, {submittedData.state} - {submittedData.pin}</td></tr>
                                </tbody>
                            </table>
                            <div className="section-title">{t.academicDetails}</div>
                            <table className="table table-bordered text-center mb-4">
                                <thead className="bg-light text-muted">
                                    <tr><th>Level</th><th>Board</th><th>School / College</th><th>Year</th><th>Roll No.</th><th>Marks</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td className="fw-bold">10th</td><td>{submittedData.tenthBoard}</td><td>{submittedData.tenthSchool}</td><td>{submittedData.tenthYear}</td><td>{submittedData.tenthRollNo}</td><td>{submittedData.tenthMarksObt} / {submittedData.tenthTotalMarks}</td></tr>
                                    {submittedData.twelfthBoard && (
                                        <tr><td className="fw-bold">12th</td><td>{submittedData.twelfthBoard}</td><td>{submittedData.twelfthSchool}</td><td>{submittedData.twelfthYear}</td><td>{submittedData.twelfthRollNo}</td><td>{submittedData.twelfthMarksObt} / {submittedData.twelfthTotalMarks}</td></tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="section-title">Payment Information</div>
                            <table className="table table-bordered mb-4">
                                <tbody>
                                    <tr>
                                        <th width="25%" className="bg-light text-muted">Payment Method</th>
                                        <td width="25%">{submittedData.paymentMethod}</td>
                                        <th width="25%" className="bg-light text-muted">Transaction ID / UTR</th>
                                        <td width="25%" className="fw-bold">{submittedData.transactionId}</td>
                                    </tr>
                                    <tr>
                                        <th className="bg-light text-muted">Amount Paid</th>
                                        <td className="fw-bold text-success">₹ {Number(submittedData.amountPaid).toLocaleString('en-IN')}</td>
                                        <th className="bg-light text-muted">{t.remainingPay}</th>
                                        <td className="fw-bold text-danger">₹ {Number(submittedData.outstandingBalance).toLocaleString('en-IN')}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #f97316', borderTop: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
                                <p className="mb-0 small text-justify text-muted">
                                    {t.declaration}
                                </p>
                            </div>
                            <div className="row mt-5 pt-5 pb-3">
                                <div className="col-6 text-center"><span className="fw-bold text-muted" style={{ borderTop: '2px solid #333', padding: '10px 40px' }}>{t.studentSignature}</span></div>
                                <div className="col-6 text-center"><span className="fw-bold text-muted" style={{ borderTop: '2px solid #333', padding: '10px 40px' }}>{t.authority}</span></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="card custom-card">
                        <div className="card-header text-center bg-theme p-4 p-md-5">
                            <h1 className="fw-bold mb-1" style={{ color: '#ffc107', letterSpacing: '2px', fontSize: '42px' }}>SUNSHINE PVT. ITI</h1>
                            <h3 className="fw-bold mb-3" style={{ color: '#fff', fontSize: '26px' }}>SEONI (M.P.)</h3>
                            <p className="mb-1" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px' }}>AFFILIATION -DGT-12/1/18-TC &nbsp;|&nbsp; MIS CODE - PU23001071</p>
                            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px' }}>Email: sunshineiti8@gmail.com &nbsp;|&nbsp; Mo. 7415491034</p>
                            <div className="mt-4">
                                <span className="shadow" style={{
                                    display: 'inline-block',
                                    backgroundColor: '#f97316',
                                    color: '#fff',
                                    padding: '14px 40px',
                                    borderRadius: '50px',
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    letterSpacing: '1px'
                                }}>Online Admission Form</span>
                            </div>
                        </div>
                        <div className="card-body p-4 p-md-5">
                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handlePreview} enableReinitialize>
                                {({ isSubmitting, setFieldValue, values, resetForm }) => (
                                    <Form>
                                        <div className="section-title mt-0">{t.tradeDetails}</div>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label className="form-label">{t.tradeLabel}</label>
                                                <Field as="select" name="trade" className="form-select border-primary bg-light">
                                                    <option value="">-- Select Trade --</option>
                                                    <option value="ELECTRICIAN">ELECTRICIAN</option>
                                                    <option value="Health Sanitary Inspector">Health Sanitary Inspector</option>
                                                    <option value="DCA">DCA</option>
                                                    <option value="PGDCA">PGDCA</option>

                                                </Field>
                                                <ErrorMessage name="trade" component="div" className="text-danger small mt-1" />
                                            </div>
                                        </div>

                                        <div className="section-title">{t.personalDetails}</div>
                                        <div className="row g-3">
                                            <div className="col-md-12">
                                                <label className="form-label">Candidate's Full Name *</label>
                                                <Field type="text" name="fullName" className="form-control" />
                                                <ErrorMessage name="fullName" component="div" className="text-danger small" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Father's Name *</label>
                                                <Field type="text" name="fatherName" className="form-control" />
                                                <ErrorMessage name="fatherName" component="div" className="text-danger small" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Mother's Name *</label>
                                                <Field type="text" name="motherName" className="form-control" />
                                                <ErrorMessage name="motherName" component="div" className="text-danger small" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Aadhar Number *</label>
                                                <Field type="text" name="aadharNo" className="form-control" maxLength="12" />
                                                <ErrorMessage name="aadharNo" component="div" className="text-danger small" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Samagra ID *</label>
                                                <Field type="text" name="samagraId" className="form-control" maxLength="9" />
                                                <ErrorMessage name="samagraId" component="div" className="text-danger small" />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Date of Birth *</label>
                                                <Field type="date" name="dob" className="form-control" max={today} />
                                                <ErrorMessage name="dob" component="div" className="text-danger small" />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Religion *</label>
                                                <Field as="select" name="religion" className="form-select">
                                                    <option value="">Select</option><option value="HINDU">Hindu</option><option value="MUSLIM">Muslim</option><option value="SIKH">Sikh</option><option value="CHRISTIAN">Christian</option><option value="JAIN">Jain</option><option value="BUDDHIST">Buddhist</option><option value="OTHER">Other</option>
                                                </Field>
                                                <ErrorMessage name="religion" component="div" className="text-danger small" />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Category</label>
                                                <Field as="select" name="category" className="form-select">
                                                    <option value="">Select</option><option value="GEN">General</option><option value="OBC">OBC</option><option value="SC">SC</option><option value="ST">ST</option>
                                                </Field>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Gender</label>
                                                <Field as="select" name="gender" className="form-select">
                                                    <option value="">Select</option><option value="MALE">Male</option><option value="FEMALE">Female</option>
                                                </Field>
                                            </div>
                                        </div>

                                        <div className="section-title">{t.contactDetails}</div>
                                        <div className="row g-3">
                                            <div className="col-md-12">
                                                <label className="form-label">Permanent Address *</label>
                                                <Field name="address">
                                                    {({ field, form }) => (
                                                        <AddressAutocomplete
                                                            value={field.value}
                                                            onChange={(val) => form.setFieldValue("address", val)}
                                                            onPlaceSelect={(fullAddress, components) => {
                                                                form.setFieldValue("address", fullAddress);
                                                                if (components.district) form.setFieldValue("distt", components.district);
                                                                if (components.state) form.setFieldValue("state", components.state);
                                                                if (components.pincode) form.setFieldValue("pin", components.pincode);
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Post Office</label>
                                                <Field type="text" name="post" className="form-control" />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Tehsil</label>
                                                <Field type="text" name="tehsil" className="form-control" />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Pin Code *</label>
                                                <Field name="pin">
                                                    {({ field, form }) => (
                                                        <input {...field} type="text" className="form-control" maxLength="6" placeholder="6 Digit PIN"
                                                            onChange={(e) => {
                                                                field.onChange(e);
                                                                if (e.target.value.length === 6) {
                                                                    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
                                                                    if (key && key !== "YOUR_API_KEY_HERE" && window.google?.maps) {
                                                                        geocodePincode(e.target.value)
                                                                            .then(({ district, state }) => {
                                                                                if (district) form.setFieldValue("distt", district);
                                                                                if (state) form.setFieldValue("state", state);
                                                                            })
                                                                            .catch(() => { });
                                                                    }
                                                                    fetch(`https://api.postalpincode.in/pincode/${e.target.value}`)
                                                                        .then(res => res.json())
                                                                        .then(data => {
                                                                            if (data[0]?.Status === "Success") {
                                                                                form.setFieldValue("distt", data[0].PostOffice[0].District);
                                                                                form.setFieldValue("state", data[0].PostOffice[0].State);
                                                                            }
                                                                        })
                                                                        .catch(() => { });
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                                <ErrorMessage name="pin" component="div" className="text-danger small" />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">District</label>
                                                <Field type="text" name="distt" className="form-control bg-light" readOnly />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">State</label>
                                                <Field type="text" name="state" className="form-control bg-light" readOnly />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Mobile Number *</label>
                                                <Field type="text" name="mobile" className="form-control" maxLength="10" />
                                                <ErrorMessage name="mobile" component="div" className="text-danger small" />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Parent's Mobile Number</label>
                                                <Field type="text" name="parentMobile" className="form-control" maxLength="10" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">WhatsApp Number</label>
                                                <Field type="text" name="whatsapp" className="form-control" maxLength="10" />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Email Address *</label>
                                                <Field type="email" name="email" className="form-control" />
                                                <ErrorMessage name="email" component="div" className="text-danger small" />
                                            </div>
                                        </div>

                                        <div className="section-title">{t.academicDetails}</div>
                                        <div className="row g-2 align-items-end mb-4">
                                            <div className="col-md-12 text-theme fw-bold mb-1">10th (High School) Details *</div>
                                            <div className="col-md-3">
                                                <Field as="select" name="tenthBoard" className="form-select">
                                                    <option value="">-- Select Board --</option>
                                                    <option value="CBSE">CBSE</option>
                                                    <option value="MPBSE">MP Board (MPBSE)</option>
                                                    <option value="ICSE">ICSE</option>
                                                    <option value="Other">Other</option>
                                                </Field>
                                                <ErrorMessage name="tenthBoard" component="div" className="text-danger small" />
                                            </div>
                                            <div className="col-md-4">
                                                <Field name="tenthSchool">
                                                    {({ field, form }) => (
                                                        <SchoolAutoSuggest
                                                            board={form.values.tenthBoard}
                                                            value={field.value}
                                                            onChange={(val) => form.setFieldValue("tenthSchool", val)}
                                                            name="tenthSchool"
                                                            placeholder="School / College Name"
                                                            error={form.errors.tenthSchool && form.touched.tenthSchool ? form.errors.tenthSchool : null}
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                            <div className="col-md-2"><Field type="text" name="tenthRollNo" className="form-control" placeholder="Roll No." /></div>
                                            <div className="col-md-1"><Field type="text" name="tenthYear" className="form-control" placeholder="Year" /></div>
                                            <div className="col-md-1"><Field type="number" name="tenthTotalMarks" className="form-control" placeholder="Total" /></div>
                                            <div className="col-md-1"><Field type="number" name="tenthMarksObt" className="form-control" placeholder="Obt." /></div>
                                        </div>

                                        <div className="row g-2 align-items-end mb-3">
                                            <div className="col-md-12 text-secondary fw-bold mb-1">12th Details <span className="fw-normal">(Optional)</span></div>
                                            <div className="col-md-3">
                                                <Field as="select" name="twelfthBoard" className="form-select">
                                                    <option value="">-- Select Board --</option>
                                                    <option value="CBSE">CBSE</option>
                                                    <option value="MPBSE">MP Board (MPBSE)</option>
                                                    <option value="ICSE">ICSE</option>
                                                    <option value="Other">Other</option>
                                                </Field>
                                            </div>
                                            <div className="col-md-4">
                                                <Field name="twelfthSchool">
                                                    {({ field, form }) => (
                                                        <SchoolAutoSuggest
                                                            board={form.values.twelfthBoard}
                                                            value={field.value}
                                                            onChange={(val) => form.setFieldValue("twelfthSchool", val)}
                                                            name="twelfthSchool"
                                                            placeholder="School / College Name"
                                                        />
                                                    )}
                                                </Field>
                                            </div>
                                            <div className="col-md-2"><Field type="text" name="twelfthRollNo" className="form-control" placeholder="Roll No." /></div>
                                            <div className="col-md-1"><Field type="text" name="twelfthYear" className="form-control" placeholder="Year" /></div>
                                            <div className="col-md-1"><Field type="number" name="twelfthTotalMarks" className="form-control" placeholder="Total" /></div>
                                            <div className="col-md-1"><Field type="number" name="twelfthMarksObt" className="form-control" placeholder="Obt." /></div>
                                        </div>

                                        <div className="section-title no-print">{t.documentUpload}</div>
                                        <div className="row g-3 no-print">
                                            <div className="col-md-4">
                                                <label className="form-label">Passport Photo * <span className="text-muted fw-normal">(Max 5 MB, JPG/PNG)</span></label>
                                                <input type="file" accept="image/*" className="form-control" onChange={(e) => handleFileChange(e, 'photo', setFieldValue)} />
                                                <ErrorMessage name="photo" component="div" className="text-danger small mt-1" />
                                                {fileSizeErrors.photo && <div className="text-danger small mt-1">{fileSizeErrors.photo}</div>}
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Signature * <span className="text-muted fw-normal">(Max 5 MB, JPG/PNG)</span></label>
                                                <input type="file" accept="image/*" className="form-control" onChange={(e) => handleFileChange(e, 'signature', setFieldValue)} />
                                                <ErrorMessage name="signature" component="div" className="text-danger small mt-1" />
                                                {fileSizeErrors.signature && <div className="text-danger small mt-1">{fileSizeErrors.signature}</div>}
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Aadhar Card * <span className="text-muted fw-normal">(Max 5 MB, PDF/Image)</span></label>
                                                <input type="file" accept=".pdf, image/*" className="form-control" onChange={(e) => handleFileChange(e, 'aadharDocument', setFieldValue)} />
                                                <ErrorMessage name="aadharDocument" component="div" className="text-danger small mt-1" />
                                                {fileSizeErrors.aadharDocument && <div className="text-danger small mt-1">{fileSizeErrors.aadharDocument}</div>}
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Samagra ID * <span className="text-muted fw-normal">(Max 5 MB, PDF/Image)</span></label>
                                                <input type="file" accept=".pdf, image/*" className="form-control" onChange={(e) => handleFileChange(e, 'samagraDocument', setFieldValue)} />
                                                <ErrorMessage name="samagraDocument" component="div" className="text-danger small mt-1" />
                                                {fileSizeErrors.samagraDocument && <div className="text-danger small mt-1">{fileSizeErrors.samagraDocument}</div>}
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">10th Marksheet * <span className="text-muted fw-normal">(Max 5 MB, PDF/Image)</span></label>
                                                <input type="file" accept=".pdf, image/*" className="form-control" onChange={(e) => handleFileChange(e, 'tenthDocument', setFieldValue)} />
                                                <ErrorMessage name="tenthDocument" component="div" className="text-danger small mt-1" />
                                                {fileSizeErrors.tenthDocument && <div className="text-danger small mt-1">{fileSizeErrors.tenthDocument}</div>}
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">12th Marksheet <span className="text-muted fw-normal">(Max 5 MB, PDF/Image)</span></label>
                                                <input type="file" accept=".pdf, image/*" className="form-control" onChange={(e) => handleFileChange(e, 'twelfthDocument', setFieldValue)} />
                                                {fileSizeErrors.twelfthDocument && <div className="text-danger small mt-1">{fileSizeErrors.twelfthDocument}</div>}
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Caste Certificate / Jaati Praman <span className="text-muted fw-normal">(Optional)</span></label>
                                                <input type="file" accept=".pdf, image/*" className="form-control" onChange={(e) => handleFileChange(e, 'casteDocument', setFieldValue)} />
                                                {fileSizeErrors.casteDocument && <div className="text-danger small mt-1">{fileSizeErrors.casteDocument}</div>}
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Income Certificate / Aay Praman <span className="text-muted fw-normal">(Optional)</span></label>
                                                <input type="file" accept=".pdf, image/*" className="form-control" onChange={(e) => handleFileChange(e, 'incomeDocument', setFieldValue)} />
                                                {fileSizeErrors.incomeDocument && <div className="text-danger small mt-1">{fileSizeErrors.incomeDocument}</div>}
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Domicile / Nivas Praman <span className="text-muted fw-normal">(Optional)</span></label>
                                                <input type="file" accept=".pdf, image/*" className="form-control" onChange={(e) => handleFileChange(e, 'domicileDocument', setFieldValue)} />
                                                {fileSizeErrors.domicileDocument && <div className="text-danger small mt-1">{fileSizeErrors.domicileDocument}</div>}
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between mt-5 pt-4 border-top no-print">
                                            <button type="button" className="btn btn-outline-secondary px-4 py-2 fw-semibold" onClick={() => handleSaveDraft(values)}>Save Draft</button>
                                            <div className="d-flex gap-2">
                                                <button type="button" className="btn btn-outline-danger px-4 py-2 fw-semibold" onClick={() => resetForm()}>Clear Form</button>
                                                <button type="submit" className="btn px-4 py-2 fw-semibold shadow" style={{ backgroundColor: '#f97316', borderColor: '#f97316', color: '#fff' }} disabled={isSubmitting}>
                                                    {isSubmitting ? '⏳ Processing...' : '📋 Preview & Submit'}
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
