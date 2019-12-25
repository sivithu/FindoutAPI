var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const url = 'mongodb+srv://sivithu:caca@cluster0-abdkp.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'findout';

/* RÉCUPERATION DE TOUT LES USERS */
router.get('/getAll', function(req, res, next) {
    var client = new MongoClient(url);

    client.connect()
        .then(async function(response){
            console.log("Connected to database");
            const db = client.db(dbName);
            const col = await db.collection('users').find({}).toArray();

            client.close();
            res.send({
                error: null,
                users: col
            });

        }).catch(function(error){
        console.log("Error server " + error.stack);
        res.send({
            error: error.stack,
            notes: []
        });
    });
});

router.post('/addUser',  async function(req, res){
    var client = new MongoClient(url);

    client.connect()
        .then(async function(response){

            const db = client.db(dbName);
            const user_message = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                password: req.body.password,
                birthDate: req.body.birthDate,
                email: req.body.email,
                gender: req.body.gender,
                telephone: req.body.telephone
            };

            const r = await db.collection('users').insertOne(user_message);
            const inseredNote = await db.collection('users').find({}).toArray();
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
            notes: []
        });
    });
});

module.exports = router;
