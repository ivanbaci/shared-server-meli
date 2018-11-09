const User = require("../models/user");

//Dependencies
const Joi = require("joi");
const bcrypt = require("bcryptjs");

const userSchema = Joi.object()
	.keys({
		email: Joi.string()
			.email()
			.required(),
		password: Joi.string().required()
	})
	.unknown(true);

exports.validateRequest = (req, res, next) => {
	userSchema
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

exports.getUsers = (req, res) => {
	//TODO: manejar unauthorized(401)
	User.findAll()
		.then(users => {
			res.json(users);
		})
		.catch(err => {
			res.status(500).json({
				code: 0,
				message: err.errors.map(e => e.message)
			});
		});
};

exports.createUser = (req, res) => {
	const { password, ...data } = req.body;
	const hashedPassword = password && bcrypt.hashSync(password, 8);
	console.log(hashedPassword);
	User.create({
		email: req.body.email,
		password: hashedPassword
	})
		.then(newUser => {
			res.status(201).json({
				metadata: {
					version: "1"
				},
				newUser
			});
		})
		.catch(err => {
			res.status(500).json({
				code: 0,
				message: err.errors.map(e => e.message)
			});
		});
};
