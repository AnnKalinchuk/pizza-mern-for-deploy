

/*рабочий код вернуть для сохранения на диске
const multer  = require('multer')
const moment = require('moment') const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/");
        },
        filename: (req, file, cb) => {
            const date = moment().format('DDMMYYYY-HHmmss_SSS')
            cb(null,`${date}-${file.originalname}`);
        }
}) 
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' 
        || file.mimetype === 'image/jpeg' 
        ||file.mimetype === 'image/jpg' ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const limits = {
    fileSize: 1024*1024*5
}

module.exports = multer({
    storage,
    fileFilter,
    limits
})*/

// для firebase
const multer  = require('multer')
const { upload, admin } = require('../multerConfig');

const uploadFileMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Multer error', error: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'Error uploading file', error: err.message });
    }
    next();
  });
};

module.exports = uploadFileMiddleware;

//
