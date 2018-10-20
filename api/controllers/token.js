const firebase = require("firebase");
const serviceAccount = require("../../serviceAccountKey.json");
const Joi = require("joi");

/* admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://shared-server-d9ab0.firebaseio.com"
}); */
var config = {
	apiKey: "AIzaSyAZjcNnV6A7snkqaFMeHAuXeccVRyi6VBA",
	authDomain: "shared-server-d9ab0.firebaseapp.com",
	databaseURL: "https://shared-server-d9ab0.firebaseio.com",
	projectId: "shared-server-d9ab0",
	storageBucket: "shared-server-d9ab0.appspot.com",
	messagingSenderId: "13434219476"
};
firebase.initializeApp(config);

const tokenSchema = Joi.object().keys({
	username: Joi.string()
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

exports.generateToken = (req, res) => {
	firebase
		.auth()
		.signInWithEmailAndPassword(req.body.username, req.body.password)
		.then(userRecord => {
			console.log(userRecord.user.getIdToken);
			res.status(201).json({
				metadata: {
					version: "1"
				},
				token: {
					expiresAt: userRecord.user,
					token: userRecord.user
					//TODO: devolver bien la data
				}
			});
		})
		.catch(err => {
			res.status(401).json(err);
		});
};
