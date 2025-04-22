// middlewares/excelUpload.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/excel'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext === '.xlsx' || ext === '.csv') {
        cb(null, true);
    } else {
        cb(new Error('Only Excel or CSV files allowed'), false);
    }
};

const excelUpload = multer({ storage, fileFilter });

module.exports = excelUpload;
