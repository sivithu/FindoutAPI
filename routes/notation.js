var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const url = 'mongodb+srv://sivithu:caca@cluster0-abdkp.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'findout';

router.post('/addNotation',  async function(req, res){
    var client = new MongoClient(url);

    client.connect()
        .then(async function(response){

            const db = client.db(dbName);
            const user_notation = {
                message: req.body.message,
                score: req.body.score,
                id_user: ObjectId(req.body.id_user),
                id_place: ObjectId(req.body.id_place)
            };

            const r = await db.collection('notation').insertOne(user_notation);
            const inseredNote = await db.collection('notation').find({}).toArray();
            console.log(user_notation);
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
