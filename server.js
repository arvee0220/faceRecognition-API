const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");
const dotenv = require("dotenv");
dotenv.config();
const { handleRegister } = require("./controllers/register");
const { handleSignin } = require("./controllers/signin");
const { handleProfileGet } = require("./controllers/profile");
const { handleImage, handleApiCall } = require("./controllers/image");

console.log(process.env);
const db = knex({
    // connect to your own database here:
    client: "pg",
    connection: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
    },
});

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send(db.users);
});

app.post("/signin", handleSignin(db, bcrypt));

app.post("/register", (req, res) => {
    handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
    handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
    handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
    handleApiCall(req, res);
});

app.listen(process.env.PORT || 4000, () => {
    console.log(`app is running on port ${process.env.PORT || 4000}`);
});
