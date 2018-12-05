const Payment = require("../models/payment");
const PaymentMethod = require("../models/paymentMethod");
const Joi = require("joi");

const paymentMethodSchema = Joi.object()
    .keys({
        method: Joi.string().required(),
        expiration_month: Joi.string()
            .allow(null)
            .allow(""),
        expiration_year: Joi.string()
            .allow(null)
            .allow(""),
        number: Joi.string()
            .allow(null)
            .allow(""),
        type: Joi.string()
            .allow(null)
            .allow("")
    })
    .unknown(true);

const paymentSchema = Joi.object()
    .keys({
        transaction_id: Joi.string().required(),
        currency: Joi.string().required(),
        value: Joi.number().required(),
        status: Joi.string().required(),
        paymentMethod: paymentMethodSchema
    })
    .unknown(true);

exports.validateRequest = (req, res, next) => {
    paymentSchema
        .validate(req.body, { abortEarly: false }) //abortEarly - collect all errors not just the first one
        .then(() => {
            next();
        })
        .catch(validationError => {
            const errorMessage = validationError.details.map(d => d.message);
            res.status(400).json({
                code: 0,
                message: errorMessage
            });
        });
};

exports.getAllPayments = (req, res) => {
    Payment.findAll({
        include: PaymentMethod
    })
        .then(payments => {
            res.json(payments);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                code: 0,
                message: err.errors.map(e => e.message)
            });
        });
};

exports.createNewPayment = (req, res) => {
    Payment.create({
        transaction_id: req.body.transaction_id,
        currency: req.body.currency,
        value: req.body.value,
        status: req.body.status
    })
        .then(newPayment => {
            newPayment
                .createPaymentMethod({
                    method: req.body.paymentMethod.method
                })
                .then(() => {
                    res.status(201).json({
                        transaction_id: newPayment.transaction_id,
                        currency: newPayment.currency,
                        value: newPayment.value,
                        status: newPayment.status
                        //TODO: devolver paymentMethod
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                code: 0,
                message: err.errors.map(e => e.message)
            });
        });
};

exports.updatePayment = (req, res, next) => {
    Payment.update(
        { status: req.body.status },
        { returning: true, where: { transaction_id: req.params.id } }
    )
        .then(([rowsUpdate, [updatedPayment]]) => {
            if (rowsUpdate === 0) {
                res.status(404).json({
                    code: 0,
                    message: "No existe el recurso solicitado"
                });
                return;
            }
            next();
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                code: 0,
                message: err.errors.map(e => e.message)
            });
        });
};

exports.notifyAppServer = (req, res) => {
    var http = require("http");
    let allPath = "/payments/" + req.body.transaction_id;

    requestBody = {
        status: req.body.status,
        trackingid: "123"
    };

    var options = {
        host: "www.app-server-meli.herokuapp.com",
        path: allPath,
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: requestBody
    };

    console.log(options);

    var req = http.request(options, function(res) {
        console.log("STATUS: " + res.statusCode);
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on("data", function(chunk) {
            // You can process streamed parts here...
            bodyChunks.push(chunk);
        }).on("end", function() {
            var body = Buffer.concat(bodyChunks);
            //console.log("Br pODY: " + body);
            // ...and/orocess the entire body here.
            res.json({
                updatedPayment
            });
        });
    });

    req.on("error", function(e) {
        console.log("ERROR: " + e.message);
    });
};

exports.getMethods = (req, res) => {
    res.json([
        {
            paymentMethod: "cash",
            parameters: [
                {
                    method: "string"
                }
            ]
        },
        {
            paymentMethod: "card",
            parameters: [
                {
                    method: "string",
                    expiration_month: "string",
                    expiration_year: "string",
                    number: "string",
                    type: "debit"
                }
            ]
        },
        {
            paymentMethod: "card",
            parameters: [
                {
                    method: "string",
                    expiration_month: "string",
                    expiration_year: "string",
                    number: "string",
                    type: "credit"
                }
            ]
        }
    ]);
};
