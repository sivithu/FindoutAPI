var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const {BASEAPPURL} = require('../config');
const {upload} = require('../config');

const url = 'mongodb+srv://sivithu:caca@cluster0-abdkp.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'findout';

router.get('/getById/:id', function(req, res, next) {
    var client = new MongoClient(url);
    var idPlace = req.params.id;

    client.connect()
        .then(async function(response){
            console.log("Connected to database");
            const db = client.db(dbName);
            const col = await db.collection('place').find({_id : ObjectId(idPlace)}).toArray();

            var arrAddress = [];
            var arr = [];
            if(col.length > 0) {
                col.forEach(val => {
                    arrAddress = val.address.split(", ");
                    arr.push({_id : val._id, name : val.name, url_image : val.url_image, nb_seat: val.nb_seat, coordinate: val.coordinate,
                        nb_seat_free: val.nb_seat_free, id_category: val.id_category, disponibilityStartTime: val.disponibilityStartTime,
                        disponibilityEndTime: val.disponibilityEndTime, id_user: val.id_user, arrAddress: arrAddress, address: val.address});
                })
            }
            client.close();
            res.send({
                error: null,
                place : arr
            });

        }).catch(function(error){
        console.log("Error server " + error.stack);
        res.send({
            error: error.stack,
            place: []
        });
    });
});

router.get('/getByIdCategory/:idCategory', function(req, res, next) {
    var client = new MongoClient(url);
    var idCategory = req.params.idCategory;

    client.connect()
        .then(async function(response){
            console.log("Connected to database");
            const db = client.db(dbName);
            const col = await db.collection('place').find({id_category : ObjectId(idCategory)}).toArray();

            var arrAddress = [];
            var arr = [];
            if(col.length > 0) {
                col.forEach(val => {
                    arrAddress = val.address.split(", ");
                    arr.push({_id : val._id, name : val.name, url_image : val.url_image, nb_seat: val.nb_seat, coordinate: val.coordinate,
                        nb_seat_free: val.nb_seat_free, id_category: val.id_category, disponibilityStartTime: val.disponibilityStartTime,
                        disponibilityEndTime: val.disponibilityEndTime, id_user: val.id_user, arrAddress: arrAddress, address: val.address});
                })
            }
            client.close();
            res.send({
                error: null,
                place : arr
            });

        }).catch(function(error){
        console.log("Error server " + error.stack);
        res.send({
            error: error.stack,
            place: []
        });
    });
});

router.post('/addPlace', upload.single('image'), async function(req, res){
    var client = new MongoClient(url);

    client.connect()
        .then(async function(response){
            console.log(req.file);
            console.log(req.body);
            const db = client.db(dbName);
            const user_message = {
                name: req.body.name,
                coordinate: {
                    lon: parseFloat(req.body.coordinate.lon),
                    lat: parseFloat(req.body.coordinate.lat)
                },
                url_image : BASEAPPURL + req.file.path,
                nb_seat: parseInt(req.body.nb_seat),
                nb_seat_free: parseInt(req.body.nb_seat_free),
                address: req.body.address,
                id_category : ObjectId(req.body.idCategory),
                disponibilityStartTime: req.body.disponibilityStartTime,
                disponibilityEndTime: req.body.disponibilityEndTime,
                id_user: ObjectId(req.body.id_user)
            };

            const r = await db.collection('place').insertOne(user_message);
            const inseredNote = await db.collection('place').find({}).toArray();
            console.log(user_message);
            client.close();
            res.send({
                inseredNote
                }
            );


        }).catch(function(error){
        console.log("Error server " + error.stack)
        res.send({
            error: error.message,
            notation: []
        });
    });
});

module.exports = router;
