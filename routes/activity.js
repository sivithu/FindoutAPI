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
            const activites = await db.collection('activity').find({}).toArray();
            const categories = await db.collection('category').find({}).toArray();

            activites.forEach(activity => {
                let categoriesArray = [];
                categories.forEach(category => {
                    if(ObjectId(category.id_activity).equals(ObjectId(activity._id))) {
                        categoriesArray.push(category)
                    }
                });
                activity["categories"] = categoriesArray;
            });

            res.send({
                error: null,
                activity: activites
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
