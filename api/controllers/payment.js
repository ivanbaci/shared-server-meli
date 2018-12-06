const Payment = require("../models/payment");
const PaymentMethod = require("../models/paymentMethod");
const Joi = require("joi");
const request = require("request");

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
    let finalUri =
        "http://app-server-meli.herokuapp.com/payments/" +
        req.body.transaction_id;
    request(
        {
            uri: finalUri,
            method: "PUT",
            timeout: 10000,
            followRedirect: true,
            maxRedirects: 10,
            json: true,
            body: {
                status: req.body.status,
                tracking_id: req.body.tracking_id
            }
        },
        function(error, response, body) {
            console.log(response.statusCode);
            if (!error) {
                res.status(200);
            } else {
                res.status(500).json(error);
            }
        }
    );
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
