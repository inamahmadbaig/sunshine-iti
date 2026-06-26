const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf8');

let handleSelectStudentStr = `  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setIsEditing(false);
    setIsEditingPayment(false);
    setIsRecordingFee(false);
    setEditFormData(student);
    loadStudentFees(student.id);
  };`;

let newHandleSelectStudentStr = `  const handleSelectStudent = (student) => {
    navigate('/admin/student/' + student.id);
  };`;
code = code.replace(handleSelectStudentStr, newHandleSelectStudentStr);

let handleSelectStudentStrLinux = `  const handleSelectStudent = (student) => {\n    setSelectedStudent(student);\n    setIsEditing(false);\n    setIsEditingPayment(false);\n    setIsRecordingFee(false);\n    setEditFormData(student);\n    loadStudentFees(student.id);\n  };`;
let newHandleSelectStudentStrLinux = `  const handleSelectStudent = (student) => {\n    navigate('/admin/student/' + student.id);\n  };`;
code = code.replace(handleSelectStudentStrLinux, newHandleSelectStudentStrLinux);

code = code.replace(/<div className="admin-split-workspace">/g, '<div>');

const startIdx = code.indexOf('{/* Right Column: Details */}');
const endIdx = code.indexOf('{/* Bulk Upload Modal */}');

if (startIdx > -1 && endIdx > -1) {
    let toDelete = code.substring(startIdx, endIdx);
    code = code.replace(toDelete, '');
} else {
    console.log('Indexes not found', startIdx, endIdx);
}

fs.writeFileSync('src/components/AdminDashboard.jsx', code);
console.log('Done!');
