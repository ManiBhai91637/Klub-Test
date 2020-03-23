
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { Strategy } from 'passport-local';


let localAuthenticate = function (userModel, email, password, cb) {
	console.log('inside local strategy')

	return userModel.findOne({
		where: {
			email: email.toLowerCase()
		}
	})
	.then((user) => {
		if (!user) {
			return cb(null, false, {
				emailNotRegistered: true,
				message: 'Email Not Registered. '
			})
		}
		if (user && !user.is_active) {
			return cb(null, false, {
				isNotApproved: true,
				message: 'User not approved yet. '
			})
		}
		user.authenticate(password, (err, matched) => {
			if (err)
				return cb(err);
			else if (!matched)
				return cb(null, false, { invalidPassword: true, message: 'This password is not correct.' })
			else
				return cb(null, user);
		})

	})
	.catch((err) => {
		console.log(err)
		return cb(err)
	})
}


let setup = (userModel, config) => {
	passport.use(new Strategy({
		usernameField: 'email',
		passwordField: 'password' // this is the virtual field on the model
	}, (email, password, cb) => {
		return localAuthenticate(userModel, email, password, cb);
	}))
}

export default setup;

