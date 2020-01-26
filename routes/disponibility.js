var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const url = 'mongodb+srv://sivithu:caca@cluster0-abdkp.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'findout';

router.get('/getAll', function(req, res, next) {
    var client = new MongoClient(url);

    client.connect()
        .then(async function(response){
            console.log("Connected to database");
            const db = client.db(dbName);
            const col = await db.collection('disponibility').find({}).toArray();
            console.log(col)
            client.close();
            res.send({
                error: null,
                disponibility: col
            });

        }).catch(function(error){
        console.log("Error server " + error.stack);
        res.send({
            error: error.stack,
            disponibility: []
        });
    });
});

router.get('/getByIdPlace/:idPlace', function(req, res, next) {
    var client = new MongoClient(url);
    var idPlace = req.params.idPlace;

    client.connect()
        .then(async function(response){
            console.log("Connected to database");
            const db = client.db(dbName);
            const col = await db.collection('disponibility').find({id_place : ObjectId(idPlace)}).toArray();
            console.log(col)
            client.close();
            res.send({
                error: null,
                disponibility: col
            });

        }).catch(function(error){
        console.log("Error server " + error.stack);
        res.send({
            error: error.stack,
            disponibility: []
        });
    });
});

router.get('/getByIdPlaceAndDate/:id/:date', function(req, res, next) {
    var client = new MongoClient(url);
    var idPlace = req.params.id;
    var date = req.params.date;

    client.connect()
        .then(async function(response){
            console.log("Connected to database");
            const db = client.db(dbName);
            const col = await db.collection('disponibility').find({id_place : ObjectId(idPlace), date: date}).toArray();

            client.close();
            res.send({
                error: null,
                disponibility : col
            });

        }).catch(function(error){
        console.log("Error server " + error.stack);
        res.send({
            error: error.stack,
            disponibility: []
        });
    });
});

router.post('/addDisponibility',  async function(req, res){
    var client = new MongoClient(url);

    client.connect()
        .then(async function(response){

            const db = client.db(dbName);
            const user_disponibility = {
                date : req.body.date,
                startTime : req.body.startTime,
                endTime : req.body.endTime,
                nbPlace : parseInt(req.body.nbPlace),
                id_user: ObjectId(req.body.id_user),
                id_place: ObjectId(req.body.id_place)
            };

            const checkDispo = await db.collection('disponibility').find({id_place : ObjectId(user_disponibility.id_place), date : user_disponibility.date.toString()}).toArray();
            const checkDispoCount = await db.collection('disponibility').find({id_place : ObjectId(user_disponibility.id_place), date: user_disponibility.date.toString()}).count();
            const place = await db.collection('place').find({_id : ObjectId(user_disponibility.id_place)}).toArray();
            var place_available = 0;
            console.log(checkDispoCount);
            for(var i = 0; i < checkDispoCount; i++) {
                place_available += checkDispo[i].nbPlace;
                console.log("test : " + place_available)
            }
            if(place[0].nb_seat - (place_available + user_disponibility.nbPlace) < 0) {
                res.status(403).send({
                    error: "Plus de place",
                    disponibility: []
                })

            }
            const r = await db.collection('disponibility').insertOne(user_disponibility);
            const inseredNote = await db.collection('disponibility').find({}).toArray();
            client.close();
            res.status(200).send({
                    error: null,
                    disponibility: inseredNote
                }
            );


        }).catch(function(error){
        console.log("Error server " + error.stack)
        res.status(404).send({
            error: error.message,
            disponibility: []
        });
    });
});

router.put('/deleteDisponibility', async function(req, res){
    var client = new MongoClient(url);

    client.connect()
        .then(async function(response){
            const db = client.db(dbName);
            const disponibiltyId = req.body._id;

            const noteToDelete = await db.collection('disponibility').find({ _id: ObjectId(disponibiltyId) }).toArray();

            await db.collection('disponibility').deleteOne(noteToDelete[0]);
            const allNotes = await db.collection('disponibility').find().toArray();

            res.status(200).send({
                error: null,
                disponibility: allNotes
            });
            client.close();
        }).catch(function(error){
        console.log("Error server " + error.stack)
        res.status(500).send({
            error: error
        });
    });
});

router.put('/updateDisponibility', async function(req, res){
    var client = new MongoClient(url);
    client.connect()
        .then(async (response) => {
            const db = client.db(dbName);
            const dispoId = req.body._id;

            const currentNote = await db.collection('disponibility').find({ _id: ObjectId(dispoId) }).toArray();
            await db.collection('disponibility').update(
                { _id: ObjectId(dispoId) },
                {
                    $set: {
                        date: req.body.date,
                        startTime: req.body.startTime,
                        endTime: req.body.endTime,
                        nbPlace : req.body.nbPlace
                    }
                });
            const updatedNote = await db.collection('disponibility').find({ _id: ObjectId(dispoId) }).toArray();

            res.status(200).send({
                error: null,
                date: updatedNote[0].date,
                startTime: updatedNote[0].startTime,
                endTime: updatedNote[0].endTime,
                nbPlace: updatedNote[0].nbPlace,
            });
        }).catch((err) => {
        res.send({
            error: err.stack,
            disponibility: null
        });
    });

    client.close();
});


module.exports = router;
