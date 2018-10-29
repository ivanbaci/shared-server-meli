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
	status: Joi.string().required(),
	paymentMethod: paymentMethodSchema
});

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

exports.updatePayment = (req, res) => {
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
			res.json({
				updatedPayment
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				code: 0,
				message: err.errors.map(e => e.message)
			});
		});
	//TODO: manejar error 401
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
