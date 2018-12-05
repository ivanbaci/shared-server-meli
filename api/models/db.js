const Sequelize = require("sequelize");

let sequelize = null;

if (process.env.HEROKU_POSTGRESQL_BRONZE_URL) {
	// the application is executed on Heroku ... use the postgres database
	sequelize = new Sequelize(process.env.HEROKU_POSTGRESQL_BRONZE_URL, {
		dialect: "postgres",
		protocol: "postgres",
		port: match[4],
		host: match[3],
		logging: true, //false
		ssl: true,
		dialectOptions: {
			ssl: true
		}
	});
} else {
	sequelize = new Sequelize("meli", "postgres", "root", {
		host: "localhost",
		dialect: "postgres",
		operatorsAliases: false,

		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		},
		logging: false,
		timezone: "-03:00" //TODO: no funciona bien el timezone
	});
}

sequelize
	.authenticate()
	.then(() => {
		console.log("Connection has been established succesfully.");
	})
	.catch(err => {
		console.error("Unable to connect to database: ", err);
	});

module.exports = sequelize;

const Payment = require("./payment");
const PaymentMethod = require("./paymentMethod");

Payment.belongsTo(PaymentMethod, { onDelete: "CASCADE" });

sequelize.sync({ force: true }).catch(err => {
	console.log(err);
});
