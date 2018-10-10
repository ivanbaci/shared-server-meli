const Server = require("../models/serverModel");

exports.getServers = (req, res) => {
	Server.findAll().then(servers => {
		res.json(servers);
	});
};

exports.saveServer = (req, res) => {
	Server.sync({ force: false }).then(() => {
		return Server.create({
			id: "prueba2",
			_rev: "chucu",
			createdBy: "ivan",
			name: "appserver",
			lastConnection: Date.now()
		});
	});
	res.json({
		message: "ok"
	});
};

exports.getServerById = (req, res) => {
	Server.findById("prueba").then(server => {
		res.json(server);
	});
};

exports.updateServer = (req, res) => {
	//TODO:
};

exports.resetServerToken = (req, res) => {
	//TODO:
};

exports.deleteServer = (req, res) => {
	//TODO:
};
