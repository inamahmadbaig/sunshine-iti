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
if (startIdx > -1) {
    const caseEndStr = "      case 'offline-admission':";
    const nextCaseIdx = code.indexOf(caseEndStr);
    
    if (nextCaseIdx > -1) {
        let replaceEndIdx = code.lastIndexOf('        );', nextCaseIdx);
        if (replaceEndIdx > -1) {
            let toDelete = code.substring(startIdx, replaceEndIdx);
            code = code.replace(toDelete, '            </div>\n');
        }
    }
}

fs.writeFileSync('src/components/AdminDashboard.jsx', code);
console.log('Done!');