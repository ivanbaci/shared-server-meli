const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");
//const Joi = require("joi");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://shared-server-d9ab0.firebaseio.com"
});

/* exports.validateRequest = {
	body: {
		username: Joi.string()
			.email()
			.required(),
		password: Joi.string().required()
	}
}; */

exports.generateToken = (req, res) => {
	console.log(req.body.username);
	admin
		.auth()
		.getUserByEmail(req.body.username)
		.then(userRecord => {
			res.status(201).json({
				metadata: {
					version: "1"
				},
				token: {
					expiresAt: userRecord.tokensValidAfterTime,
					token: userRecord.uid
				},
				userRecord
			});
		});
	//TODO: manejar errores
};
