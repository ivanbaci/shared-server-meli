const crypto = require("crypto");

exports.generateToken = (req, res) => {
	crypto.randomBytes(48, function(err, buffer) {
		var token = buffer.toString("hex");
		res.send(token);
	});
};
