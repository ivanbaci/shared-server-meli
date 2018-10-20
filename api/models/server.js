const Sequelize = require("sequelize");
const connection = require("./db");

const Server = connection.define("server", {
	id: {
		type: Sequelize.STRING,
		primaryKey: true
	},
	_rev: {
		type: Sequelize.STRING
	},
	createdBy: {
		type: Sequelize.STRING
	},
	createdTime: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	},
	name: {
		type: Sequelize.STRING
	},
	lastConnection: {
		type: Sequelize.DATE
	}
});

module.exports = Server;
