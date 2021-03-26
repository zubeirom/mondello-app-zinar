require("dotenv").config();
const express = require("express");
const cors = require("cors");
const wk = require("./wk.json");
const jwt = require("jsonwebtoken");
const bodyParser = require("express");
const fs = require("fs");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

// cors
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbName = "mondelloDB";
let db;

const init = () =>
    MongoClient.connect(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then((client) => {
            db = client.db(dbName);
        })
        .catch((e) => console.error(e));

app.post("/token", async (req, res) => {
    const { username, password, grant_type } = req.body;
    if (grant_type === "password") {
        try {
            if (
                password === process.env.PASSWORD &&
                username === process.env.USER_NAME
            ) {
                const payload = {
                    id: process.env.SECRET,
                };
                const token = await jwt.sign(
                    payload,
                    process.env.JWT_PRIVATE_KEY
                );
                res.status(200).send(`{ "access_token": "${token}" }`);
            } else {
                res.status(400).send('{"error": "invalid_grant"}');
            }
        } catch (error) {
            throw error;
        }
    } else {
        res.status(400).send('{ "error": "unsupported_grant_type" }');
    }
});

app.get("/wk", (req, res) => {
    db.collection("wk")
        .find({})
        .toArray((err, result) => {
            res.json(result[0]);
        });
});

app.put("/wk", async (req, res) => {
    try {
        await verify(req.headers.authorization);
        delete req.body._id;
        db.collection("wk").updateOne(
            { wkid: "1" },
            { $set: req.body },
            (err, result) => {
                if (err) {
                    console.error(err);
                    res.status(500).send(err);
                }
                res.json(req.body);
            }
        );
    } catch (error) {
        console.error(error);
        res.status(400).send("Bad");
    }
});

async function verify(header) {
    const token = header.split(" ")[1];
    await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
}

const PORT = process.env.PORT || 3000;
init().then(() => {
    console.log("starting server on port 3000");
    app.listen(PORT);
});
