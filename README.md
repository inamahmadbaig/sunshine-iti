# 🎓 Sunshine ITI College Management System

A comprehensive, full-stack web application designed for managing student admissions, administration, and fee tracking for **Sunshine ITI College**. The application features a robust backend built with Spring Boot and a dynamic, responsive frontend using React and Vite.

---

## 🚀 Key Features

- **Admin Dashboard**: Comprehensive dashboard with data visualization (Charts) for monitoring admissions and revenue.
- **Student Admission Management**: 
  - Complete admission form capturing personal, academic, and document details.
  - Multi-part file upload support for photos, signatures, and mark sheets.
- **Secure Authentication**: JWT-based security for protecting admin routes.
- **Fee Management**: Automatically calculates course fees based on the selected Trade. Tracks `amountPaid`, `outstandingBalance`, and `paymentStatus`.
- **Document Generation & Delivery**: Automated PDF generation for admission receipts/forms using OpenPDF and automated email delivery via Brevo/JavaMailSender.
- **Cloud Storage**: Integration with Cloudinary for managing uploaded media and student documents.

### 📚 Supported Trades
- Electrician (₹30,000)
- Fitter (₹30,000)
- COPA (₹15,000)
- Welder (₹18,000)
- Diesel Mechanic (₹20,000)
- DCA (₹11,000)
- PGDCA (₹12,000)
- Health Sanitary Inspector (HSI) (₹28,000)

---

## 💻 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **State Management & Forms**: Formik + Yup (Validation)
- **Styling & UI**: Tailwind CSS (Assumed) / Vanilla CSS, Recharts (Data Visualization), Lucide React (Icons)
- **HTTP Client**: Axios

### Backend
- **Framework**: Spring Boot 3.3.0 (Java 21)
- **Database**: MySQL with Spring Data JPA
- **Security**: Spring Security + JWT
- **Media Storage**: Cloudinary integration
- **Utilities**: OpenPDF (PDF Generation), JavaMailSender (Emails)

---

## 📁 Project Structure

```
collage-iti/
├── backend/                  # Spring Boot Application
│   ├── src/main/java/...     # Java Source Code (Controllers, Models, Repositories, Services)
│   ├── src/main/resources/   # Application Properties
│   ├── pom.xml               # Maven Dependencies
│   └── mvnw                  # Maven Wrapper
├── public/                   # Static Frontend Assets
├── src/                      # React Frontend Source Code
│   ├── components/           # Reusable React Components (AdminDashboard, AdmissionForm)
│   ├── utils/                # Helper functions
│   └── ...                   
├── package.json              # NPM Dependencies
└── vite.config.js            # Vite Configuration
```

---

## ⚙️ Environment Variables

To run this project locally, you will need to add the following environment variables to your `backend/src/main/resources/application.properties` or `.env` file:

```properties
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/iti_db?createDatabaseIfNotExist=true
DB_USERNAME=root
DB_PASSWORD=your_password
DB_POOL_MAX=3

# Server Port
PORT=8081

# Mail Configuration
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173

# Brevo API Key
BREVO_API_KEY=your_brevo_api_key

# Cloudinary (Configured inside Cloudinary Config)
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
```

> [!IMPORTANT]
> Make sure your MySQL server is running before starting the backend application.

---

## 🛠️ Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- Java 21 JDK
- MySQL Server
- Maven

### 1. Clone the repository
```bash
git clone https://github.com/inamahmadbaig/sunshine-iti.git
cd collage-iti
```

### 2. Frontend Setup
Navigate to the root directory and install dependencies:
```bash
npm install
```
Start the frontend development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`.

### 3. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```
Update your `application.properties` with your MySQL credentials and API keys.

Run the Spring Boot application using Maven:
```bash
./mvnw spring-boot:run
```
*(On Windows, use `mvnw.cmd spring-boot:run`)*

The backend will be available at `http://localhost:8081`.

---

## 🔌 Key API Endpoints

- `GET /api/admissions` - Get all student admissions.
- `GET /api/admissions/search` - Search student by DOB, Mobile, or Name.
- `POST /api/admissions` - Submit a new admission form (supports multipart file uploads).
- `GET /api/admissions/{id}/files/{fieldName}` - Stream uploaded documents/images.
- `PUT /api/admissions/{id}/status` - Update admission status (Pending, Approved, Rejected).
- `PUT /api/admissions/{id}/payment` - Update payment details and status.
- `POST /api/admissions/{id}/send-receipt` - Send admission receipt via Email.

---

## 📜 Scripts (Frontend)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint for code formatting.
- `npm run test`: Runs the Vitest test suite.
