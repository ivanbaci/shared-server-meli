const Sequelize = require("sequelize");
const connection = require("./db");

const Tracking = connection.define("tracking", {
	id: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false
	},
	status: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

module.exports = Tracking;
