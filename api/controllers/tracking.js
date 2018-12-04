const Tracking = require("../models/tracking");
const Joi = require("joi");

const trackingSchema = Joi.object()
	.keys({
		id: Joi.string().required(),
		status: Joi.string().required()
	})
	.unknown(true);

exports.validateTracking = (req, res, next) => {
	trackingSchema
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

exports.getAll = (req, res) => {
	Tracking.findAll()
		.then(tracking => {
			res.json(tracking);
		})
		.catch(err => {
			res.status(500).json({
				code: 0,
				message: err.errors.map(e => e.message)
			});
		});
};

exports.createNewShipping = (req, res) => {
	Tracking.create({
		id: req.body.id,
		status: req.body.status,
		updatedAt: req.body.updatedAt //TODO: ponerle fecha actual
	})
		.then(newTracking => {
			res.status(201).json(newTracking);
		})
		.catch(err => {
			res.status(500).json({
				code: 0,
				message: err.errors.map(e => e.message)
			});
		});
};

exports.getTrackingById = (req, res) => {
	Tracking.findById(req.params.id)
		.then(tracking => {
			if (!tracking) {
				res.status(404).json({
					code: 0,
					message: "Viaje inexistente"
				});
				return;
			}
			res.json(tracking);
		})
		.catch(err => {
			res.status(500).json({
				code: 0,
				message: err.errors.map(e => e.message)
			});
		});
};

exports.updateTracking = (req, res) => {
	Tracking.update(
		{ status: req.body.status }, //TODO: update de updateAt
		{ returning: true, where: { id: req.params.id } }
	)
		.then(([rowsUpdate, [updatedTracking]]) => {
			if (rowsUpdate === 0) {
				res.status(404).json({
					code: 0,
					message: "No existe el recurso solicitado"
				});
				return;
			}
			res.json({
				updatedTracking
			});
		})
		.catch(err => {
			res.status(500).json({
				code: 0,
				message: err.errors.map(e => e.message)
			});
		});
};
