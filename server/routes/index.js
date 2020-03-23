
import app from '../app'
import userRoutes from './user'
import roleRoutes from './role'
import publicRoutes from './public'
import auth from '../auth'
import path from 'path'
import url from 'url';

class CentralRoute {
	
	constructor() {
		this.initiateRoutes(app)
	}

	initiateRoutes(app) {

		app.use('/auth', auth)
		app.use('/api/user', userRoutes)
		app.use('/public/api', publicRoutes)
		app.use('/api/role', roleRoutes)
	}
}

export default new CentralRoute();