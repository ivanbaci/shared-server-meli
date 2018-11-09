const passport = require("passport");

//Routes
const authRouter = require("./auth");
const userRouter = require("./user");
const serverRouter = require("./server");
const paymentRouter = require("./payment");
const deliveryRouter = require("./delivery");
const trackingRouter = require("./tracking");

// Router
module.exports = app => {
	// Auth
	app.use("/token", authRouter);
	app.use("/user", userRouter);
	app.use("/server", serverRouter);
	app.use("/payment", paymentRouter);
	app.use("/delivery", deliveryRouter);
	app.use("/tracking", trackingRouter);
};
/* 
module.exports = app => {
    // Auth
    app.use(
        "/token",
        passport.authenticate("jwt", { session: false }),
        authRouter
    );
    app.use(
        "/user",
        passport.authenticate("jwt", { session: false }),
        userRouter
    );
    app.use(
        "/server",
        passport.authenticate("jwt", { session: false }),
        serverRouter
    );
    app.use(
        "/payment",
        passport.authenticate("jwt", { session: false }),
        paymentRouter
    );
    app.use(
        "/delivery",
        passport.authenticate("jwt", { session: false }),
        deliveryRouter
    );
    app.use(
        "/tracking",
        passport.authenticate("jwt", { session: false }),
        trackingRouter
    );
}; */
