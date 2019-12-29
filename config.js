const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sivithu:caca@cluster0-abdkp.mongodb.net/test?retryWrites=true&w=majority';
const PORT = process.env.PORT || 3000;
const dbName = process.env.DBNAME || 'findout';
const BASEAPPURL = process.env.BASEAPPURL || 'http://localhost:3000/';

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/');
    },
    filename: function (req, file, cb) {
        let date = Date.now() + '.' + file.originalname.substr(file.originalname.length - 3);
        file.originalname = date;
        cb(null, date);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('yes'), false);
    }
};

const upload = multer({storage, fileFilter});

module.exports = {
    ObjectId,
    MongoClient,
    MONGODB_URI,
    dbName,
    PORT,
    upload,
    BASEAPPURL
};
