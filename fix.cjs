const fs = require('fs');
let code = fs.readFileSync('backend/src/main/java/com/sunshine/iti/controller/AdmissionDetailController.java', 'utf8');

const fields = [
    { dto: 'Photo', entity: 'Photo' },
    { dto: 'Signature', entity: 'Signature' },
    { dto: 'TenthDocument', entity: 'TenthDoc' },
    { dto: 'TwelfthDocument', entity: 'TwelfthDoc' },
    { dto: 'AadharDocument', entity: 'AadharDoc' },
    { dto: 'SamagraDocument', entity: 'SamagraDoc' },
    { dto: 'CasteDocument', entity: 'CasteDoc' },
    { dto: 'IncomeDocument', entity: 'IncomeDoc' },
    { dto: 'DomicileDocument', entity: 'DomicileDoc' },
    { dto: 'PaymentReceipt', entity: 'PaymentReceipt' }
];

fields.forEach(f => {
    // For submitAdmission
    let findStr = 'if (dto.get' + f.dto + '() != null && !dto.get' + f.dto + '().isEmpty()) {\r\n            detail.set' + f.entity + 'Url(uploadToCloudinary(dto.get' + f.dto + '()));\r\n        }';
    let replaceStr = 'if (dto.get' + f.dto + '() != null && !dto.get' + f.dto + '().isEmpty()) {\r\n            detail.set' + f.entity + 'Url(uploadToCloudinary(dto.get' + f.dto + '()));\r\n            detail.set' + f.entity + 'Data(dto.get' + f.dto + '().getBytes());\r\n            detail.set' + f.entity + 'Name(dto.get' + f.dto + '().getOriginalFilename());\r\n            detail.set' + f.entity + 'Type(dto.get' + f.dto + '().getContentType());\r\n        }';
    code = code.replace(findStr, replaceStr);

    let findStrLinux = 'if (dto.get' + f.dto + '() != null && !dto.get' + f.dto + '().isEmpty()) {\n            detail.set' + f.entity + 'Url(uploadToCloudinary(dto.get' + f.dto + '()));\n        }';
    let replaceStrLinux = 'if (dto.get' + f.dto + '() != null && !dto.get' + f.dto + '().isEmpty()) {\n            detail.set' + f.entity + 'Url(uploadToCloudinary(dto.get' + f.dto + '()));\n            detail.set' + f.entity + 'Data(dto.get' + f.dto + '().getBytes());\n            detail.set' + f.entity + 'Name(dto.get' + f.dto + '().getOriginalFilename());\n            detail.set' + f.entity + 'Type(dto.get' + f.dto + '().getContentType());\n        }';
    code = code.replace(findStrLinux, replaceStrLinux);

    // For updateAdmission
    let findStr2 = 'if (dto.get' + f.dto + '() != null && !dto.get' + f.dto + '().isEmpty()) {\r\n                existing.set' + f.entity + 'Url(uploadToCloudinary(dto.get' + f.dto + '()));\r\n            }';
    let replaceStr2 = 'if (dto.get' + f.dto + '() != null && !dto.get' + f.dto + '().isEmpty()) {\r\n                existing.set' + f.entity + 'Url(uploadToCloudinary(dto.get' + f.dto + '()));\r\n                existing.set' + f.entity + 'Data(dto.get' + f.dto + '().getBytes());\r\n                existing.set' + f.entity + 'Name(dto.get' + f.dto + '().getOriginalFilename());\r\n                existing.set' + f.entity + 'Type(dto.get' + f.dto + '().getContentType());\r\n            }';
    code = code.replace(findStr2, replaceStr2);

    let findStr2Linux = 'if (dto.get' + f.dto + '() != null && !dto.get' + f.dto + '().isEmpty()) {\n                existing.set' + f.entity + 'Url(uploadToCloudinary(dto.get' + f.dto + '()));\n            }';
    let replaceStr2Linux = 'if (dto.get' + f.dto + '() != null && !dto.get' + f.dto + '().isEmpty()) {\n                existing.set' + f.entity + 'Url(uploadToCloudinary(dto.get' + f.dto + '()));\n                existing.set' + f.entity + 'Data(dto.get' + f.dto + '().getBytes());\n                existing.set' + f.entity + 'Name(dto.get' + f.dto + '().getOriginalFilename());\n                existing.set' + f.entity + 'Type(dto.get' + f.dto + '().getContentType());\n            }';
    code = code.replace(findStr2Linux, replaceStr2Linux);
});

fs.writeFileSync('backend/src/main/java/com/sunshine/iti/controller/AdmissionDetailController.java', code);