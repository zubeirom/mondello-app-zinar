require("dotenv").config();
const express = require("express");
const cors = require("cors");
const wk = require("./wk.json");
const jwt = require("jsonwebtoken");
const bodyParser = require("express");
const fs = require("fs");

const app = express();

// cors
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
    res.json(wk);
});

app.put("/wk", async (req, res) => {
    try {
        await verify(req.headers.authorization);
        fs.writeFile("wk.json", JSON.stringify(req.body), "utf8", (error) => {
            if (error) {
                res.status(500).send(error);
            }
            res.json(req.body);
        });
    } catch (error) {
        res.status(401).send("Unauthorized");
    }
});

async function verify(header) {
    const token = header.split(" ")[1];
    await jwt.verify(token, process.env.JWT_PRIVATE_KEY);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
