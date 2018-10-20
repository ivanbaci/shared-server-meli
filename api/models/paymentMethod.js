const Sequelize = require("sequelize");
const connection = require("./db");

const PaymentMethod = connection.define("paymentMethod", {
	method: {
		type: Sequelize.STRING
	},
	expiration_month: {
		type: Sequelize.STRING
	},
	expiration_year: {
		type: Sequelize.STRING
	},
	number: {
		type: Sequelize.STRING
	},
	type: {
		type: Sequelize.STRING
	}
});

module.exports = PaymentMethod;
