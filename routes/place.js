var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const url = 'mongodb+srv://sivithu:caca@cluster0-abdkp.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'findout';

router.get('/getByIdCategory', function(req, res, next) {
    var client = new MongoClient(url);
    var idCategory = req.body.idCategory;

    client.connect()
        .then(async function(response){
            console.log("Connected to database");
            const db = client.db(dbName);
            const col = await db.collection('place').find({idCategory : ObjectId(idCategory)}).toArray();

            client.close();
            res.send({
                error: null,
                activity: col
            });

        }).catch(function(error){
        console.log("Error server " + error.stack);
        res.send({
            error: error.stack,
            notes: []
        });
    });
});

router.post('/addPlace',  async function(req, res){
    var client = new MongoClient(url);

    client.connect()
        .then(async function(response){

            const db = client.db(dbName);
            const user_message = {
                name: req.body.name,
                coordinate: {
                    lon: req.body.coordinate.lon,
                    lat: req.body.coordinate.lat
                },
                nb_seat: req.body.nb_seat,
                nb_seat_free: req.body.nb_seat_free,
                address: req.body.address,
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
