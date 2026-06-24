# Sunshine ITI College Management System

A full-stack web application designed for managing admissions and administration for Sunshine ITI College. The application features a robust backend built with Spring Boot and a dynamic, responsive frontend using React and Vite.

## 🚀 Features

- **Admin Dashboard**: Comprehensive dashboard with data visualization.
- **Admission Management**: Handle student admissions with detailed form tracking.
- **Secure Authentication**: JWT-based security for protecting admin routes.
- **Document Generation**: Automated PDF generation for admission receipts/forms using OpenPDF.
- **Cloud Storage**: Integration with Cloudinary for managing uploaded media/documents.
- **Form Validation**: Robust client-side validation using Formik and Yup.

## 💻 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM
- **State Management & Forms**: Formik + Yup
- **Styling & UI**: Recharts (Data Visualization), Lucide React (Icons)
- **HTTP Client**: Axios

### Backend
- **Framework**: Spring Boot 3.3.0 (Java 21)
- **Database**: MySQL with Spring Data JPA
- **Security**: Spring Security + JWT
- **Media Storage**: Cloudinary integration
- **Utilities**: OpenPDF (PDF Generation), JavaMailSender (Emails)

## 🛠️ Local Setup

### Prerequisites
- Node.js (v18+)
- Java 21 JDK
- MySQL Server
- Maven

### 1. Clone the repository
```bash
git clone <your-repository-url>
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

### 3. Backend Setup
Navigate to the `backend` directory:
```bash
cd backend
```
Update your `application.properties` or `.env` files with your MySQL credentials, Cloudinary API keys, and JWT secrets.

Run the Spring Boot application using Maven:
```bash
./mvnw spring-boot:run
```
*(On Windows, use `mvnw.cmd spring-boot:run`)*

## 📜 Scripts (Frontend)
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint for code formatting.
- `npm run test`: Runs the Vitest test suite.
