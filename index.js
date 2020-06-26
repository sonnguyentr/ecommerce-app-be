require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// Setting up port
const mongoUri = process.env.MONGO_HOST;
let PORT = process.env.PORT || 3030;

const routes = require("./src/routes");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

//MONGO
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () =>
    console.log("MongoDB --  database connection established successfully!")
);
connection.on("error", (err) => {
    console.log(
        "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
    process.exit();
});

//ROUTES
app.use("/api", routes);
app.get("/", (req, res) => {
    res.send("Hello World");
});
//SERVER
app.listen(PORT, () => {
    console.log("Server listening on port " + PORT);
});
