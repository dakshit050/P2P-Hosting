const express = require("express");
const routes = express.Router();
const PasswordHash = require("password-hash");
const passport = require("passport");
const Users = require("../models/users.model");
routes.get("/login", (req, res) => {
	res.render("login");
});

routes.get("/register", (req, res) => {
	res.render("register");
});

routes.post("/register", async (req, res) => {
	const { name, email, password, password2 } = req.body;
	let errors = [];

	if (!name || !email || !password || !password2) {
		errors.push({ msg: "Please enter all fields" });
	}

	if (password != password2) {
		errors.push({ msg: "Passwords do not match" });
	}

	if (password.length < 6) {
		errors.push({ msg: "Password must be at least 6 characters" });
	}

	if (errors.length > 0) {
		return res.render("register", {
			errors,
			name,
			email,
			password,
			password2,
		});
	} else {
		const user = await Users.findOne({ "Email": email });
		if (user) {
			errors.push({ msg: "Email already exists" });
			return res.render("register", {
				errors,
				name,
				email,
				password,
				password2,
			});
		}
		const newUser = Users();
		newUser.Name = name;
		newUser.Email = email;
		newUser.Password = PasswordHash.generate(password);
		await newUser.save();
		req.flash("success_msg", "You are now registered and can log in");
		return res.redirect("/users/login");
		/* 		let sql = `SELECT id FROM users WHERE email='${email}'`;
		database.query(sql, (err, result) => {
			if (result.length > 0) {
				errors.push({ msg: "Email already exists" });
				res.render("register", {
					errors,
					name,
					email,
					password,
					password2,
				});
			} else {
				const hash = PasswordHash.generate(password);
				let sql = `INSERT INTO users (name,email,password) Values(
                    '${name}',
                    '${email}',
                    '${hash}'
                )`;
				database.query(sql, (err, result) => {
					if (err) {
						throw err;
					}
					req.flash("success_msg", "You are now registered and can log in");
					res.redirect("/users/login");
				});
			}
		}); */
	}
});

routes.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/sites/allsites",
		failureRedirect: "/users/login",
		failureFlash: true,
	})(req, res, next);
});

routes.get("/logout", (req, res) => {
	req.logout();
	req.flash("success_msg", "You are logged out");
	res.redirect("/users/login");
});

module.exports = routes;
