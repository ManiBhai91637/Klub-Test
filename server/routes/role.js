import express from 'express'
import controller from '../api/controller/role'
import path from 'path';
import authService from '../auth/auth.service'
class UserRoute {
    router
	
	constructor() {
		this.router = express.Router();
		this.routing()
	}
	routing() {
		this.router.get('/', authService.checkAuthorization(['superadmin']), controller.getRoles)
			.post('/', authService.checkAuthorization(['superadmin']), controller.createRole)
			.put('/:id', authService.checkAuthorization(['superadmin']), controller.updateRole)
			.delete('/:id', authService.checkAuthorization(['superadmin']), controller.deleteRole)
				
	}
}

export default new UserRoute().router;