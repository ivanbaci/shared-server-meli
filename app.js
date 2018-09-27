const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const tokenRouter = require("./api/routes/token");
const serverRouter = require("./api/routes/server");
const paymentRouter = require("./api/routes/payment");
const deliveryRouter = require("./api/routes/delivery");
const trackingRouter = require("./api/routes/tracking");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
app.use("/token", tokenRouter);

app.use("/servers", serverRouter);

app.use("/payments", paymentRouter);

app.use("/deliveries", deliveryRouter);

app.use("/tracking", trackingRouter);

// Handle routes that are not supported in the api
app.use((req, res, next) => {
	const error = new Error("Not founded");
	error.status = 404;
	next(error);
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({
		error: {
			message: err.message
		}
	});
});

module.exports = app;
