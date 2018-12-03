const Sequelize = require("sequelize");

const sequelize = new Sequelize(
	"d23n0j4eh8pqta",
	"danuwcbygcvjwf",
	"6e9b2ee0d2b622e86ee3f7a5cff56a844c844ac3a79315d540da9b2c24ac9c15",
	{
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
	}
);

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
