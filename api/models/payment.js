const Sequelize = require("sequelize");
const connection = require("./db");

const Payment = connection.define("payment", {
	transaction_id: {
		type: Sequelize.STRING,
		primaryKey: true,
		allowNull: false
	},
	currency: {
		type: Sequelize.STRING,
		allowNull: false
	},
	value: {
		type: Sequelize.DOUBLE,
		allowNull: false
	}
});

module.exports = Payment;
