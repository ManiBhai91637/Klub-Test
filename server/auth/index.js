
import express from 'express'
import local from './local'
import localPassport from './local/passport'
import userModel from '../model/user'
import userController from '../api/controller/user'

class UserAuth {
	router

	constructor () {
		localPassport(userModel)
		this.authRoutes()
	}

	authRoutes () {
		this.router = express.Router()
		this.router.post('/user', userController.createUser)
		this.router.use('/local', local)
	}

}

export default new UserAuth().router;


