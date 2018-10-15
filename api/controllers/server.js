const Server = require("../models/server");

exports.getServers = (req, res) => {
	Server.findAll()
		.then(servers => {
			res.json(servers);
		})
		.catch(err => {
			res.status(500).json(err);
		});
};

exports.saveServer = (req, res) => {
	//TODO: validate req
	Server.sync({ force: false })
		.then(() => {
			return Server.create({
				id: req.body.id,
				_rev: req.body._rev,
				createdBy: req.body.createdBy,
				name: req.body.name,
				lastConnection: Date.now() //TODO: ver como mantener esto
			});
		}) //TODO: manejar error en la creacion de la db
		.then(newServer => {
			res.status(201).json({
				metadata: {
					version: "1"
				},
				newServer
			});
		});
};

exports.getServerById = (req, res) => {
	Server.findById(req.params.id).then(server => {
		res.json(server);
	});
	//TODO: manejar errores
};

exports.updateServer = (req, res) => {
	Server.update(
		{ _rev: req.body._rev, name: req.body.name },
		{ returning: true, where: { id: req.params.id } }
	).then(([rowsUpdate, [updatedServer]]) => {
		res.json({
			metadata: {
				version: "2" //TODO: contador en version
			},
			updatedServer
		});
	});
	//TODO: manejar errores
};

exports.resetServerToken = (req, res) => {
	//TODO: que vendria a ser esto
};

exports.deleteServer = (req, res) => {
	Server.destroy({ where: { id: req.params.id } }).then(() => {
		res.status(204).send();
	});
	//TODO: manejar errores
};
