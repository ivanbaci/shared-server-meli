const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");

// Enviroment
const config = require("./api/config");
const passportSetup = require("./api/config/passportSetup");
const routes = require("./api/routes");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors(config.cors));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header(
			"Access-Control-Allow-Methods",
			"PUT, POST, PATCH, DELETE, GET"
		);
		return res.status(200).json({});
	}
	next();
});

// Routes which should hanlde requests
routes(app);

// Handle routes that are not supported in the api
app.use((req, res, next) => {
	const error = new Error("Not founded");
	error.status = 404;
	next(error);
});

app.use((err, req, res, next) => {
	console.log(err);
	res.status(err.status || 500);
	res.json(err);
});

module.exports = app;
