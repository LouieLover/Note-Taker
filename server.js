var express = require("express");
var path = require("path");
const { fstat } = require("fs");
var Db = require("./db/db.json");
let fs = require("fs");
const bodyParser = require('body-parser');
const { get } = require("http");
const { writeFileSync } = require("fs");


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3300;



// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("./db/db.json"));

//data

var notes = "";


// Routes
// =============================================================

//Routes

//notes section
app.get("/notes", function(req, res) {
    console.log(req.body);
    res.sendFile(path.join(__dirname, "public/notes.html"));

});

app.get("/api/notes", function(req, res) {
    console.log(res.body);
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.log(err);
            return res.json({
                error: true,
                data: null,
                message: "unable to read note"
            });
        }
        console.log(data);
        const db = JSON.parse(data);
        res.json(db);
    });


});

app.post("/api/notes", function(req, res) {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.log(err);
            return res.json({
                error: true,
                data: null,
                message: "unable to read note in post route"
            });
        }
        const db = JSON.parse(data);
        // req.body.id = db.length;
        db.push(req.body);
        fs.writeFileSync("./db/db.json", JSON.stringify(db), (err) => {
            if (err) {
                console.log(db);
                return res.json({
                    error: true,
                    data: null,
                    message: "unable to write note"
                });
            }
            res.json({
                error: false,
                data: db,
                message: "added new note"
            });
        });
        // fs.writeFileSync("./db/db.json", JSON.stringify(db), (err) => {
        //     if (err) throw err;
        //     console.log(db);

        // });
    });

    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", function(req, res) {

    res.sendFile(path.join(__dirname, "public/index.html"));
});
//index section 


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});