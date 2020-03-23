import express from 'express'
import controller from '../api/controller/user'
import path from 'path';
import authService from '../auth/auth.service'
class UserRoute {
    router
	
	constructor() {
		this.router = express.Router();
		this.routing()
	}
	routing() {
		this.router
			.post('/', authService.checkAuthorization(['superadmin', 'admin']), controller.createUser)
			.get('/', authService.checkAuthorization(['superadmin', 'admin', 'user']), controller.getAllUsers)
			.get('/:id', authService.checkAuthorization(['superadmin', 'admin', 'user']), controller.getUserById)
			.put('/approve', authService.checkAuthorization(['superadmin']), controller.approveUser)
			.put('/', authService.checkAuthorization(['superadmin', 'admin', 'user']), controller.updateUser)
			.delete('/:id', authService.checkAuthorization(['superadmin', 'admin']), controller.deleteUser)
				
	}
}

export default new UserRoute().router;