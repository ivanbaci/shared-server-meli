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
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/delivery", deliveryRouter);
    app.use("/server", serverRouter);
    app.use("/payment", paymentRouter);
    //app.use(passport.authenticate("jwt", { session: false }));
    app.use("/tracking", trackingRouter);
};
