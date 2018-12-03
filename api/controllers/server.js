const Server = require("../models/server");
const Joi = require("joi");

exports.getServers = (req, res) => {
	Server.findAll()
		.then(servers => {
			res.json(servers);
		})
		.catch(err => {
			res.status(500).json({
				code: 0,
				message: err.errors.map(e => e.message)
			});
		});
};

const serverSchema = Joi.object().keys({
	id: Joi.string().required(),
	_rev: Joi.string().required(),
	createdBy: Joi.string().required(),
	createdTime: Joi.date(),
	name: Joi.string().required(),
	lastConnection: Joi.date()
});

exports.validateRequest = (req, res, next) => {
	serverSchema
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

exports.saveServer = (req, res) => {
	console.log("Server post");
	Server.create({
		id: req.body.id,
		_rev: req.body._rev,
		createdBy: req.body.createdBy,
		name: req.body.name,
		lastConnection: Date.now()
	})
		.then(newServer => {
			res.status(201).json({
				metadata: {
					version: "1"
				},
				newServer
			});
		})
		.catch(err => {
			res.status(500).json({
				code: 0,
				message: err.errors.map(e => e.message)
			});
		});
};

exports.getServerById = (req, res) => {
	Server.findById(req.params.id)
		.then(server => {
			if (!server) {
				res.status(404).json({
					code: 0,
					message: "Servidor inexistente"
				});
				return;
			}
			res.json(server);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				code: 0,
				message: err.errors.map(e => e.message)
			});
		});
};

exports.updateServer = (req, res) => {
	Server.update(
		{ _rev: req.body._rev, name: req.body.name },
		{ returning: true, where: { id: req.params.id } }
	)
		.then(([rowsUpdate, [updatedServer]]) => {
			if (rowsUpdate === 0) {
				res.status(404).json({
					code: 0,
					message: "No existe el recurso solicitado"
				});
				return;
			}
			res.json({
				metadata: {
					version: "1"
				},
				updatedServer
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				code: 0,
				message: err.errors.map(e => e.message)
			});
		});
	//TODO: manejar error 409
};

exports.resetServerToken = (req, res) => {
	//TODO: que vendria a ser esto
};

exports.deleteServer = (req, res) => {
	Server.destroy({ where: { id: req.params.id } })
		.then(rowsDestroyed => {
			if (rowsDestroyed === 0) {
				res.status(404).json({
					code: 0,
					message: "No existe el recurso solicitado"
				});
				return;
			}
			res.status(204).send();
		})
		.catch(err => {
			res.status(500).json({
				code: 0,
				message: err.errors.map(e => e.message)
			});
		});
};
