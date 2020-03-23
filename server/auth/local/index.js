

import express from 'express'
import passport from 'passport'
import auth from '../auth.service'
import User from '../../model/user'

let router = express.Router()

router.post('/', (req, res, next) => {

	passport.authenticate('local', (err, user, info) => {
		let error = err || info ;
		if(error){
			console.log(error);
			return res.status(401).json(error)
		}
		if(!user){
			console.log("User Not Found");
			return res.status(404).json({message: 'User Not Found.'})
		}
		let userDetail = {}
		userDetail.first_name = user.first_name;
		userDetail.last_name = user.last_name;
		userDetail.speciality = user.speciality;
		userDetail.email = user.email;
		userDetail.title = user.title;
        // userDetail.profile_pic_url = user.profile_pic_url ? user.profile_pic_url : ""
        userDetail.is_presenter = user.is_presenter
		userDetail.role = user.role
		userDetail.id = user.id
		userDetail.therapy_type = user.therapy_type;
		userDetail.hospital = user.hospital;
		userDetail.title_logo = user.title_logo;
		userDetail.last_login = user.last_login;
		let token = auth.signToken(user.id);

		res.cookie('token', token);
		User.update({last_login: new Date()}, {
			where: {
				id: user.id
			}
		})
		.then((updatedUser)=>{
			if (userDetail.last_login) {
				res.json({ 
		            isLogin: true,
		            token : token,
		            user: userDetail
	        	}).end();
	        } else {
	        	res.json({ 
		            isFirstLogin: true,
		            token : token
	        	}).end()
	        }
		})
		
	})(req, res, next)
})

export default router;
