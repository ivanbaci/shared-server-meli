const Payment = require("../models/payment");
const PaymentMethod = require("../models/paymentMethod");
const Joi = require("joi");

const paymentMethodSchema = Joi.object().keys({
	method: Joi.string().required(),
	expiration_month: Joi.string(),
	expiration_year: Joi.string(),
	number: Joi.string(),
	type: Joi.string()
});

const paymentSchema = Joi.object().keys({
	transaction_id: Joi.string().required(),
	currency: Joi.string().required(),
	value: Joi.number().required(),
	paymentMethod: paymentMethodSchema
});

exports.getAllPayments = (req, res) => {
	//TODO:
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
	//TODO:
	Payment.create({
		transaction_id: req.body.transaction_id,
		currency: req.body.currency,
		value: req.body.value
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
						value: newPayment.value
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

exports.getMethods = (req, res) => {
	//TODO: verificar si esto esta bien
	res.json([
		{
			paymentMethod: "efectivo",
			parameters: [
				{
					method: "string"
				}
			]
		},
		{
			paymentMethod: "tarjeta",
			parameters: [
				{
					method: "string",
					expiration_month: "string",
					expiration_year: "string",
					number: "string",
					type: "string"
				}
			]
		}
	]);
};
