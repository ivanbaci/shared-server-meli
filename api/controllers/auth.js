// Dependencies
const Joi = require("joi");
const passport = require("passport");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

const tokenSchema = Joi.object().keys({
	email: Joi.string()
		.email()
		.min(3)
		.max(30)
		.required(),
	password: Joi.string()
		.regex(/^[a-zA-Z0-9]{3,30}$/)
		.required()
});

exports.validateRequest = (req, res, next) => {
	tokenSchema
		.validate(req.body, { abortEarly: false }) //abortEarly - collect all errors not just the first one
		.then(() => {
			next();
		})
		.catch(validationError => {
			const errorMessage = validationError.details.map(d => d.message);
			res.status(400).json({
				code: 0,
				message: errorMessage
			});
		});
};

// Local Login
exports.login = (req, res, next) => {
	User.findOne({ where: { email: req.body.email } })
		.then(user => {
			if (!user) {
				console.log("no email");
				return res.status(401).send("No user found.");
			}

			const passwordIsValid =
				req.body.password &&
				user.password &&
				bcrypt.compareSync(req.body.password, user.password);
			console.log(passwordIsValid);
			if (!passwordIsValid)
				return res.status(401).send("Password invalid");

			req.user = user;
			req.auth = {
				id: user.id
			};

			next();
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				code: 0,
				message: err.errors.map(e => e.message)
			});
		});
};
