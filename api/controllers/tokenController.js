const crypto = require("crypto");
const moment = require("moment");

function validateUser(req, res) {
	console.log("validando user");
}

function responseToken(res) {
	crypto.randomBytes(48, function(err, buffer) {
		if (err) {
			res.status(500).json({
				message: "Error generando el token"
			});
		}
		let newToken = buffer.toString("hex");

		let localDate = moment().local();
		localDate.add(2, "h");
		let date = localDate.format("YYYY-MM-DD HH:mm:ss");

		//TODO: agregar metadata
		res.json({
			token: {
				expiresAt: date,
				token: newToken
			}
		});
	});
}

exports.generateToken = (req, res) => {
	validateUser(req);
	responseToken(res);
};
