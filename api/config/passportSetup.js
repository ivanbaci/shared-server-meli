const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const passportJWT = require("passport-jwt");

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require("../models/user");

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findOne({ _id: id }).then(user => {
		done(null, user);
	});
});

// Local
passport.use(
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password"
		},
		(email, password, done) => {
			// this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
			return User.findOne({ email, password })
				.then(user => {
					if (!user) {
						return done(null, false, {
							message: "Incorrect email or password."
						});
					}
					return done(null, user, {
						message: "Logged In Successfully"
					});
				})
				.catch(err => done(err));
		}
	)
);

// JWT
passport.use(
	new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: "my-secret"
		},
		function(jwtPayload, done) {
			// find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
			return User.findOne({ _id: jwtPayload.id })
				.then(user => {
					return done(null, user);
				})
				.catch(err => {
					return done(err);
				});
		}
	)
);
