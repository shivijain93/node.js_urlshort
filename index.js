const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb');
const url="mongodb://localhost:27017"

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/view', function (req, res) {
    MongoClient.connect(url, (err, client) => {
        if (err) return console.log(err);
        var db = client.db("URL");
        var list = db.collection('URL').find().toArray();
        list.then(function (data) {
                client.close();
                res.json(data);
            })
            .catch(function (err) {
                client.close();
                res.status(500).json({
                    message: "Failure"
                })
            })
    })
});

app.post('/create', function (req, res) {
    MongoClient.connect(url, (err, client) => {
        if (err) return console.log(err);
        var db = client.db("URL");
        db.collection('URL').insertOne({ long: req.body.URL, short: shortURL() }, (err, result) => {
            if (err) throw err;
            client.close();
            res.json({
                message: "Link added"
            })
        })
    })
})

function shortURL() {
    var short = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charLen = characters.length;
    for (var i = 0; i < 7; i++) {
        short += characters.charAt(
            Math.floor(Math.random() * charLen)
        );
    }
    return short;
}

app.listen(3000, function () {
    console.log("port is running at ",3000);
})
