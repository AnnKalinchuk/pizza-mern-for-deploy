const multer = require('multer');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'mern-pizzanna.appspot.com',
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = {
  admin,
  upload,
};