const Sequelize = require("sequelize");

const sequelize = new Sequelize("meli", "postgres", "root", {
	host: "localhost",
	dialect: "postgres",
	operatorsAliases: false,

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});

sequelize
	.authenticate()
	.then(() => {
		console.log("Connection has been established succesfully.");
	})
	.catch(err => {
		console.error("Unable to connect to database: ", err);
	});

module.exports = sequelize;
