const passport = require("passport");
const localStratergy = require("passport-local").Strategy;
const PasswordHash = require("password-hash");
const Users = require("../models/users.model");
passport.use(
	new localStratergy(
		{
			usernameField: "email",
		},
		async function (email, password, done) {
			const user = await Users.findOne({ email: email });
			if (!user) {
				return done(null, false, { message: "Email Or Password Does not match" });
			}
			if (PasswordHash.verify(password, user.Password)) {
				return done(null, user);
			} else {
				return done(null, false, { message: "Email Or Password Does not match" });
			}
			//let sql = `SELECT * FROM users WHERE email= "${email}"`;
			/* 			database.query(sql, (err, result) => {
				if (err) {
					return done(err);
				}
				if (result.length > 0) {
					if (PasswordHash.verify(password, result[0].password)) {
						return done(null, result[0]);
					} else {
						return done(null, false, { message: "Email Or Password Does not match" });
					}
				} else {
					return done(null, false, { message: "Email Or Password Does not match" });
				}
			}); */
		}
	)
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
	const user = await Users.findById(id);
	delete user.Password;
	done(null, user);
	/* let sql = `SELECT * FROM users WHERE id= "${id}"`;
	database.query(sql, (err, user) => {
		done(err, user[0]);
	}); */
});
