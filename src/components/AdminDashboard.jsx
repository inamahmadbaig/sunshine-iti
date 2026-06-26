import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosInstance';
import { useLanguage } from '../context/LanguageContext';
import { 
  Shield, 
  LogOut, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Edit, 
  Download, 
  User, 
  Briefcase, 
  Calendar, 
  MapPin, 
  GraduationCap, 
  FileText,
  Clock,
  ArrowLeft,
  LayoutGrid,
  ListOrdered,
  CreditCard,
  Users,
  Bell,
  Sun,
  Moon,
  IndianRupee,
  Send,
  PlusCircle,
  Lock,
  Menu,
  X,
  MessageSquare,
  ImageIcon,
  Award,
  Megaphone,
  Home,
  Database,
  MessageCircle,
  BookOpen,
  Printer
} from 'lucide-react';
import AdminOfflineAdmission from './AdminOfflineAdmission';
import AnalyticsDashboard from './AnalyticsDashboard';

const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api`;

export default function AdminDashboard({ activeTab = 'dashboard' }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Theme state persistent in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("adminDarkMode");
    return saved !== null ? JSON.parse(saved) : true; // Default to dark mode
  });

  const [admin, setAdmin] = useState(null);
  const [admissions, setAdmissions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrade, setFilterTrade] = useState('ALL');
  const [filterYear, setFilterYear] = useState('ALL');

  // Offline Payment states
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [payCourseFee, setPayCourseFee] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Cash');
  const [payTxnId, setPayTxnId] = useState('');
  const [payStatus, setPayStatus] = useState('PENDING');
  const [payRemark, setPayRemark] = useState('');

  // Fee Installment States
  const [pendingFees, setPendingFees] = useState([]);
  const [allFees, setAllFees] = useState([]);
  const [studentFees, setStudentFees] = useState([]);
  const [isRecordingFee, setIsRecordingFee] = useState(false);
  const [feeAmount, setFeeAmount] = useState('');
  const [feeMethod, setFeeMethod] = useState('Cash');
  const [feeTxnId, setFeeTxnId] = useState('');
  const [feeReceipt, setFeeReceipt] = useState(null);

  // Notifications Form State
  const [notifRecipient, setNotifRecipient] = useState('All');
  const [notifSubject, setNotifSubject] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifFile, setNotifFile] = useState(null);
  const [notifSuccess, setNotifSuccess] = useState('');

  // Profile Form State
  const [profileName, setProfileName] = useState('Inam Ahmad Baig');
  const [profileEmail, setProfileEmail] = useState('sunshineiti8@gmail.com');
  const [oldPassword, setOldPassword] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Add New Admin State
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [addAdminSuccess, setAddAdminSuccess] = useState('');
  const [addAdminError, setAddAdminError] = useState('');

  // Manage Notices State
  const [manageNotices, setManageNotices] = useState([]);
  const [newNotice, setNewNotice] = useState({ title: '', link: '', date: new Date().toISOString().split('T')[0], isNew: true });
  const [noticeFile, setNoticeFile] = useState(null);
  const [uploadingNotice, setUploadingNotice] = useState(false);

  // Inquiries State
  const [inquiries, setInquiries] = useState([]);

  // Gallery State
  const [gallery, setGallery] = useState([]);
  const [galleryFile, setGalleryFile] = useState(null);
  const [newImage, setNewImage] = useState({ title: '', category: 'Campus' });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Results State
  const [results, setResults] = useState([]);
  const [selectedStudentForResults, setSelectedStudentForResults] = useState(null);
  const [newResult, setNewResult] = useState({ subject: '', semesterOrYear: 'Semester 1', maxMarks: 100, marksObtained: 0, grade: 'A', status: 'PASS' });

  // Study Materials State
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState({ title: '', titleHn: '', trade: 'All Trades', tradeHn: 'सभी ट्रेड्स', type: 'SYLLABUS' });
  const [materialFile, setMaterialFile] = useState(null);
  const [uploadingMaterial, setUploadingMaterial] = useState(false);

  // Certificate Modal State
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certFee, setCertFee] = useState(500);
  const [certPaymentMethod, setCertPaymentMethod] = useState('Cash');
  const [certTxnId, setCertTxnId] = useState('');

  // Bulk Upload State
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [uploadingBulk, setUploadingBulk] = useState(false);

  // Sync theme to local storage
  useEffect(() => {
    localStorage.setItem("adminDarkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Check authentication
  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (!stored) {
      navigate("/admin/login");
    } else {
      const parsed = JSON.parse(stored);
      setAdmin(parsed);
      if (parsed.email) setProfileEmail(parsed.email);
      if (parsed.username) setProfileName(parsed.username === 'Inam' ? 'Inam Ahmad Baig' : parsed.username);
    }
  }, [navigate]);

  const loadAdmissions = () => {
    setLoading(true);
    axios.get(`${API_BASE}/admissions`)
      .then(res => {
        setAdmissions(res.data.reverse());
      })
      .catch(err => console.error("Error loading admissions:", err))
      .finally(() => setLoading(false));
  };

  const loadPendingFees = () => {
    axios.get(`${API_BASE}/fees/pending`)
      .then(res => setPendingFees(res.data))
      .catch(err => console.error("Error loading pending fees:", err));
  };

  const loadAllFees = () => {
    axios.get(`${API_BASE}/fees`)
      .then(res => setAllFees(res.data))
      .catch(err => console.error("Error loading all fees:", err));
  };

  const loadManageNotices = () => {
    axios.get(`${API_BASE}/notices`)
      .then(res => {
        const mappedData = res.data.map(n => ({ ...n, isNew: n.isNew !== undefined ? n.isNew : n.new }));
        setManageNotices(mappedData.sort((a, b) => new Date(b.date) - new Date(a.date)));
      })
      .catch(err => console.error("Error loading notices:", err));
  };

  const loadInquiries = () => {
    axios.get(`${API_BASE}/inquiries`)
      .then(res => {
        setInquiries(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      })
      .catch(err => console.error("Error loading inquiries:", err));
  };

  const loadGallery = () => {
    axios.get(`${API_BASE}/gallery`)
      .then(res => setGallery(res.data))
      .catch(err => console.error("Error loading gallery:", err));
  };

  const loadResults = (studentId) => {
    axios.get(`${API_BASE}/results/student/${studentId}`)
      .then(res => setResults(res.data))
      .catch(err => console.error("Error loading results:", err));
  };


  const handleAddNotice = async (e) => {
    e.preventDefault();
    setUploadingNotice(true);
    let finalLink = newNotice.link;

    try {
      if (noticeFile) {
        const formData = new FormData();
        formData.append("file", noticeFile);
        const uploadRes = await axios.post(`${API_BASE}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        finalLink = uploadRes.data.url;
      }

      await axios.post(`${API_BASE}/notices`, { ...newNotice, link: finalLink || '#' });
      loadManageNotices();
      setNewNotice({ title: '', link: '', date: new Date().toISOString().split('T')[0], isNew: true });
      setNoticeFile(null);
    } catch (err) {
      console.error("Error adding notice:", err);
      alert("Failed to add notice. Please try again.");
    } finally {
      setUploadingNotice(false);
    }
  };

  const handleDeleteNotice = (id) => {
    axios.delete(`${API_BASE}/notices/${id}`)
      .then(() => {
        setManageNotices(prev => prev.filter(n => n.id !== id));
        loadManageNotices();
      })
      .catch(err => console.error("Error deleting notice:", err));
  };

  const handleMarkInquiryRead = (id) => {
    axios.patch(`${API_BASE}/inquiries/${id}/status`, { status: 'READ' })
      .then(() => loadInquiries())
      .catch(err => console.error("Error updating inquiry:", err));
  };

  const handleDeleteInquiry = (id) => {
    axios.delete(`${API_BASE}/inquiries/${id}`)
      .then(() => {
        setInquiries(prev => prev.filter(i => i.id !== id));
        loadInquiries();
      })
      .catch(err => console.error("Error deleting inquiry:", err));
  };

  const handleAddGalleryImage = async (e) => {
    e.preventDefault();
    if (!galleryFile) {
      alert("Please select an image file to upload.");
      return;
    }
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", galleryFile);
      const uploadRes = await axios.post(`${API_BASE}/upload`, formData, { headers: { "Content-Type": "multipart/form-data" }});
      
      await axios.post(`${API_BASE}/gallery`, { ...newImage, imageUrl: uploadRes.data.url });
      loadGallery();
      setNewImage({ title: '', category: 'Campus' });
      setGalleryFile(null);
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteGalleryImage = (id) => {
    axios.delete(`${API_BASE}/gallery/${id}`)
      .then(() => {
        setGallery(prev => prev.filter(img => img.id !== id));
        loadGallery();
      })
      .catch(err => console.error("Error deleting image:", err));
  };

  const handleAddResult = (e) => {
    e.preventDefault();
    if (!selectedStudentForResults) return;
    axios.post(`${API_BASE}/results/student/${selectedStudentForResults.id}`, newResult)
      .then(() => {
        loadResults(selectedStudentForResults.id);
        setNewResult({ ...newResult, subject: '', marksObtained: 0 }); // reset partial
      })
      .catch(err => console.error("Error adding result:", err));
  };

  const handleDeleteResult = (id) => {
    axios.delete(`${API_BASE}/results/${id}`)
      .then(() => {
        setResults(prev => prev.filter(r => r.id !== id));
        if (selectedStudentForResults) loadResults(selectedStudentForResults.id);
      })
      .catch(err => console.error("Error deleting result:", err));
  };


  const loadStudyMaterials = () => {
    axios.get(`${API_BASE}/study-materials`)
      .then(res => setStudyMaterials(res.data))
      .catch(err => console.error("Error loading study materials:", err));
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!materialFile) { alert('Please select a file.'); return; }
    setUploadingMaterial(true);
    try {
      const formData = new FormData();
      formData.append('title', newMaterial.title);
      formData.append('titleHn', newMaterial.titleHn || '');
      formData.append('trade', newMaterial.trade);
      formData.append('tradeHn', newMaterial.tradeHn || '');
      formData.append('type', newMaterial.type);
      formData.append('file', materialFile);
      await axios.post(`${API_BASE}/study-materials`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      loadStudyMaterials();
      setNewMaterial({ title: '', titleHn: '', trade: 'All Trades', tradeHn: 'सभी ट्रेड्स', type: 'SYLLABUS' });
      setMaterialFile(null);
      document.getElementById('materialFileInput').value = '';
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploadingMaterial(false);
    }
  };

  const handleDeleteMaterial = (id) => {
    if (!window.confirm('Delete this file?')) return;
    axios.delete(`${API_BASE}/study-materials/${id}`)
      .then(() => setStudyMaterials(prev => prev.filter(m => m.id !== id)))
      .catch(err => console.error("Delete failed:", err));
  };

  const loadStudentFees = (studentId) => {
    axios.get(`${API_BASE}/fees/student/${studentId}`)
      .then(res => setStudentFees(res.data))
      .catch(err => console.error("Error loading student fees:", err));
  };

  useEffect(() => {
    if (admin) {
      loadAdmissions();
      loadPendingFees();
      loadAllFees();
      loadManageNotices();
      loadInquiries();
      loadGallery();
    }
  }, [admin, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setIsEditing(false);
    setIsEditingPayment(false);
    setIsRecordingFee(false);
    setEditFormData(student);
    loadStudentFees(student.id);
  };

  const handleOpenPaymentEditor = () => {
    setPayCourseFee(selectedStudent.courseFee || '');
    setPayAmount(selectedStudent.amountPaid || 0);
    setPayMethod(selectedStudent.paymentMethod || 'Cash');
    setPayTxnId(selectedStudent.transactionId || '');
    setPayStatus(selectedStudent.paymentStatus || 'PENDING');
    setPayRemark(selectedStudent.adminRemarks || '');
    setIsEditingPayment(true);
  };

  const handleSavePaymentEdit = (e) => {
    e.preventDefault();
    if (Number(payAmount) < 0) {
      alert("Amount Paid cannot be negative.");
      return;
    }
    axios.put(`${API_BASE}/admissions/${selectedStudent.id}/payment`, {
      courseFee: payCourseFee,
      amountPaid: payAmount,
      paymentMethod: payMethod,
      transactionId: payTxnId,
      paymentStatus: payStatus,
      adminRemarks: payRemark
    })
    .then(res => {
      loadAdmissions();
      setSelectedStudent(res.data);
      setIsEditingPayment(false);
      alert("Payment record updated successfully.");
    })
    .catch(err => alert("Failed to save payment record: " + err.message));
  };

  const handleRecordFee = (e) => {
    e.preventDefault();
    if (!feeAmount || Number(feeAmount) <= 0) return alert("Enter a valid amount");
    if (!feeMethod) return alert("Select a payment method");

    const formData = new FormData();
    formData.append("admissionId", selectedStudent.id);
    formData.append("amount", feeAmount);
    formData.append("paymentMethod", feeMethod);
    if (feeTxnId) formData.append("transactionId", feeTxnId);
    formData.append("paymentDate", new Date().toISOString().split('T')[0]);
    if (feeReceipt) formData.append("receipt", feeReceipt);

    axios.post(`${API_BASE}/fees/admin`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      alert("Fee payment recorded successfully!");
      setIsRecordingFee(false);
      setFeeAmount('');
      setFeeTxnId('');
      setFeeReceipt(null);
      loadAdmissions(); // to refresh overall balances
      loadStudentFees(selectedStudent.id);
      
      // Update selected student local state so UI updates
      const updatedStudent = {
        ...selectedStudent,
        amountPaid: (selectedStudent.amountPaid || 0) + Number(feeAmount),
        outstandingBalance: (selectedStudent.courseFee || 0) - ((selectedStudent.amountPaid || 0) + Number(feeAmount))
      };
      setSelectedStudent(updatedStudent);

      // Automatically generate PDF receipt
      handlePrintReceipt(updatedStudent);
    })
    .catch(err => alert("Error recording fee: " + err.message));
  };

  const handleUpdateFeeStatus = (feeId, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this payment as ${newStatus}?`)) return;
    
    axios.put(`${API_BASE}/fees/${feeId}/status`, { status: newStatus })
      .then(res => {
        alert(`Payment marked as ${newStatus}`);
        if (activeTab === 'pending-installments') loadPendingFees();
        if (selectedStudent) {
          loadStudentFees(selectedStudent.id);
          loadAdmissions();
          // We could fetch the updated student object here, but relying on loadAdmissions helps.
          axios.get(`${API_BASE}/admissions/${selectedStudent.id}`)
            .then(res2 => setSelectedStudent(res2.data));
        }
      })
      .catch(err => alert("Error updating status: " + err.message));
  };

  const handlePrintReceipt = (student) => {
    const receiptWindow = window.open("", "_blank");
    const dateStr = new Date().toLocaleDateString("en-IN");
    const html = `
      <html>
        <head>
          <title>Fee Receipt - ${student.fullName}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
          <style>
            body { padding: 30px; font-family: sans-serif; }
            .receipt-border { border: 3px double #1e3a5f; padding: 20px; border-radius: 8px; }
            .receipt-header { border-bottom: 2px dashed #1e3a5f; padding-bottom: 15px; margin-bottom: 20px; }
            .college-title { color: #1e3a5f; font-weight: 800; }
            .receipt-title { font-weight: bold; text-decoration: underline; color: #f97316; margin-top: 10px; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="receipt-border">
            <div class="receipt-header text-center">
              <h2 class="college-title mb-1">SUNSHINE</h2>
              <h5 class="text-danger mb-2">SEONI (M.P.)</h5>
              <p class="mb-0 text-muted small">AFFILIATION -DGT-12/1/18-TC | MIS CODE - PU23001071</p>
              <h4 class="receipt-title text-uppercase">Official Fee Receipt</h4>
            </div>
            
            <div class="row mb-4">
               <div class="col-6"><strong>Receipt No:</strong> SUNSHINE/${new Date().getFullYear()}/${student.id}</div>
               <div class="col-6 text-end"><strong>Date:</strong> ${dateStr}</div>
            </div>
            
            <table class="table table-bordered">
              <tbody>
                <tr><th width="40%">Application Number</th><td class="fw-bold text-danger" style="font-size: 1.1rem;">ITI${new Date().getFullYear()}/${String(student.id).padStart(2, '0')}</td></tr>
                <tr><th>Student Full Name</th><td class="fw-bold">${student.fullName}</td></tr>
                <tr><th>Father's Name</th><td>${student.fatherName}</td></tr>
                <tr><th>Mother's Name</th><td>${student.motherName}</td></tr>
                <tr><th>Aadhar Number</th><td>${student.aadharNo}</td></tr>
                <tr><th>Trade Preference</th><td class="fw-bold text-primary">${student.trade}</td></tr>
                <tr><th>Total Course Fee (Annual)</th><td class="fw-bold">₹ ${(student.courseFee || 0).toLocaleString('en-IN')}</td></tr>
                <tr><th>Amount Paid so far</th><td class="fw-bold text-success">₹ ${(student.amountPaid || 0).toLocaleString('en-IN')}</td></tr>
                <tr><th>Remaining Pay</th><td class="fw-bold text-danger">₹ ${(student.outstandingBalance || 0).toLocaleString('en-IN')}</td></tr>
                <tr><th>Payment Method</th><td>${student.paymentMethod || 'N/A'}</td></tr>
                <tr><th>Transaction ID / UTR</th><td>${student.transactionId || 'N/A'}</td></tr>
                <tr><th>Application Status</th><td class="fw-bold" style="color: ${student.status === 'APPROVED' ? '#10b981' : student.status === 'REJECTED' ? '#ef4444' : '#f59e0b'}">${student.status === 'PENDING' ? 'UNDER PROCESS' : student.status}</td></tr>
                <tr><th>Payment Status</th><td class="fw-bold" style="color: ${student.paymentStatus === 'COMPLETED' ? '#10b981' : '#f59e0b'}">${student.paymentStatus || 'PENDING'}</td></tr>
                ${student.adminRemarks ? `<tr><th>Admin Remarks</th><td style="white-space: pre-wrap;">${student.adminRemarks}</td></tr>` : ''}
              </tbody>
            </table>
            
            <div class="row mt-5 pt-3">
              <div class="col-6 text-center"><br><p class="small text-muted" style="border-top: 1px solid #000; display: inline-block; padding-top: 5px; width: 150px;">Student Signature</p></div>
              <div class="col-6 text-center"><br><p class="small text-muted" style="border-top: 1px solid #000; display: inline-block; padding-top: 5px; width: 150px;">Authorized Authority</p></div>
            </div>
            
            <div class="text-center mt-5 small text-muted">
              * This is a computer generated document and requires no physical signature.
            </div>
          </div>
        </body>
      </html>
    `;
    receiptWindow.document.write(html);
    receiptWindow.document.close();
  };

  const handlePrintAdmissionForm = (student) => {
    const printWindow = window.open('', '_blank');
    const html = `
      <html>
        <head>
          <title>Admission Form - ${student.fullName}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { font-family: 'Times New Roman', serif; padding: 2rem; color: #000; }
            .header-text { text-align: center; margin-bottom: 1rem; }
            .header-text h2 { color: #dc3545; font-weight: bold; margin-bottom: 0.2rem; font-size: 28px; }
            .header-text h5 { color: #0d6efd; font-weight: bold; font-size: 18px; }
            .section-title { background-color: #f8f9fa; padding: 0.5rem; border: 1px solid #dee2e6; font-weight: bold; text-transform: uppercase; margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 14px; }
            .info-table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; }
            .info-table th, .info-table td { border: 1px solid #dee2e6; padding: 0.4rem; font-size: 0.95rem; }
            .info-table th { width: 25%; background-color: #f8f9fa; font-weight: 600; }
            .photo-box { width: 130px; height: 160px; border: 1px solid #000; text-align: center; float: right; margin-left: auto; }
            .photo-box img { width: 100%; height: 100%; object-fit: cover; }
            @media print {
              body { padding: 0; }
              .btn-print { display: none; }
            }
          </style>
        </head>
        <body onload="window.print()">
          <div class="container-fluid" style="max-width: 900px; margin: 0 auto;">
            <div class="row align-items-center mb-3">
              <div class="col-2 text-center">
                <img src="/logo.png" alt="Logo" style="max-height: 80px;" onerror="this.style.display='none'" />
              </div>
              <div class="col-8 header-text">
                <h2>SUNSHINE ITI COLLEGE</h2>
                <h5>SEONI (M.P.)</h5>
                <p class="mb-0 small">AFFILIATION - DGT-12/1/18-TC | MIS CODE - PU23001071</p>
                <h4 class="mt-2 text-decoration-underline" style="font-weight:bold;font-size:20px;">ADMISSION APPLICATION FORM</h4>
              </div>
              <div class="col-2">
                <div class="photo-box">
                  <img src="${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admissions/${student.id}/files/photo" alt="Photo" onerror="this.src=''; this.alt='Paste Photo Here';" />
                </div>
              </div>
            </div>

            <div class="row mb-2">
              <div class="col-6"><strong>Application No:</strong> ITI${new Date().getFullYear()}/${String(student.id).padStart(2, '0')}</div>
              <div class="col-6 text-end"><strong>Applied Trade:</strong> <span style="border-bottom: 1px dashed #000; font-weight: bold; color: #dc3545;">${student.trade}</span></div>
            </div>

            <div class="section-title">Personal Details</div>
            <table class="info-table">
              <tr><th>Full Name</th><td colspan="3" class="fw-bold text-uppercase">${student.fullName}</td></tr>
              <tr><th>Father's Name</th><td class="text-uppercase">${student.fatherName}</td><th>Mother's Name</th><td class="text-uppercase">${student.motherName}</td></tr>
              <tr><th>Date of Birth</th><td>${student.dob}</td><th>Gender</th><td>${student.gender}</td></tr>
              <tr><th>Category</th><td>${student.category}</td><th>Religion</th><td>${student.religion}</td></tr>
              <tr><th>Aadhar No.</th><td>${student.aadharNo}</td><th>Samagra ID</th><td>${student.samagraId}</td></tr>
              <tr><th>Blood Group</th><td>${student.bloodGroup || 'N/A'}</td><th>Is PH (Handicapped)</th><td>${student.isPH || 'No'}</td></tr>
              <tr><th>Annual Income</th><td colspan="3">₹ ${student.annualIncome || 'N/A'}</td></tr>
            </table>

            <div class="section-title">Contact Information</div>
            <table class="info-table">
              <tr><th>Mobile Number</th><td>${student.mobile}</td><th>WhatsApp Number</th><td>${student.whatsapp || 'N/A'}</td></tr>
              <tr><th>Parent's Mobile</th><td>${student.parentMobile || 'N/A'}</td><th>Email Address</th><td>${student.email || 'N/A'}</td></tr>
              <tr><th>Permanent Address</th><td colspan="3">${student.address}, ${student.post || ''}, ${student.tehsil}, ${student.distt}, ${student.state} - ${student.pin}</td></tr>
            </table>

            <div class="section-title">Educational Qualification</div>
            <table class="info-table text-center">
              <tr><th>Examination</th><th>Board/University</th><th>School/College Name</th><th>Passing Year</th><th>Marks Obt / Total</th></tr>
              <tr>
                <td>10th / High School</td>
                <td>${student.tenthBoard || 'N/A'}</td>
                <td>${student.tenthSchool || 'N/A'}</td>
                <td>${student.tenthYear || 'N/A'}</td>
                <td>${student.tenthMarksObt || 0} / ${student.tenthTotalMarks || 0}</td>
              </tr>
              ${student.twelfthBoard ? `
              <tr>
                <td>12th / Higher Secondary</td>
                <td>${student.twelfthBoard}</td>
                <td>${student.twelfthSchool || 'N/A'}</td>
                <td>${student.twelfthYear || 'N/A'}</td>
                <td>${student.twelfthMarksObt || 0} / ${student.twelfthTotalMarks || 0}</td>
              </tr>
              ` : ''}
            </table>

            <div class="section-title">Declaration</div>
            <p class="small text-justify" style="line-height: 1.4; margin-top: 0.5rem; margin-bottom: 0;">
              I hereby declare that all the information provided by me in this application form is true and correct to the best of my knowledge. I understand that if any information is found to be false or incorrect, my admission may be cancelled at any stage. I agree to abide by the rules and regulations of Sunshine ITI College.
            </p>

            <div class="row pt-4" style="margin-top: 3rem;">
              <div class="col-4 text-center">
                <div style="width: 150px; height: 50px; border-bottom: 1px dashed #000; margin: 0 auto; display: flex; align-items: end; justify-content: center;">
                  <img src="${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admissions/${student.id}/files/signature" alt="Signature" style="max-height: 100%; max-width: 100%;" onerror="this.style.display='none'" />
                </div>
                <p class="mt-2 mb-0 fw-bold">Signature of Student</p>
              </div>
              <div class="col-4 text-center">
                <div style="width: 150px; height: 50px; border-bottom: 1px dashed #000; margin: 0 auto;"></div>
                <p class="mt-2 mb-0 fw-bold">Signature of Parent/Guardian</p>
              </div>
              <div class="col-4 text-center">
                <div style="width: 150px; height: 50px; border-bottom: 1px dashed #000; margin: 0 auto;"></div>
                <p class="mt-2 mb-0 fw-bold">Authorized Signatory</p>
              </div>
            </div>
            
            <div class="text-center mt-4 small text-muted">
              * This document is a computer-generated copy of the student's admission record.
            </div>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleExportCSV = () => {
    if (admissions.length === 0) {
      alert("No records to export.");
      return;
    }
    const headers = [
      "ID", "Trade", "Full Name", "Father Name", "Mother Name", "Aadhar No", "Samagra ID", 
      "DOB", "Category", "Gender", "Religion",
      "Address", "Post Office", "Tehsil", "District", "State", "Pin Code", 
      "Mobile", "Parent Mobile", "WhatsApp", "Email", "Status", "Applied Date",
      "Course Fee", "Amount Paid", "Outstanding Balance", "Payment Status", "Payment Method", "Transaction ID"
    ];
    
    const rows = admissions.map(student => [
      student.id,
      student.trade,
      student.fullName,
      student.fatherName,
      student.motherName,
      student.aadharNo,
      student.samagraId,
      student.dob,
      student.category,
      student.gender,
      student.religion,
      student.address,
      student.post,
      student.tehsil,
      student.distt,
      student.state,
      student.pin,
      student.mobile,
      student.parentMobile,
      student.whatsapp,
      student.email,
      student.status,
      student.appliedDate,
      student.courseFee,
      student.amountPaid,
      student.outstandingBalance,
      student.paymentStatus,
      student.paymentMethod,
      student.transactionId
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => {
        const cell = val === null || val === undefined ? "" : String(val).replace(/"/g, '""');
        return `"${cell}"`;
      }).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Sunshine_ITI_Student_Records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadBulkTemplate = () => {
    window.location.href = `${API_BASE}/admissions/bulk-upload/template`;
  };

  const handleBulkUpload = (e) => {
    e.preventDefault();
    if (!bulkFile) {
      alert("Please select a CSV file first.");
      return;
    }
    setUploadingBulk(true);
    const formData = new FormData();
    formData.append('file', bulkFile);
    
    axios.post(`${API_BASE}/admissions/bulk-upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      alert(res.data.message || "Bulk upload completed successfully");
      setShowBulkUploadModal(false);
      setBulkFile(null);
      loadAdmissions();
    })
    .catch(err => {
      alert("Bulk upload failed: " + (err.response?.data?.error || err.message));
    })
    .finally(() => {
      setUploadingBulk(false);
    });
  };

  const handleStatusUpdate = (id, newStatus) => {
    if (newStatus === 'APPROVED') {
      alert("Approving admission and sending confirmation email with Portal Login details. Please wait...");
    }
    axios.put(`${API_BASE}/admissions/${id}/status`, { status: newStatus })
      .then(res => {
        loadAdmissions();
        setSelectedStudent(res.data);
        if (newStatus === 'APPROVED') {
          alert("Admission Approved! An email has been successfully sent to the student.");
        }
      })
      .catch(err => alert("Failed to update status: " + err.message));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this application? This will permanently delete all database entries and BLOB documents.")) {
      axios.delete(`${API_BASE}/admissions/${id}`)
        .then(() => {
          loadAdmissions();
          setSelectedStudent(null);
          alert("Application deleted successfully.");
        })
        .catch(err => alert("Failed to delete application: " + err.message));
    }
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(editFormData).forEach(key => {
      if (editFormData[key] !== null && editFormData[key] !== undefined && editFormData[key] !== '') {
        formData.append(key, editFormData[key]);
      }
    });
    axios.post(`${API_BASE}/admissions/${selectedStudent.id}/update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(res => {
        loadAdmissions();
        setSelectedStudent(res.data);
        setIsEditing(false);
        alert("Details updated successfully.");
      })
      .catch(err => alert("Failed to save changes: " + err.message));
  };

  const handleEditFileChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.files[0] });
  };

  const handleEmailReceipt = (id) => {
    alert("Sending email receipt to student. Please wait...");
    axios.post(`${API_BASE}/admissions/${id}/send-receipt`)
      .then(res => {
        alert(res.data.message || "Receipt emailed successfully");
      })
      .catch(err => {
        alert("Failed to email receipt: " + (err.response?.data?.error || err.message));
      });
  };

  const handleGenerateCertificate = () => {
    setShowCertificateModal(true);
  };

  const submitCertificateFee = (e) => {
    e.preventDefault();
    if (certPaymentMethod !== 'Cash' && !certTxnId) {
      alert("Please enter Transaction ID for " + certPaymentMethod);
      return;
    }
    
    const formData = new FormData();
    formData.append('admissionId', selectedStudent.id);
    formData.append('amount', certFee);
    formData.append('paymentMethod', certPaymentMethod);
    formData.append('transactionId', certTxnId);

    axios.post(`${API_BASE}/fees/certificate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(res => {
        alert("Certificate Fee of ₹" + certFee + " collected successfully!");
        setShowCertificateModal(false);
        setCertTxnId('');
        // Open the generated certificate
        window.open(`${API_BASE}/admin/certificate/${selectedStudent.id}`, '_blank');
        loadAdmissions(); // Refresh stats and student details
      })
      .catch(err => {
        alert("Failed to collect fee: " + (err.response?.data?.error || err.message));
      });
  };

  const handleWhatsApp = (student) => {
    let message = `Hello ${student.fullName},\nThis is Sunshine.\nYour application for the ${student.trade} trade is currently ${student.status}.\n`;
    if (student.status === 'APPROVED') {
      message += `Your admission is approved! Please login to the Student Portal (Application No: ITI/2026/${student.id}) using your DOB as password.\nOutstanding Balance: ₹${student.outstandingBalance || 0}\nThank you!`;
    }
    const encodedMessage = encodeURIComponent(message);
    let phone = student.mobile || '';
    if (phone.length === 10) phone = '91' + phone;
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  // Send Notification Handler
  const handleSendNotification = (e) => {
    e.preventDefault();
    setNotifSuccess("Sending notification... Please wait, this may take a moment for large attachments.");
    
    const formData = new FormData();
    formData.append('subject', notifSubject);
    formData.append('message', notifMessage);
    formData.append('recipientType', notifRecipient);
    if (notifFile) {
      formData.append('file', notifFile);
    }

    axios.post(`${API_BASE}/admin/broadcast`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      setNotifSuccess(res.data.message || `Notification successfully broadcasted to ${notifRecipient} students!`);
      setNotifSubject('');
      setNotifMessage('');
      setNotifFile(null);
      // reset file input
      const fileInput = document.getElementById('notifFile');
      if (fileInput) fileInput.value = '';
      setTimeout(() => setNotifSuccess(''), 5000);
    })
    .catch(err => {
      setNotifSuccess("Failed to send notification: " + (err.response?.data?.error || err.message));
    });
  };

  // Profile and Password Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileSuccess("Saving profile changes...");
    
    axios.put(`${API_BASE}/admin/profile`, {
      currentEmail: admin?.email,
      newUsername: profileName,
      newEmail: profileEmail
    })
    .then((res) => {
      setProfileSuccess("Admin Profile updated successfully.");
      setAdmin(res.data);
      localStorage.setItem("adminUser", JSON.stringify(res.data));
      setTimeout(() => setProfileSuccess(''), 3000);
    })
    .catch((err) => {
      setProfileError(err.response?.data?.error || "Failed to update profile.");
      setProfileSuccess('');
      setTimeout(() => setProfileError(''), 4000);
    });
  };

  const handleChangePasswordProfile = (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setProfileError("New passwords do not match.");
      return;
    }
    setProfileSuccess("Updating password...");
    setProfileError('');
    
    axios.put(`${API_BASE}/admin/change-password`, {
      email: admin?.email || profileEmail,
      currentPassword: oldPassword,
      newPassword: newPass
    })
    .then(() => {
      setProfileSuccess("Password updated successfully.");
      setOldPassword('');
      setNewPass('');
      setConfirmPass('');
      
      // Update local storage password if it's there
      const currentAdmin = JSON.parse(localStorage.getItem("adminUser"));
      if (currentAdmin) {
        currentAdmin.password = newPass;
        localStorage.setItem("adminUser", JSON.stringify(currentAdmin));
        setAdmin(currentAdmin);
      }
      
      setTimeout(() => setProfileSuccess(''), 3000);
    })
    .catch(err => {
      setProfileError(err.response?.data?.error || "Failed to update password. Check current password.");
      setProfileSuccess('');
      setTimeout(() => setProfileError(''), 4000);
    });
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    setAddAdminSuccess("Creating admin...");
    setAddAdminError('');
    
    axios.post(`${API_BASE}/admin/signup`, {
      username: newAdminUsername,
      email: newAdminEmail,
      password: newAdminPassword
    })
    .then((res) => {
      setAddAdminSuccess(`New admin '${res.data.username}' created successfully!`);
      setNewAdminUsername('');
      setNewAdminEmail('');
      setNewAdminPassword('');
      setTimeout(() => setAddAdminSuccess(''), 4000);
    })
    .catch(err => {
      setAddAdminError(err.response?.data?.error || "Failed to create admin.");
      setAddAdminSuccess('');
      setTimeout(() => setAddAdminError(''), 4000);
    });
  };

  // Dynamic statistics
  const totalStudentsCount = admissions.length;
  const totalRevenueVal = admissions.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const pendingVerificationsCount = admissions.filter(a => a.status === 'PENDING').length;

  // Group Trade Counts for Chart
  const tradeCounts = {
    ELECTRICIAN: 0,
    FITTER: 0,
    COPA: 0,
    WELDER: 0,
    'DIESEL': 0,
    'OTHERS': 0
  };
  admissions.forEach(a => {
    const t = (a.trade || '').toUpperCase().trim();
    if (t.includes('ELECTRICIAN')) tradeCounts.ELECTRICIAN++;
    else if (t.includes('FITTER')) tradeCounts.FITTER++;
    else if (t.includes('COPA')) tradeCounts.COPA++;
    else if (t.includes('WELDER')) tradeCounts.WELDER++;
    else if (t.includes('DIESEL')) tradeCounts['DIESEL']++;
    else tradeCounts.OTHERS++;
  });
  const maxTradeVal = Math.max(...Object.values(tradeCounts), 1);

  // Group Monthly Revenue for Chart
  const monthsList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyRevenue = {
    Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
    Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
  };
  admissions.forEach(a => {
    if (!a.appliedDate) return;
    try {
      const d = new Date(a.appliedDate);
      const m = monthsList[d.getMonth()];
      monthlyRevenue[m] += (a.amountPaid || 0);
    } catch (e) {}
  });
  const maxRevenueVal = Math.max(...Object.values(monthlyRevenue), 1);

  // Filter lists based on Tab and search query
  const getFilteredAdmissions = () => {
    let list = [...admissions];
    if (activeTab === 'pending-payments') {
      list = list.filter(a => a.paymentStatus !== 'COMPLETED' || a.outstandingBalance > 0);
    }
    
    if (filterTrade !== 'ALL') {
      list = list.filter(a => (a.trade || '').toUpperCase().includes(filterTrade));
    }

    if (filterYear !== 'ALL') {
      list = list.filter(a => {
        if (!a.appliedDate) return false;
        const year = new Date(a.appliedDate).getFullYear().toString();
        return year === filterYear;
      });
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      list = list.filter(a => 
        (a.fullName || '').toLowerCase().includes(query) ||
        (a.trade || '').toLowerCase().includes(query) ||
        (a.transactionId || '').toLowerCase().includes(query)
      );
    }
    return list;
  };

  const filteredAdmissions = getFilteredAdmissions();

  const getFilteredFees = () => {
    let list = [...allFees];
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      list = list.filter(f => 
        (f.admissionDetail?.fullName || '').toLowerCase().includes(query) ||
        (f.paymentMethod || '').toLowerCase().includes(query) ||
        (f.transactionId || '').toLowerCase().includes(query)
      );
    }
    return list;
  };

  const filteredFees = getFilteredFees();

  // Render Views dynamically based on active tab
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="admin-page-title" style={{ margin: 0, border: 'none', padding: 0 }}>Dashboard Overview</h2>
              <div style={{ fontSize: '0.9rem', color: darkMode ? '#94a3b8' : 'gray' }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <AnalyticsDashboard students={admissions} />
          </div>
        );

      case 'all-payments':
        return (
          <div>
            <h2 className="admin-page-title">All Payments Log (Transaction History)</h2>
            
            <div className="admin-card">
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <input 
                  type="text" 
                  className="admin-form-control" 
                  placeholder="Search by student name, method or UTR..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ maxWidth: '400px' }}
                />
              </div>

              <div className="table-responsive">
                <table className="premium-admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Candidate Name</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Transaction ID / UTR</th>
                      <th>Receipt</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFees.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      filteredFees.map(fee => (
                        <tr key={fee.id} style={{ cursor: 'pointer' }} onClick={() => { if (fee.admissionDetail) { handleSelectStudent(fee.admissionDetail); navigate('/admin/all-students'); } }}>
                          <td>{new Date(fee.paymentDate).toLocaleDateString('en-IN')}</td>
                          <td style={{ fontWeight: 700 }}>{fee.admissionDetail?.fullName || 'N/A'}</td>
                          <td style={{ color: '#22c55e', fontWeight: 600 }}>₹ {fee.amount.toLocaleString('en-IN')}</td>
                          <td>{fee.paymentMethod}</td>
                          <td style={{ fontFamily: 'monospace' }}>{fee.transactionId || '-'}</td>
                          <td>
                            {fee.receiptName ? (
                              <a href={`${API_BASE}/fees/${fee.id}/receipt`} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }} onClick={e => e.stopPropagation()}>Download</a>
                            ) : '-'}
                          </td>
                          <td>
                            <span className={`admin-badge ${fee.status === 'APPROVED' ? 'admin-badge-success' : fee.status === 'REJECTED' ? 'admin-badge-danger' : 'admin-badge-warning'}`}>
                              {fee.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'pending-payments':
        return (
          <div>
            <h2 className="admin-page-title">Pending Payment Clearances</h2>
            
            <div className="admin-card">
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <input 
                  type="text" 
                  className="admin-form-control" 
                  placeholder="Search by student name, trade or Transaction ID/UTR..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ maxWidth: '400px' }}
                />
              </div>

              <div className="table-responsive">
                <table className="premium-admin-table">
                  <thead>
                    <tr>
                      <th>Candidate Name</th>
                      <th>Trade</th>
                      <th>Course Fee</th>
                      <th>Amount Paid</th>
                      <th>Remaining Pay</th>
                      <th>Method</th>
                      <th>Transaction ID / UTR</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmissions.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>
                          No payment transactions match the query.
                        </td>
                      </tr>
                    ) : (
                      filteredAdmissions.map(student => (
                        <tr key={student.id} style={{ cursor: 'pointer' }} onClick={() => { handleSelectStudent(student); navigate('/admin/all-students'); }}>
                          <td style={{ fontWeight: 700 }}>{student.fullName}</td>
                          <td>{student.trade}</td>
                          <td>₹ {(student.courseFee || 0).toLocaleString('en-IN')}</td>
                          <td style={{ color: '#22c55e', fontWeight: 600 }}>₹ {(student.amountPaid || 0).toLocaleString('en-IN')}</td>
                          <td style={{ color: '#ef4444', fontWeight: 600 }}>₹ {(student.outstandingBalance || 0).toLocaleString('en-IN')}</td>
                          <td>{student.paymentMethod || 'N/A'}</td>
                          <td style={{ fontFamily: 'monospace' }}>{student.transactionId || 'N/A'}</td>
                          <td>
                            <span className={`admin-badge ${
                              student.paymentStatus === 'COMPLETED' ? 'admin-badge-success' : 
                              student.paymentStatus === 'FAILED' ? 'admin-badge-danger' : 
                              'admin-badge-warning'
                            }`}>
                              {student.paymentStatus || 'PENDING'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'pending-installments':
        return (
          <div>
            <h2 className="admin-page-title">Pending Fee Installments</h2>
            <div className="admin-card">
              {pendingFees.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>
                  No pending installments.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="premium-admin-table">
                    <thead>
                      <tr>
                        <th>Candidate ID</th>
                        <th>Amount</th>
                        <th>Method</th>
                        <th>Transaction ID</th>
                        <th>Date Submitted</th>
                        <th>Receipt</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingFees.map(fee => (
                        <tr key={fee.id}>
                          <td>{fee.admissionDetail?.id} - {fee.admissionDetail?.fullName}</td>
                          <td style={{ color: '#22c55e', fontWeight: 600 }}>₹ {fee.amount.toLocaleString('en-IN')}</td>
                          <td>{fee.paymentMethod}</td>
                          <td style={{ fontFamily: 'monospace' }}>{fee.transactionId || 'N/A'}</td>
                          <td>{new Date(fee.paymentDate).toLocaleDateString()}</td>
                          <td>
                            {fee.receiptName ? (
                              <a href={`${API_BASE}/fees/${fee.id}/receipt`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">View</a>
                            ) : 'No Receipt'}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => handleUpdateFeeStatus(fee.id, 'APPROVED')} className="btn btn-sm btn-success">Approve</button>
                              <button onClick={() => handleUpdateFeeStatus(fee.id, 'REJECTED')} className="btn btn-sm btn-danger">Reject</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'all-students':
        return (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2 className="admin-page-title" style={{ margin: 0 }}>Student Admissions Management</h2>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button onClick={handleExportCSV} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                    <Download size={16} /> Export CSV
                  </button>
                  <button onClick={() => setShowBulkUploadModal(true)} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                    <Database size={16} /> Bulk Upload CSV
                  </button>
                </div>
              </div>

              <div className="admin-card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', padding: '1rem', backgroundColor: darkMode ? '#1e293b' : '#f8fafc', border: '1px solid var(--admin-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Course:</span>
                  <select 
                    className="admin-form-control" 
                    value={filterTrade} 
                    onChange={(e) => setFilterTrade(e.target.value)}
                    style={{ width: '150px', padding: '0.4rem' }}
                  >
                    <option value="ALL">All Courses</option>
                    <option value="ELECTRICIAN">Electrician</option>
                    <option value="FITTER">Fitter</option>
                    <option value="COPA">COPA</option>
                    <option value="WELDER">Welder</option>
                    <option value="HEALTH">Health Sanitary Inspector</option>
                    <option value="DCA">DCA</option>
                    <option value="PGDCA">PGDCA</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--admin-text-muted)' }}>Year:</span>
                  <select 
                    className="admin-form-control" 
                    value={filterYear} 
                    onChange={(e) => setFilterYear(e.target.value)}
                    style={{ width: '120px', padding: '0.4rem' }}
                  >
                    <option value="ALL">All Years</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                </div>

                <div style={{ flex: 1, minWidth: '200px' }}>
                  <input 
                    type="text" 
                    className="admin-form-control" 
                    placeholder="Search applicants..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '0.4rem 0.8rem' }}
                  />
                </div>
              </div>
            </div>

            <div className="admin-split-workspace">
              {/* Left Column: List */}
              <div className="admin-card" style={{ padding: 0, maxHeight: '720px', overflowY: 'auto' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--admin-border)', fontWeight: 700, backgroundColor: 'rgba(0,0,0,0.02)' }}>
                  Registrations ({filteredAdmissions.length})
                </div>
                {loading && filteredAdmissions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>Loading...</div>
                ) : filteredAdmissions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>No student records found.</div>
                ) : (
                  filteredAdmissions.map(student => {
                    const isSel = selectedStudent?.id === student.id;
                    const stBadge = student.status === 'APPROVED' ? 'admin-badge-success' : student.status === 'REJECTED' ? 'admin-badge-danger' : 'admin-badge-warning';
                    return (
                      <div 
                        key={student.id} 
                        onClick={() => handleSelectStudent(student)}
                        style={{
                          padding: '1rem',
                          borderBottom: '1px solid var(--admin-border)',
                          cursor: 'pointer',
                          backgroundColor: isSel ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                          borderLeft: isSel ? '4px solid #2563eb' : '4px solid transparent'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--admin-text-main)' }}>{student.fullName}</h4>
                          <span className={`admin-badge ${stBadge}`}>{student.status}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--admin-text-main)', fontWeight: 500 }}><Briefcase size={13} /> {student.trade}</span>
                          {student.fatherName && <span><strong>Father:</strong> {student.fatherName}</span>}
                          {student.motherName && <span><strong>Mother:</strong> {student.motherName}</span>}
                          {student.mobile && <span><strong>Mobile:</strong> {student.mobile}</span>}
                          {student.address && <span><strong>Address:</strong> {student.address}{student.distt ? `, ${student.distt}` : ''}</span>}
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}><Calendar size={13} /> {new Date(student.appliedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Details */}
              <div className="admin-card" style={{ minHeight: '600px', padding: '2rem' }}>
                {!selectedStudent ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--admin-text-muted)' }}>
                    <Shield size={64} style={{ opacity: 0.15, marginBottom: '1rem' }} />
                    <h3>Select a Trainee Record</h3>
                    <p style={{ fontSize: '0.85rem' }}>Click on a registration from the list to view files and perform actions.</p>
                  </div>
                ) : isEditing ? (
                  /* Editable view */
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <button className="btn btn-secondary" onClick={() => setIsEditing(false)} style={{ padding: '0.4rem 0.8rem', color: 'var(--admin-text-main)', borderColor: 'var(--admin-border)' }}>
                        <ArrowLeft size={16} /> Cancel
                      </button>
                      <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Edit Full Application</h3>
                    </div>

                    <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <h4 style={{ fontSize: '1rem', color: '#2563eb', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>Personal & Academic Details</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <div className="admin-form-group">
                          <label>Candidate Name</label>
                          <input type="text" name="fullName" className="admin-form-control" value={editFormData.fullName || ''} onChange={handleEditChange} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Trade Preference</label>
                          <select name="trade" className="admin-form-control" value={editFormData.trade || ''} onChange={handleEditChange} required>
                            <option value="ELECTRICIAN">ELECTRICIAN</option>
                            <option value="FITTER">FITTER</option>
                            <option value="COPA">COPA</option>
                            <option value="WELDER">WELDER</option>
                            <option value="DIESEL MECHANIC">DIESEL MECHANIC</option>
                          </select>
                        </div>
                        <div className="admin-form-group">
                          <label>DOB</label>
                          <input type="date" name="dob" className="admin-form-control" value={editFormData.dob || ''} onChange={handleEditChange} />
                        </div>
                        <div className="admin-form-group">
                          <label>Father's Name</label>
                          <input type="text" name="fatherName" className="admin-form-control" value={editFormData.fatherName || ''} onChange={handleEditChange} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Mother's Name</label>
                          <input type="text" name="motherName" className="admin-form-control" value={editFormData.motherName || ''} onChange={handleEditChange} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Aadhar No</label>
                          <input type="text" name="aadharNo" className="admin-form-control" value={editFormData.aadharNo || ''} onChange={handleEditChange} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Mobile Number</label>
                          <input type="text" name="mobile" className="admin-form-control" value={editFormData.mobile || ''} onChange={handleEditChange} required />
                        </div>
                        <div className="admin-form-group">
                          <label>Email Address</label>
                          <input type="email" name="email" className="admin-form-control" value={editFormData.email || ''} onChange={handleEditChange} />
                        </div>
                        <div className="admin-form-group">
                          <label>Category</label>
                          <select name="category" className="admin-form-control" value={editFormData.category || ''} onChange={handleEditChange}>
                            <option value="UR">UR</option>
                            <option value="OBC">OBC</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                            <option value="EWS">EWS</option>
                          </select>
                        </div>
                        <div className="admin-form-group">
                          <label>10th Marks (Obt / Total)</label>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="number" name="tenthMarksObt" className="admin-form-control" value={editFormData.tenthMarksObt || ''} onChange={handleEditChange} placeholder="Obtained" />
                            <input type="number" name="tenthTotalMarks" className="admin-form-control" value={editFormData.tenthTotalMarks || ''} onChange={handleEditChange} placeholder="Total" />
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label>12th Marks (Obt / Total)</label>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="number" name="twelfthMarksObt" className="admin-form-control" value={editFormData.twelfthMarksObt || ''} onChange={handleEditChange} placeholder="Obtained" />
                            <input type="number" name="twelfthTotalMarks" className="admin-form-control" value={editFormData.twelfthTotalMarks || ''} onChange={handleEditChange} placeholder="Total" />
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label>Address</label>
                          <input type="text" name="address" className="admin-form-control" value={editFormData.address || ''} onChange={handleEditChange} />
                        </div>
                      </div>

                      <h4 style={{ fontSize: '1rem', color: '#2563eb', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem', marginTop: '1rem' }}>Update Documents (Leave blank to keep existing)</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        <div className="admin-form-group">
                          <label>Photo</label>
                          <input type="file" name="photo" className="admin-form-control" onChange={handleEditFileChange} accept="image/*" />
                        </div>
                        <div className="admin-form-group">
                          <label>Signature</label>
                          <input type="file" name="signature" className="admin-form-control" onChange={handleEditFileChange} accept="image/*" />
                        </div>
                        <div className="admin-form-group">
                          <label>Aadhar Document</label>
                          <input type="file" name="aadharDocument" className="admin-form-control" onChange={handleEditFileChange} accept="image/*,.pdf" />
                        </div>
                        <div className="admin-form-group">
                          <label>10th Marksheet</label>
                          <input type="file" name="tenthDocument" className="admin-form-control" onChange={handleEditFileChange} accept="image/*,.pdf" />
                        </div>
                        <div className="admin-form-group">
                          <label>12th Marksheet</label>
                          <input type="file" name="twelfthDocument" className="admin-form-control" onChange={handleEditFileChange} accept="image/*,.pdf" />
                        </div>
                        <div className="admin-form-group">
                          <label>Samagra ID</label>
                          <input type="file" name="samagraDocument" className="admin-form-control" onChange={handleEditFileChange} accept="image/*,.pdf" />
                        </div>
                        <div className="admin-form-group">
                          <label>Caste Certificate</label>
                          <input type="file" name="casteDocument" className="admin-form-control" onChange={handleEditFileChange} accept="image/*,.pdf" />
                        </div>
                        <div className="admin-form-group">
                          <label>Income Certificate</label>
                          <input type="file" name="incomeDocument" className="admin-form-control" onChange={handleEditFileChange} accept="image/*,.pdf" />
                        </div>
                        <div className="admin-form-group">
                          <label>Domicile Certificate</label>
                          <input type="file" name="domicileDocument" className="admin-form-control" onChange={handleEditFileChange} accept="image/*,.pdf" />
                        </div>
                      </div>

                      <div className="admin-form-group" style={{ marginTop: '1rem' }}>
                        <label>Admin Remarks</label>
                        <textarea name="adminRemarks" className="admin-form-control" value={editFormData.adminRemarks || ''} onChange={handleEditChange} rows="3" placeholder="Add verification remarks, notes, etc." />
                      </div>

                      <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', alignSelf: 'flex-end', backgroundColor: '#2563eb', border: 'none' }}>
                        Save All Changes
                      </button>
                    </form>
                  </div>
                ) : (
                  /* Detail display view */
                  <div>
                    {/* Header bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.05)', border: '1px solid var(--admin-border)' }}>
                          <img 
                            src={`${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admissions/${selectedStudent.id}/files/photo`} 
                            alt={selectedStudent.fullName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--admin-text-main)' }}>{selectedStudent.fullName}</h3>
                          <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>Applied for: <strong style={{ color: '#2563eb' }}>{selectedStudent.trade}</strong></span>
                          <div style={{ marginTop: '0.25rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--danger-color)' }}>
                            Application No: ITI{new Date().getFullYear()}/{String(selectedStudent.id).padStart(2, '0')}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button onClick={() => handleWhatsApp(selectedStudent)} className="btn btn-primary" style={{ backgroundColor: '#22c55e', border: 'none', fontSize: '0.75rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <MessageCircle size={14} /> WhatsApp
                        </button>
                        <button onClick={handleGenerateCertificate} className="btn btn-primary" style={{ backgroundColor: '#8b5cf6', border: 'none', fontSize: '0.75rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Award size={14} /> Generate Certificate
                        </button>
                        <button onClick={() => handlePrintAdmissionForm(selectedStudent)} className="btn btn-primary" style={{ backgroundColor: '#0d9488', border: 'none', fontSize: '0.75rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Printer size={14} /> Print Form
                        </button>
                        <button onClick={() => handlePrintReceipt(selectedStudent)} className="btn btn-primary" style={{ backgroundColor: '#2563eb', border: 'none', fontSize: '0.75rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <FileText size={14} /> Print Receipt
                        </button>
                        <button onClick={() => handleEmailReceipt(selectedStudent.id)} className="btn btn-primary" style={{ backgroundColor: '#f97316', border: 'none', fontSize: '0.75rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Send size={14} /> Email Receipt
                        </button>
                        <button onClick={() => setIsEditing(true)} className="btn btn-secondary" style={{ color: 'var(--admin-text-main)', borderColor: 'var(--admin-border)', fontSize: '0.75rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          <Edit size={14} /> Edit
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(selectedStudent.id, 'APPROVED')} 
                          className="btn" style={{ backgroundColor: '#10b981', border: 'none', color: '#fff', fontSize: '0.75rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                          disabled={selectedStudent.status === 'APPROVED'}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(selectedStudent.id, 'REJECTED')} 
                          className="btn" style={{ backgroundColor: '#ef4444', border: 'none', color: '#fff', fontSize: '0.75rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                          disabled={selectedStudent.status === 'REJECTED'}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                        <button onClick={() => handleDelete(selectedStudent.id)} className="btn-delete" style={{ padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem' }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.4rem', marginBottom: '0.75rem', color: '#2563eb' }}>Personal Information</h4>
                        <table className="premium-admin-table">
                          <tbody>
                            <tr><td style={{ fontWeight: 600, width: '40%' }}>Father's Name</td><td>{selectedStudent.fatherName}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Mother's Name</td><td>{selectedStudent.motherName}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Aadhar No.</td><td>{selectedStudent.aadharNo}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Samagra ID</td><td>{selectedStudent.samagraId}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Date of Birth</td><td>{selectedStudent.dob}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Category</td><td>{selectedStudent.category}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Gender</td><td>{selectedStudent.gender}</td></tr>
                          </tbody>
                        </table>
                      </div>

                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.4rem', marginBottom: '0.75rem', color: '#2563eb' }}>Contact & Qualification</h4>
                        <table className="premium-admin-table">
                          <tbody>
                            <tr><td style={{ fontWeight: 600, width: '40%' }}>Mobile Number</td><td>{selectedStudent.mobile}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Email Address</td><td>{selectedStudent.email}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>Permanent Address</td><td>{selectedStudent.address}, {selectedStudent.tehsil}, {selectedStudent.distt}, {selectedStudent.state} - {selectedStudent.pin}</td></tr>
                            <tr><td style={{ fontWeight: 600 }}>10th Score</td><td>{selectedStudent.tenthMarksObt} / {selectedStudent.tenthTotalMarks} ({selectedStudent.tenthBoard})</td></tr>
                            {selectedStudent.twelfthBoard && (
                              <tr><td style={{ fontWeight: 600 }}>12th Score</td><td>{selectedStudent.twelfthMarksObt} / {selectedStudent.twelfthTotalMarks} ({selectedStudent.twelfthBoard})</td></tr>
                            )}
                            {selectedStudent.adminRemarks && (
                              <tr><td style={{ fontWeight: 600, color: '#f59e0b' }}>Admin Remarks</td><td style={{ whiteSpace: 'pre-wrap' }}>{selectedStudent.adminRemarks}</td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* Fees & offline updates */}
                    <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#2563eb', margin: 0 }}>Fee & Payment Details</h4>
                        {!isEditingPayment && (
                          <button onClick={handleOpenPaymentEditor} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', color: 'var(--admin-text-main)', borderColor: 'var(--admin-border)' }}>
                            Update Payment Record
                          </button>
                        )}
                      </div>

                      {isEditingPayment ? (
                        <form onSubmit={handleSavePaymentEdit} style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--admin-border)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                          <div className="admin-form-group">
                            <label>Total Course Fee (₹)</label>
                            <input type="number" min="0" className="admin-form-control" value={payCourseFee} onChange={(e) => setPayCourseFee(e.target.value)} required />
                          </div>
                          <div className="admin-form-group">
                            <label>Amount Paid (₹)</label>
                            <input type="number" min="0" className="admin-form-control" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} required />
                          </div>
                          <div className="admin-form-group">
                            <label>Payment Method</label>
                            <select className="admin-form-control" value={payMethod} onChange={(e) => setPayMethod(e.target.value)}>
                              <option value="Cash">Cash (Offline)</option>
                              <option value="UPI">UPI</option>
                              <option value="QR Code">PhonePe QR</option>
                              <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                          </div>
                          <div className="admin-form-group">
                            <label>Transaction ID / UTR</label>
                            <input type="text" className="admin-form-control" value={payTxnId} onChange={(e) => setPayTxnId(e.target.value)} placeholder="UTR details" />
                          </div>
                          <div className="admin-form-group">
                            <label>Payment Status</label>
                            <select className="admin-form-control" value={payStatus} onChange={(e) => setPayStatus(e.target.value)}>
                              <option value="PENDING">PENDING</option>
                              <option value="COMPLETED">COMPLETED</option>
                              <option value="FAILED">FAILED</option>
                            </select>
                          </div>

                          <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Admin Remarks</label>
                            <textarea 
                              className="admin-form-control" 
                              rows="2" 
                              placeholder="Any internal notes or remarks about this payment..."
                              value={payRemark} 
                              onChange={(e) => setPayRemark(e.target.value)}
                            ></textarea>
                          </div>

                          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                            <button type="button" className="btn btn-secondary" onClick={() => setIsEditingPayment(false)} style={{ fontSize: '0.8rem', color: 'var(--admin-text-main)', borderColor: 'var(--admin-border)' }}>Cancel</button>
                            <button type="submit" className="btn btn-primary" style={{ fontSize: '0.8rem', backgroundColor: '#2563eb', border: 'none' }}>Save Payment</button>
                          </div>
                        </form>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                          <table className="premium-admin-table">
                            <tbody>
                              <tr><td style={{ fontWeight: 600 }}>Annual Course Fee</td><td>₹ {(selectedStudent.courseFee || 0).toLocaleString('en-IN')}</td></tr>
                              <tr><td style={{ fontWeight: 600 }}>Total Amount Paid</td><td style={{ color: '#10b981', fontWeight: 700 }}>₹ {(selectedStudent.amountPaid || 0).toLocaleString('en-IN')}</td></tr>
                              <tr><td style={{ fontWeight: 600 }}>Remaining Pay</td><td style={{ color: '#ef4444', fontWeight: 700 }}>₹ {(selectedStudent.outstandingBalance || 0).toLocaleString('en-IN')}</td></tr>
                            </tbody>
                          </table>

                          <table className="premium-admin-table">
                            <tbody>
                              <tr>
                                <td style={{ fontWeight: 600 }}>Payment Status</td>
                                <td>
                                  <span className={`admin-badge ${selectedStudent.paymentStatus === 'COMPLETED' ? 'admin-badge-success' : selectedStudent.paymentStatus === 'FAILED' ? 'admin-badge-danger' : 'admin-badge-warning'}`}>
                                    {selectedStudent.paymentStatus || 'PENDING'}
                                  </span>
                                </td>
                              </tr>
                              <tr><td style={{ fontWeight: 600 }}>Payment Method</td><td>{selectedStudent.paymentMethod || 'N/A'}</td></tr>
                              <tr><td style={{ fontWeight: 600 }}>Transaction / UTR</td><td>{selectedStudent.transactionId || 'N/A'}</td></tr>
                              {selectedStudent.paymentReceiptName && (
                                <tr>
                                  <td style={{ fontWeight: 600 }}>Payment Proof Screenshot</td>
                                  <td>
                                    <a 
                                      href={`${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admissions/${selectedStudent.id}/files/paymentReceipt`} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="btn btn-secondary" 
                                      style={{ padding: '0.2rem 0.5rem', fontSize: '11px', color: 'var(--admin-text-main)', borderColor: 'var(--admin-border)' }}
                                    >
                                      View Proof Document
                                    </a>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Document Attachments */}
                    <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1.5rem' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2563eb', marginBottom: '1rem' }}>Uploaded Verification Certificates</h4>
                      
                      {/* Photo & Signature Previews */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>Applicant Photo</span>
                          <div style={{ width: '120px', height: '140px', borderRadius: '8px', border: '1px solid var(--admin-border)', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                            <img src={selectedStudent.photoUrl || `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admissions/${selectedStudent.id}/files/photo`} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                          </div>
                        </div>
                        <div>
                          <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: '0.5rem' }}>Applicant Signature</span>
                          <div style={{ width: '220px', height: '100px', borderRadius: '8px', border: '1px solid var(--admin-border)', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem' }}>
                            <img src={selectedStudent.signatureUrl || `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admissions/${selectedStudent.id}/files/signature`} alt="Signature" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => e.target.style.display = 'none'} />
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                        <a href={selectedStudent.aadharDocUrl || `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admissions/${selectedStudent.id}/files/aadharDocument`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ color: 'var(--admin-text-main)', borderColor: 'var(--admin-border)', fontSize: '0.75rem', justifyContent: 'center', gap: '0.25rem' }}>
                          <Download size={14} /> Aadhar Document
                        </a>
                        <a href={selectedStudent.samagraDocUrl || `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admissions/${selectedStudent.id}/files/samagraDocument`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ color: 'var(--admin-text-main)', borderColor: 'var(--admin-border)', fontSize: '0.75rem', justifyContent: 'center', gap: '0.25rem' }}>
                          <Download size={14} /> Samagra Document
                        </a>
                        <a href={selectedStudent.tenthDocUrl || `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admissions/${selectedStudent.id}/files/tenthDocument`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ color: 'var(--admin-text-main)', borderColor: 'var(--admin-border)', fontSize: '0.75rem', justifyContent: 'center', gap: '0.25rem' }}>
                          <Download size={14} /> 10th Marksheet
                        </a>
                        {selectedStudent.twelfthBoard && (
                          <a href={selectedStudent.twelfthDocUrl || `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admissions/${selectedStudent.id}/files/twelfthDocument`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ color: 'var(--admin-text-main)', borderColor: 'var(--admin-border)', fontSize: '0.75rem', justifyContent: 'center', gap: '0.25rem' }}>
                            <Download size={14} /> 12th Marksheet
                          </a>
                        )}
                        {/* New Optional Certificates */}
                        <a href={selectedStudent.casteDocUrl || `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admissions/${selectedStudent.id}/files/casteDocument`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ color: 'var(--admin-text-main)', borderColor: 'var(--admin-border)', fontSize: '0.75rem', justifyContent: 'center', gap: '0.25rem' }}>
                          <Download size={14} /> Caste Cert (Jaati)
                        </a>
                        <a href={selectedStudent.incomeDocUrl || `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admissions/${selectedStudent.id}/files/incomeDocument`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ color: 'var(--admin-text-main)', borderColor: 'var(--admin-border)', fontSize: '0.75rem', justifyContent: 'center', gap: '0.25rem' }}>
                          <Download size={14} /> Income Cert (Aay)
                        </a>
                        <a href={selectedStudent.domicileDocUrl || `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admissions/${selectedStudent.id}/files/domicileDocument`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ color: 'var(--admin-text-main)', borderColor: 'var(--admin-border)', fontSize: '0.75rem', justifyContent: 'center', gap: '0.25rem' }}>
                          <Download size={14} /> Domicile Cert (Nivas)
                        </a>
                        {selectedStudent.paymentReceiptName && (
                          <a href={selectedStudent.paymentReceiptUrl || `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/admissions/${selectedStudent.id}/files/paymentReceipt`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ color: 'var(--admin-text-main)', borderColor: 'var(--admin-border)', fontSize: '0.75rem', justifyContent: 'center', gap: '0.25rem' }}>
                            <Download size={14} /> Payment Receipt
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Fee Installment Tracking */}
                    <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981', margin: 0 }}>Fee Payments & Installments</h4>
                        <button onClick={() => setIsRecordingFee(!isRecordingFee)} className="btn btn-sm btn-primary" style={{ backgroundColor: '#10b981', border: 'none' }}>
                          {isRecordingFee ? 'Cancel' : '+ Record Manual Payment'}
                        </button>
                      </div>

                      {isRecordingFee && (
                        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1.5rem' }}>
                          <h5 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#047857', marginBottom: '1rem' }}>Record New Payment</h5>
                          <form onSubmit={handleRecordFee} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Amount (₹) *</label>
                              <input type="number" required className="admin-form-control" value={feeAmount} onChange={e => setFeeAmount(e.target.value)} placeholder="e.g. 2000" style={{ padding: '0.4rem', width: '120px' }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Method *</label>
                              <select className="admin-form-control" value={feeMethod} onChange={e => setFeeMethod(e.target.value)} style={{ padding: '0.4rem' }}>
                                <option>Cash</option>
                                <option>UPI</option>
                                <option>Bank Transfer</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Txn ID / Ref No</label>
                              <input type="text" className="admin-form-control" value={feeTxnId} onChange={e => setFeeTxnId(e.target.value)} placeholder="Optional" style={{ padding: '0.4rem' }} />
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Attach Receipt</label>
                              <input type="file" className="admin-form-control" onChange={e => setFeeReceipt(e.target.files[0])} accept="image/*,.pdf" style={{ padding: '0.4rem', width: '200px' }} />
                            </div>
                            <button type="submit" className="btn btn-success" style={{ padding: '0.4rem 1rem' }}>Save Payment</button>
                          </form>
                        </div>
                      )}

                      {studentFees.length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>No additional fee installments recorded yet.</p>
                      ) : (
                        <table className="premium-admin-table" style={{ fontSize: '0.85rem' }}>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Amount</th>
                              <th>Method</th>
                              <th>Txn ID</th>
                              <th>Receipt</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentFees.map(fee => (
                              <tr key={fee.id}>
                                <td>{new Date(fee.paymentDate).toLocaleDateString('en-IN')}</td>
                                <td style={{ color: '#22c55e', fontWeight: 600 }}>₹ {fee.amount.toLocaleString('en-IN')}</td>
                                <td>{fee.paymentMethod}</td>
                                <td>{fee.transactionId || '-'}</td>
                                <td>
                                  {fee.receiptName ? <a href={`${API_BASE}/fees/${fee.id}/receipt`} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Download</a> : '-'}
                                </td>
                                <td>
                                  <span className={`admin-badge ${fee.status === 'APPROVED' ? 'admin-badge-success' : fee.status === 'REJECTED' ? 'admin-badge-danger' : 'admin-badge-warning'}`}>
                                    {fee.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>

                  </div>
                )}
              </div>
            </div>

            {/* Bulk Upload Modal */}
            {showBulkUploadModal && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                <div className="admin-card" style={{ width: '400px', padding: '2rem' }}>
                  <h3 style={{ marginTop: 0 }}>Bulk Upload Admissions (CSV)</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                    Upload a CSV file to add multiple students at once. 
                    <button type="button" onClick={handleDownloadBulkTemplate} style={{ background: 'none', border: 'none', color: '#2563eb', padding: 0, cursor: 'pointer', textDecoration: 'underline', marginLeft: '5px' }}>Download Template</button>
                  </p>
                  
                  <form onSubmit={handleBulkUpload}>
                    <div className="admin-form-group">
                      <label>Select CSV File</label>
                      <input 
                        type="file" 
                        accept=".csv"
                        className="admin-form-control"
                        onChange={(e) => setBulkFile(e.target.files[0])}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                      <button type="submit" className="btn btn-primary" disabled={uploadingBulk}>
                        {uploadingBulk ? 'Uploading...' : 'Upload Data'}
                      </button>
                      <button type="button" className="btn btn-outline" onClick={() => setShowBulkUploadModal(false)}>Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h2 className="admin-page-title">Send Broadcast Notification</h2>
            
            <div className="admin-card" style={{ maxWidth: '600px' }}>
              {notifSuccess && (
                <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.25rem', fontWeight: 600, border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                  {notifSuccess}
                </div>
              )}

              <form onSubmit={handleSendNotification} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="admin-form-group">
                  <label>Recipients *</label>
                  <select className="admin-form-control" value={notifRecipient} onChange={(e) => setNotifRecipient(e.target.value)}>
                    <option value="All">All Students</option>
                    <option value="ELECTRICIAN">Electrician Trainees</option>
                    <option value="FITTER">Fitter Trainees</option>
                    <option value="COPA">COPA Trainees</option>
                    <option value="WELDER">Welder Trainees</option>
                    <option value="DIESEL MECHANIC">Diesel Mechanic Trainees</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Subject *</label>
                  <input 
                    type="text" 
                    className="admin-form-control" 
                    placeholder="Enter notification subject"
                    value={notifSubject}
                    onChange={(e) => setNotifSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label>Attachment (PDF/Image)</label>
                  <input 
                    type="file" 
                    id="notifFile"
                    className="admin-form-control" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setNotifFile(e.target.files[0])}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Message Content *</label>
                  <textarea 
                    className="admin-form-control" 
                    rows="5" 
                    placeholder="Type your broadcast message here..."
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#2563eb', border: 'none', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, padding: '0.75rem 1.5rem' }}>
                  <Send size={16} /> Send Notification
                </button>
              </form>
            </div>
          </div>
        );

      case 'offline-admission':
        return (
          <AdminOfflineAdmission onSuccess={() => navigate('/admin/all-students')} />
        );

      case 'profile':
        return (
          <div>
            <h2 className="admin-page-title">Admin Profile</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {/* Profile Card */}
              <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', boxShadow: '0 4px 10px rgba(37,99,235,0.3)' }}>
                  {(admin?.username ? admin.username.charAt(0) : 'A').toUpperCase()}
                </div>
                <h3 style={{ color: 'var(--admin-text-main)', fontSize: '1.5rem', margin: 0 }}>{profileName}</h3>
                <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>@{admin?.username || 'admin'}</span>

                <form onSubmit={handleSaveProfile} style={{ width: '100%', marginTop: '2rem', textAlign: 'left' }}>
                  {profileSuccess && !oldPassword && (
                    <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '0.5rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.8rem', border: '1px solid rgba(34,197,94,0.3)' }}>
                      {profileSuccess}
                    </div>
                  )}
                  
                  <div className="admin-form-group">
                    <label>Username</label>
                    <input type="text" className="admin-form-control" value={admin?.username || 'admin'} readOnly style={{ opacity: 0.7 }} />
                  </div>
                  
                  <div className="admin-form-group">
                    <label>Name</label>
                    <input type="text" className="admin-form-control" value={profileName} onChange={(e) => setProfileName(e.target.value)} required />
                  </div>

                  <div className="admin-form-group">
                    <label>Email Address</label>
                    <input type="email" className="admin-form-control" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} required />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: '#2563eb', border: 'none', padding: '0.75rem', fontWeight: 700 }}>
                    Save Profile Changes
                  </button>
                </form>
              </div>

              {/* Password Card */}
              <div className="admin-card" style={{ padding: '2.5rem' }}>
                <h3 style={{ color: 'var(--admin-text-main)', fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>Change Password</h3>
                
                {profileSuccess && oldPassword && (
                  <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '0.5rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.8rem', border: '1px solid rgba(34,197,94,0.3)' }}>
                    {profileSuccess}
                  </div>
                )}

                {profileError && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.8rem', border: '1px solid rgba(239,68,68,0.3)' }}>
                    {profileError}
                  </div>
                )}

                <form onSubmit={handleChangePasswordProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="admin-form-group">
                    <label>Current Password *</label>
                    <input type="password" placeholder="Enter current password" className="admin-form-control" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                  </div>

                  <div className="admin-form-group">
                    <label>New Password *</label>
                    <input type="password" placeholder="Leave empty to keep current" className="admin-form-control" value={newPass} onChange={(e) => setNewPass(e.target.value)} required />
                  </div>

                  <div className="admin-form-group">
                    <label>Confirm New Password *</label>
                    <input type="password" className="admin-form-control" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: '#2563eb', border: 'none', padding: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <Lock size={16} /> Update Password
                  </button>
                </form>
              </div>

              {/* Add New Admin Card */}
              <div className="admin-card" style={{ padding: '2.5rem' }}>
                <h3 style={{ color: 'var(--admin-text-main)', fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>Create New Admin</h3>
                
                {addAdminSuccess && (
                  <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '0.5rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.8rem', border: '1px solid rgba(34,197,94,0.3)' }}>
                    {addAdminSuccess}
                  </div>
                )}

                {addAdminError && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.8rem', border: '1px solid rgba(239,68,68,0.3)' }}>
                    {addAdminError}
                  </div>
                )}

                <form onSubmit={handleAddAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="admin-form-group">
                    <label>New Admin Username *</label>
                    <input type="text" className="admin-form-control" value={newAdminUsername} onChange={(e) => setNewAdminUsername(e.target.value)} required />
                  </div>

                  <div className="admin-form-group">
                    <label>New Admin Email *</label>
                    <input type="email" className="admin-form-control" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} required />
                  </div>

                  <div className="admin-form-group">
                    <label>Password *</label>
                    <input type="password" className="admin-form-control" value={newAdminPassword} onChange={(e) => setNewAdminPassword(e.target.value)} required />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', backgroundColor: '#10b981', border: 'none', padding: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    <PlusCircle size={16} /> Add Admin
                  </button>
                </form>
              </div>

            </div>
          </div>
        );

      case 'manage-notices':
        return (
          <div className="admin-content-fade-in">
            <div className="admin-page-header">
              <div>
                <h2>Manage Notices</h2>
                <p>Add, view, and delete notices on the public portal.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              {/* Add Notice Form */}
              <div className="admin-card" style={{ padding: '2rem', height: 'fit-content' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--admin-text-main)', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>Add New Notice</h3>
                <form onSubmit={handleAddNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label>Notice Title *</label>
                    <input type="text" className="admin-form-control" value={newNotice.title} onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })} required />
                  </div>
                  <div className="admin-form-group">
                    <label>Date *</label>
                    <input type="date" className="admin-form-control" value={newNotice.date} onChange={(e) => setNewNotice({ ...newNotice, date: e.target.value })} required />
                  </div>
                  <div className="admin-form-group">
                    <label>Link URL (Optional)</label>
                    <input type="text" className="admin-form-control" value={newNotice.link} onChange={(e) => setNewNotice({ ...newNotice, link: e.target.value })} placeholder="e.g. # or /some-page" disabled={!!noticeFile} />
                  </div>
                  <div className="admin-form-group">
                    <label>Or Upload PDF File</label>
                    <input type="file" className="admin-form-control" accept=".pdf" onChange={(e) => setNoticeFile(e.target.files[0])} disabled={!!newNotice.link} style={{ padding: '0.5rem' }} />
                  </div>
                  <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" checked={newNotice.isNew} onChange={(e) => setNewNotice({ ...newNotice, isNew: e.target.checked })} id="isNewNotice" />
                    <label htmlFor="isNewNotice" style={{ margin: 0, cursor: 'pointer' }}>Mark as "NEW"</label>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#10b981', border: 'none', padding: '0.75rem', marginTop: '0.5rem' }} disabled={uploadingNotice}>
                    {uploadingNotice ? 'Uploading...' : <><PlusCircle size={16} /> Add Notice</>}
                  </button>
                </form>
              </div>

              {/* Notice List */}
              <div className="admin-card">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>Active Notices</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>Total: {manageNotices.length}</span>
                </div>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manageNotices.length === 0 ? (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No notices found.</td></tr>
                      ) : (
                        manageNotices.map((n) => (
                          <tr key={n.id}>
                            <td style={{ whiteSpace: 'nowrap' }}>{new Date(n.date).toLocaleDateString()}</td>
                            <td style={{ maxWidth: '300px' }}>
                              <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{n.title}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--admin-primary)' }}>{n.link}</div>
                            </td>
                            <td>
                              {n.isNew ? (
                                <span className="status-badge status-completed">New</span>
                              ) : (
                                <span className="status-badge" style={{ backgroundColor: 'var(--admin-bg-alt)' }}>Normal</span>
                              )}
                            </td>
                            <td>
                              <button onClick={() => handleDeleteNotice(n.id)} className="admin-action-btn" style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }} title="Delete Notice">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'inquiries':
        return (
          <div className="admin-content-fade-in">
            <div className="admin-page-header">
              <div>
                <h2>Inquiries Inbox</h2>
                <p>Manage and respond to messages sent via the Contact Us page.</p>
              </div>
            </div>

            <div className="admin-card">
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Messages ({inquiries.length})</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>Unread: {inquiries.filter(i => i.status === 'UNREAD').length}</span>
                </div>
              </div>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Sender</th>
                      <th>Subject</th>
                      <th>Message</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.length === 0 ? (
                      <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No messages found.</td></tr>
                    ) : (
                      inquiries.map((inq) => (
                        <tr key={inq.id} style={{ backgroundColor: inq.status === 'UNREAD' ? 'var(--admin-bg-alt)' : 'transparent' }}>
                          <td>
                            {inq.status === 'UNREAD' ? (
                              <span className="status-badge" style={{ backgroundColor: '#ef4444', color: 'white' }}>New</span>
                            ) : (
                              <span className="status-badge status-completed">Read</span>
                            )}
                          </td>
                          <td style={{ whiteSpace: 'nowrap' }}>{new Date(inq.date).toLocaleString()}</td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{inq.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--admin-primary)' }}>{inq.phone}</div>
                            {inq.email && <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{inq.email}</div>}
                          </td>
                          <td style={{ fontWeight: inq.status === 'UNREAD' ? 700 : 400 }}>{inq.subject}</td>
                          <td style={{ maxWidth: '300px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-main)', whiteSpace: 'pre-wrap' }}>{inq.message}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              {inq.status === 'UNREAD' && (
                                <button onClick={() => handleMarkInquiryRead(inq.id)} className="admin-action-btn" style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' }} title="Mark as Read">
                                  <CheckCircle size={16} />
                                </button>
                              )}
                              <button onClick={() => handleDeleteInquiry(inq.id)} className="admin-action-btn" style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }} title="Delete Message">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'manage-gallery':
        return (
          <div className="admin-content-fade-in">
            <div className="admin-page-header">
              <div>
                <h2>Manage Gallery</h2>
                <p>Upload and manage photos for the public gallery.</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div className="admin-card" style={{ padding: '2rem', height: 'fit-content' }}>
                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>Upload New Photo</h3>
                <form onSubmit={handleAddGalleryImage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label>Title / Caption *</label>
                    <input type="text" className="admin-form-control" value={newImage.title} onChange={(e) => setNewImage({ ...newImage, title: e.target.value })} required />
                  </div>
                  <div className="admin-form-group">
                    <label>Category *</label>
                    <select className="admin-form-control" value={newImage.category} onChange={(e) => setNewImage({ ...newImage, category: e.target.value })} required>
                      <option value="Campus">Campus & Infrastructure</option>
                      <option value="Labs">Workshops & Labs</option>
                      <option value="Events">Events & Activities</option>
                      <option value="Hostel">Hostel & Facilities</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Image File *</label>
                    <input type="file" className="admin-form-control" accept="image/*" onChange={(e) => setGalleryFile(e.target.files[0])} required style={{ padding: '0.5rem' }} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#10b981', border: 'none', padding: '0.75rem', marginTop: '0.5rem' }} disabled={uploadingImage}>
                    {uploadingImage ? 'Uploading...' : <><PlusCircle size={16} /> Upload Photo</>}
                  </button>
                </form>
              </div>

              <div className="admin-card">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>Uploaded Photos</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>Total: {gallery.length}</span>
                </div>
                <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {gallery.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'gray' }}>No photos uploaded yet.</div>
                  ) : (
                    gallery.map(img => (
                      <div key={img.id} style={{ border: '1px solid var(--admin-border)', borderRadius: '8px', overflow: 'hidden' }}>
                        <img src={img.imageUrl} alt={img.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                        <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '130px' }}>{img.title}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--admin-primary)' }}>{img.category}</div>
                          </div>
                          <button onClick={() => handleDeleteGalleryImage(img.id)} className="admin-action-btn" style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.4rem' }} title="Delete Photo">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'manage-results':
        return (
          <div className="admin-content-fade-in">
            <div className="admin-page-header">
              <div>
                <h2>Manage Results</h2>
                <p>Upload exam marks and results for students.</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              <div className="admin-card" style={{ padding: '2rem', height: 'fit-content' }}>
                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>Add Result</h3>
                
                <div className="admin-form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Select Student *</label>
                  <select 
                    className="admin-form-control" 
                    value={selectedStudentForResults?.id || ''} 
                    onChange={(e) => {
                      const student = admissions.find(a => a.id.toString() === e.target.value);
                      setSelectedStudentForResults(student);
                      if (student) loadResults(student.id);
                      else setResults([]);
                    }}
                  >
                    <option value="">-- Select a Student --</option>
                    {admissions.map(a => (
                      <option key={a.id} value={a.id}>APP-2026-{a.id} - {a.fullName} ({a.trade})</option>
                    ))}
                  </select>
                </div>

                {selectedStudentForResults && (
                  <form onSubmit={handleAddResult} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px dashed var(--admin-border)', paddingTop: '1.5rem' }}>
                    <div className="admin-form-group">
                      <label>Subject / Exam Name *</label>
                      <input type="text" className="admin-form-control" value={newResult.subject} onChange={(e) => setNewResult({ ...newResult, subject: e.target.value })} required />
                    </div>
                    <div className="admin-form-group">
                      <label>Semester / Year *</label>
                      <input type="text" className="admin-form-control" value={newResult.semesterOrYear} onChange={(e) => setNewResult({ ...newResult, semesterOrYear: e.target.value })} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="admin-form-group">
                        <label>Max Marks *</label>
                        <input type="number" className="admin-form-control" value={newResult.maxMarks} onChange={(e) => setNewResult({ ...newResult, maxMarks: parseInt(e.target.value) })} required min="1" />
                      </div>
                      <div className="admin-form-group">
                        <label>Marks Obtained *</label>
                        <input type="number" className="admin-form-control" value={newResult.marksObtained} onChange={(e) => setNewResult({ ...newResult, marksObtained: parseInt(e.target.value) })} required min="0" />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="admin-form-group">
                        <label>Grade *</label>
                        <input type="text" className="admin-form-control" value={newResult.grade} onChange={(e) => setNewResult({ ...newResult, grade: e.target.value })} required />
                      </div>
                      <div className="admin-form-group">
                        <label>Status *</label>
                        <select className="admin-form-control" value={newResult.status} onChange={(e) => setNewResult({ ...newResult, status: e.target.value })}>
                          <option value="PASS">PASS</option>
                          <option value="FAIL">FAIL</option>
                          <option value="WITHHELD">WITHHELD</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#10b981', border: 'none', padding: '0.75rem', marginTop: '0.5rem' }}>
                      <Award size={16} /> Save Result
                    </button>
                  </form>
                )}
              </div>

              <div className="admin-card">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>Student Results</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                    {selectedStudentForResults ? `Showing for ${selectedStudentForResults.fullName}` : 'Select a student'}
                  </span>
                </div>
                
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Semester/Year</th>
                        <th>Marks</th>
                        <th>Grade/Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!selectedStudentForResults ? (
                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'gray' }}>Select a student to view their results.</td></tr>
                      ) : results.length === 0 ? (
                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'gray' }}>No results uploaded yet.</td></tr>
                      ) : (
                        results.map((res) => (
                          <tr key={res.id}>
                            <td style={{ fontWeight: 600 }}>{res.subject}</td>
                            <td>{res.semesterOrYear}</td>
                            <td>{res.marksObtained} / {res.maxMarks}</td>
                            <td>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                <span>Grade: {res.grade}</span>
                                <span className={`status-badge ${res.status === 'PASS' ? 'status-completed' : 'status-pending'}`} style={{ width: 'fit-content', backgroundColor: res.status === 'PASS' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: res.status === 'PASS' ? '#10b981' : '#ef4444' }}>
                                  {res.status}
                                </span>
                              </div>
                            </td>
                            <td>
                              <button onClick={() => handleDeleteResult(res.id)} className="admin-action-btn" style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }} title="Delete Result">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'study-materials':
        return (
          <div className="admin-content-fade-in">
            <div className="admin-page-header">
              <div>
                <h2>Student Corner Management</h2>
                <p>Upload Syllabus, Previous Year Papers, Scholarship Forms, Calendar & Rules. Students can download these from the Student Corner page.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
              {/* Upload Form */}
              <div className="admin-card" style={{ padding: '2rem', height: 'fit-content' }}>
                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '0.5rem' }}>
                  <BookOpen size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Upload New File
                </h3>
                <form onSubmit={handleUploadMaterial} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label>Document Type *</label>
                    <select className="admin-form-control" value={newMaterial.type} onChange={e => setNewMaterial({ ...newMaterial, type: e.target.value })}>
                      <option value="SYLLABUS">📖 Syllabus & Course Scheme</option>
                      <option value="STUDY_MATERIAL">📚 Study Material / Notes</option>
                      <option value="PREVIOUS_PAPER">📝 Previous Year Papers</option>
                      <option value="SCHOLARSHIP">🏛 Scholarship Forms</option>
                      <option value="CALENDAR">📅 Academic Calendar</option>
                      <option value="RULES">🚨 Rules & Regulations</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Title *</label>
                    <input type="text" className="admin-form-control" placeholder="e.g. Electrician Trade Theory Paper 2025" value={newMaterial.title} onChange={e => setNewMaterial({ ...newMaterial, title: e.target.value })} required />
                  </div>
                  <div className="admin-form-group">
                    <label>Hindi Title</label>
                    <input type="text" className="admin-form-control" placeholder="उदा. इलेक्ट्रीशियन ट्रेड थ्योरी पेपर 2025" value={newMaterial.titleHn} onChange={e => setNewMaterial({ ...newMaterial, titleHn: e.target.value })} />
                  </div>
                  <div className="admin-form-group">
                    <label>Trade / Applicable For</label>
                    <select className="admin-form-control" value={newMaterial.trade} onChange={e => {
                      const tradeVal = e.target.value;
                      const tradeHnMap = {
                        'All Trades': 'सभी ट्रेड्स',
                        'Electrician': 'इलेक्ट्रीशियन',
                        'DCA': 'डीसीए (DCA)',
                        'PGDCA': 'पीजीडीसीए (PGDCA)',
                        'Health Sanitary Inspector': 'स्वास्थ्य स्वच्छता निरीक्षक'
                      };
                      setNewMaterial({ ...newMaterial, trade: tradeVal, tradeHn: tradeHnMap[tradeVal] || tradeVal });
                    }}>
                      <option value="All Trades">All Trades</option>
                      <option value="Electrician">Electrician</option>
                      <option value="DCA">DCA</option>
                      <option value="PGDCA">PGDCA</option>
                      <option value="Health Sanitary Inspector">Health Sanitary Inspector</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Hindi Trade / Applicable For</label>
                    <input type="text" className="admin-form-control" placeholder="उदा. इलेक्ट्रीशियन" value={newMaterial.tradeHn} onChange={e => setNewMaterial({ ...newMaterial, tradeHn: e.target.value })} />
                  </div>
                  <div className="admin-form-group">
                    <label>Select File (PDF) *</label>
                    <input id="materialFileInput" type="file" className="admin-form-control" accept=".pdf,.doc,.docx" onChange={e => setMaterialFile(e.target.files[0])} style={{ padding: '0.5rem' }} required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#10b981', border: 'none', padding: '0.75rem', marginTop: '0.5rem' }} disabled={uploadingMaterial}>
                    <PlusCircle size={16} style={{ marginRight: '6px' }} />
                    {uploadingMaterial ? 'Uploading...' : 'Upload File'}
                  </button>
                </form>
              </div>

              {/* Uploaded Files List */}
              <div className="admin-card">
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>Uploaded Resources ({studyMaterials.length})</h3>
                  <button onClick={loadStudyMaterials} style={{ background: 'none', border: '1px solid var(--admin-border)', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Refresh</button>
                </div>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Trade</th>
                        <th>File</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studyMaterials.length === 0 ? (
                        <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'gray' }}>No files uploaded yet. Use the form to upload.</td></tr>
                      ) : (
                        studyMaterials.map(m => (
                          <tr key={m.id}>
                            <td>
                              <span style={{ fontSize: '0.78rem', padding: '3px 8px', borderRadius: '20px', fontWeight: 600,
                                backgroundColor: m.type === 'SYLLABUS' ? 'rgba(37,99,235,0.1)' : m.type === 'STUDY_MATERIAL' ? 'rgba(14,165,233,0.1)' : m.type === 'PREVIOUS_PAPER' ? 'rgba(245,158,11,0.1)' : m.type === 'SCHOLARSHIP' ? 'rgba(16,185,129,0.1)' : m.type === 'CALENDAR' ? 'rgba(139,92,246,0.1)' : 'rgba(239,68,68,0.1)',
                                color: m.type === 'SYLLABUS' ? '#2563eb' : m.type === 'STUDY_MATERIAL' ? '#0ea5e9' : m.type === 'PREVIOUS_PAPER' ? '#d97706' : m.type === 'SCHOLARSHIP' ? '#10b981' : m.type === 'CALENDAR' ? '#7c3aed' : '#ef4444'
                              }}>
                                {m.type === 'SYLLABUS' ? '📖 Syllabus' : m.type === 'STUDY_MATERIAL' ? '📚 Notes' : m.type === 'PREVIOUS_PAPER' ? '📝 Papers' : m.type === 'SCHOLARSHIP' ? '🏛 Scholar' : m.type === 'CALENDAR' ? '📅 Calendar' : '🚨 Rules'}
                              </span>
                            </td>
                            <td style={{ fontWeight: 600, maxWidth: '200px' }}>
                              <div>{m.title}</div>
                              {m.titleHn && <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', fontWeight: 400, marginTop: '2px' }}>{m.titleHn}</div>}
                            </td>
                            <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                              <div>{m.trade}</div>
                              {m.tradeHn && <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '2px' }}>{m.tradeHn}</div>}
                            </td>
                            <td style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{m.fileName}</td>
                            <td style={{ display: 'flex', gap: '0.5rem' }}>
                              <a href={`${API_BASE}/study-materials/${m.id}/download`} target="_blank" rel="noopener noreferrer" className="admin-action-btn" style={{ color: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', textDecoration: 'none' }} title="Download">
                                <Download size={15} />
                              </a>
                              <button onClick={() => handleDeleteMaterial(m.id)} className="admin-action-btn" style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)' }} title="Delete">
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className={`admin-container ${darkMode ? 'dark-theme-admin' : ''}`}>
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="admin-sidebar-backdrop" 
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 99
          }}
        />
      )}

      {/* Left Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="admin-logo-box">
              <Shield size={20} />
            </div>
            <div>
              <h3>Sunshine</h3>
              <span>Admin Panel</span>
            </div>
          </div>
          <button 
            className="admin-sidebar-close-btn" 
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="admin-sidebar-menu">
          <button className="menu-item" onClick={() => { navigate('/'); setSidebarOpen(false); }}>
            <Home size={18} /> Go to Website
          </button>
          <button className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { navigate('/admin/dashboard'); setSidebarOpen(false); }}>
            <LayoutGrid size={18} /> Dashboard
          </button>
          <button className={`menu-item ${activeTab === 'all-payments' ? 'active' : ''}`} onClick={() => { navigate('/admin/all-payments'); setSidebarOpen(false); }}>
            <ListOrdered size={18} /> All Payments
          </button>
          <button className={`menu-item ${activeTab === 'pending-payments' ? 'active' : ''}`} onClick={() => { navigate('/admin/pending-payments'); setSidebarOpen(false); }}>
            <CreditCard size={18} /> Pending Initial Payments
          </button>
          <button className={`menu-item ${activeTab === 'pending-installments' ? 'active' : ''}`} onClick={() => { navigate('/admin/pending-installments'); setSidebarOpen(false); }}>
            <CreditCard size={18} /> Pending Installments
          </button>
          <button className={`menu-item ${activeTab === 'all-students' ? 'active' : ''}`} onClick={() => { navigate('/admin/all-students'); setSidebarOpen(false); }}>
            <Users size={18} /> All Students
          </button>
          <button className={`menu-item ${activeTab === 'offline-admission' ? 'active' : ''}`} onClick={() => { navigate('/admin/offline-admission'); setSidebarOpen(false); }}>
            <PlusCircle size={18} /> Add Offline Admission
          </button>
          <button className={`menu-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => { navigate('/admin/notifications'); setSidebarOpen(false); }}>
            <Bell size={18} /> Notifications
          </button>
          <button className={`menu-item ${activeTab === 'manage-notices' ? 'active' : ''}`} onClick={() => { navigate('/admin/manage-notices'); setSidebarOpen(false); }}>
            <Megaphone size={18} /> Manage Notices
          </button>
          <button className={`menu-item ${activeTab === 'manage-gallery' ? 'active' : ''}`} onClick={() => { navigate('/admin/manage-gallery'); setSidebarOpen(false); }}>
            <ImageIcon size={18} /> Manage Gallery
          </button>
          <button className={`menu-item ${activeTab === 'manage-results' ? 'active' : ''}`} onClick={() => { navigate('/admin/manage-results'); setSidebarOpen(false); }}>
            <Award size={18} /> Exam Results
          </button>
          <button className={`menu-item ${activeTab === 'study-materials' ? 'active' : ''}`} onClick={() => { navigate('/admin/study-materials'); setSidebarOpen(false); loadStudyMaterials(); }}>
            <BookOpen size={18} /> Student Corner
          </button>
          <button className={`menu-item ${activeTab === 'inquiries' ? 'active' : ''}`} onClick={() => { navigate('/admin/inquiries'); setSidebarOpen(false); }}>
            <MessageSquare size={18} /> Inquiries
            {inquiries.filter(i => i.status === 'UNREAD').length > 0 && (
              <span style={{ background: '#ef4444', color: 'white', borderRadius: '50%', padding: '0.1rem 0.4rem', fontSize: '0.7rem', marginLeft: 'auto' }}>
                {inquiries.filter(i => i.status === 'UNREAD').length}
              </span>
            )}
          </button>
          <button className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => { navigate('/admin/profile'); setSidebarOpen(false); }}>
            <User size={18} /> Profile
          </button>
        </nav>
        
        <div className="admin-sidebar-footer">
          <button className="menu-item" onClick={() => window.open(`${API_BASE}/admin/backup`, '_blank')} style={{ color: '#10b981' }}>
            <Database size={18} /> Backup Database (.sql)
          </button>
          <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      
      {/* Right Workspace */}
      <div className="admin-workspace">
        {/* Topbar Header */}
        <header className="admin-workspace-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              className="admin-sidebar-mobile-toggle" 
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="header-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div className="admin-user-profile">
            <div className="avatar-circle">
              {admin?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-text">
              <span className="profile-name">{admin?.username === 'Inam' ? 'Inam Ahmad Baig' : 'Sunshine Admin'}</span>
              <span className="profile-role">Administrator</span>
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <div className="admin-workspace-content-wrap" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <div className="admin-content-area">
            {renderActiveView()}
          </div>
        </div>
      </div>

      {/* Certificate Fee Modal */}
      {showCertificateModal && selectedStudent && (
        <div className="admin-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="admin-modal-content" style={{ background: darkMode ? '#1e293b' : '#fff', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '400px', position: 'relative' }}>
            <button className="admin-modal-close" onClick={() => setShowCertificateModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#f8fafc' : '#333' }}>
              <X size={20} />
            </button>
            <h3 style={{ margin: '0 0 1.5rem 0', color: darkMode ? '#f8fafc' : '#1e293b' }}>Issue Certificate</h3>
            
            <form onSubmit={submitCertificateFee}>
              <div className="admin-form-group">
                <label>Certificate Fee (₹)</label>
                <input type="number" className="admin-form-control" value={certFee} onChange={e => setCertFee(e.target.value)} required />
              </div>
              <div className="admin-form-group">
                <label>Payment Method</label>
                <select className="admin-form-control" value={certPaymentMethod} onChange={e => setCertPaymentMethod(e.target.value)}>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              {certPaymentMethod !== 'Cash' && (
                <div className="admin-form-group">
                  <label>Transaction ID</label>
                  <input type="text" className="admin-form-control" value={certTxnId} onChange={e => setCertTxnId(e.target.value)} required />
                </div>
              )}
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowCertificateModal(false)} className="btn btn-secondary" style={{ padding: '0.6rem 1rem' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#8b5cf6', borderColor: '#8b5cf6', padding: '0.6rem 1rem' }}>Collect Fee & Generate</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
