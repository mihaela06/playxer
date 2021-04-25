const sslRedirect = require('heroku-ssl-redirect').default
const express = require("express");

const app = express();
const path = require("path");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const config = require("./config/key");

const mongoose = require("mongoose");
const connect = mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

app.use(sslRedirect(["production"], 301));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use("/uploads", express.static("uploads"));

app.use("/api/users", require("./routes/users"));
app.use("/api/spotify", require("./routes/spotify"));
app.use("/api/admins", require("./routes/admins"));
app.use("/api/tags", require("./routes/tags"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
    // Set static folder
    // All the javascript and css files will be read and served from this folder
    app.use(express.static("client/build"));

    // index.html for all page routes    html or routing and naviagtion
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
    });
}

const port = process.env.PORT || 5050;

app.listen(port, () => {
    console.log(`Server Listening on ${port}`);
});