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
            const col = await db.collection('activity').find({}).toArray();

            client.close();
            res.send({
                error: null,
                activity: col
            });

        }).catch(function(error){
        console.log("Error server " + error.stack);
        res.send({
            error: error.stack,
            activity: []
        });
    });
});

module.exports = router;
