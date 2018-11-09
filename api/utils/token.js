const jwt = require("jsonwebtoken");

const createToken = auth => {
	return jwt.sign(
		{
			id: auth.id
		},
		"my-secret",
		{
			expiresIn: "1h"
		}
	);
};

module.exports = {
	generateToken: (req, res, next) => {
		req.token = createToken(req.auth);
		return next();
	},
	sendToken: (req, res) => {
		console.log(req.token);
		res.setHeader("x-auth-token", req.token);
		return res.status(200).json({
			metadata: {
				version: "1.0.0"
			},
			token: {
				token: req.token
				//TODO: expires at
			}
		});
	}
};
