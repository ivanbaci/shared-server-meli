const Joi = require("joi");
const engine = require("../utils/rules");
const Tracking = require("../models/tracking");
const moment = require("moment");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const PRICE_PER_KM = 15;

const deliverySchema = Joi.object()
	.keys({
		value: Joi.number()
			.required()
			.min(50),
		userscore: Joi.number().required(),
		distance: Joi.number().required(),
		mail: Joi.string()
			.email()
			.required(),
		purchaseQuantity: Joi.number()
			.required()
			.min(0)
	})
	.unknown(true);

exports.validateRequest = (req, res, next) => {
	deliverySchema
		.validate(req.body, { abortEarly: false }) //abortEarly - collect all errors not just the first one
		.then(() => {
			if (req.body.userscore < 0) {
				res.status(402).json({
					code: 402,
					message: ['"Userscore" must be greater or equal to 0']
				});
			} else {
				next();
			}
		})
		.catch(validationError => {
			const errorMessage = validationError.details.map(d => d.message);
			res.status(400).json({
				code: 0,
				message: errorMessage
			});
		});
};

exports.estimateDeliveries = async (req, res) => {
	//TODO: error 401

	let mailDomain = req.body.mail.split("@");
	let today = new Date().getDay();
	let now = new Date().getHours();

	let limit = moment()
		.subtract(30, "minutes")
		.toDate();

	let cantidad = await Tracking.findAndCountAll({
		where: {
			createdAt: {
				[Op.gte]: moment()
					.subtract(30, "minutes")
					.toDate()
			}
		}
	});

	let facts = {
		mailDomain: mailDomain[1],
		purchaseQuantity: req.body.purchaseQuantity,
		day: today,
		hour: now,
		tripsQuantity: cantidad.count
	};

	// Run the engine to evaluate
	engine.run(facts).then(events => {
		// run() returns events with truthy conditions
		let discount = 0;
		let substract = 0;
		let recharge = 0;

		events.map(event => (discount += event.params.discount));
		events.map(event => (substract += event.params.substract));
		events.map(event => (recharge += event.params.recharge));

		let distancePrice = req.body.distance * PRICE_PER_KM;
		discount = distancePrice * (discount / 100);
		recharge = distancePrice * (recharge / 100);

		distancePrice = distancePrice - substract - discount + recharge;

		distancePrice = distancePrice < 0 ? 0 : distancePrice;

		res.json({
			metadata: {
				version: "1.0.0"
			},
			cost: {
				currency: "ARS",
				value: distancePrice
			}
		});
	});
};
