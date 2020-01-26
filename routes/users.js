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

            let data = await db.collection('users').find({}).toArray();
            if (data.some(data => data.email === req.body.email)) {
                res.status(400).send({error: 'Cet email est déjà associé à un compte'});
            } else {
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
                const inseredNote = await db.collection('users').find({ email: req.body.email, password: req.body.password}).toArray();
                res.send({
                        user: inseredNote[0]
                });
            }
        }).catch(function(error){
        console.log("Error server " + error.stack);
    });
});

router.post('/connect', async function (req, res) {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('users');
        var result = await col.find({email: req.body.email, password: req.body.password}).toArray();
        if (result.length) {
            res.send({
                error: null,
                user: {
                    _id: result[0]._id,
                    firstname: result[0].firstname,
                    lastname: result[0].lastname,
                    password: result[0].password,
                    birthDate: result[0].birthDate,
                    email: result[0].email,
                    gender: result[0].gender,
                    telephone: result[0].telephone
                }
            });
        } else {
            res.status(403).send({
                error: 'Cet identifiant ou mot de passe est inconnu',
                user: []
            });
        }
    } catch (err) {
        res.send({
            error: err,
            user: []
        })
    }
    client.close();
});

module.exports = router;
