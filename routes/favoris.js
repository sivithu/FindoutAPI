var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const url = 'mongodb+srv://sivithu:caca@cluster0-abdkp.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'findout';

router.post('/addFavoris',  async function(req, res){
    var client = new MongoClient(url);

    client.connect()
        .then(async function(response){

            const db = client.db(dbName);
            const user_favoris = {
                id_user: ObjectId(req.body.id_user),
                id_place: ObjectId(req.body.id_place)
            };

            const r = await db.collection('favoris').insertOne(user_favoris);
            const inseredNote = await db.collection('favoris').find({}).toArray();
            console.log(user_favoris);
            client.close();
            res.send({
                    inseredNote
                }
            );


        }).catch(function(error){
        console.log("Error server " + error.stack)
        res.send({
            error: error.message,
            favoris: []
        });
    });
});

router.put('/deleteFavoris', async function(req, res){
    var client = new MongoClient(url);

    client.connect()
        .then(async function(response){
                    const db = client.db(dbName);
                    const favorisId = req.body._id;

                    const noteToDelete = await db.collection('favoris').find({ _id: ObjectId(favorisId) }).toArray();

                    await db.collection('favoris').deleteOne(noteToDelete[0]);
                    const allNotes = await db.collection('favoris').find().toArray();

                    res.status(200).send({
                        error: null,
                        favoris: allNotes
                    });
                    client.close();
        }).catch(function(error){
        console.log("Error server " + error.stack)
        res.status(500).send({
            error: error
        });
    });
})

module.exports = router;
