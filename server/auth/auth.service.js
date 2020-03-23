
import jwt from 'jsonwebtoken'
import appConfig from '../config/index'
import UserModel from '../model/user'
import RoleModel from '../model/role'
import compose from 'composable-middleware'
class AuthService {
	service

	constructor() {

	}

	signToken(id) {
		return jwt.sign({
	 		id: id
	 	}, appConfig.secret.key, {
	 		expiresIn: 60 * 60 * 30
	 	})
	}

	isAuthenticated() {
		return compose()
		//Authenticating user by token
	 	.use((req, res, next) =>{
			if(req.query && req.query.hasOwnProperty('access_token')){
				req.headers.authorization = 'Bearer ' + req.query.access_token;	
			}
			if (!req.headers.authorization) {
	 			console.log("Empty header")
	    		return res.status(401).end('Access Denied : No Auth Token Provided');
	    	}

			const token = req.headers.authorization.split(' ')[1];
			jwt.verify(token, appConfig.secret.key, (err, decoded) => {
		    	if (err || !decoded) {
		    		console.log("Error in token decode");
		    		console.log(err)
		    		return res.status(401).json({invalidToken: true}).end(err);
		    	}
				const userId = decoded.id;
				req.user ={};
				req.user.id= userId;
				next();
			})
		})
		// Attach user to request
		.use((req, res, next) => {
			return UserModel.findOne({
				where: {
					id: req.user.id
				},
				include: [{
					model: RoleModel
				}]
			}).then((resultUser) => {
				if(!resultUser)
					res.status(401).end();
				else{
					req.user = resultUser;			
					next();
				}
			}).catch((err) => {
				console.log("Error in Auth check: ", err);
				next(err);
			})
		})
	}

	checkAuthorization (roles=[]) {
		
		if (typeof roles === 'string') { // roles param can be a single role string or an array of roles 
	        roles = [roles];
	    }

	    return compose()
	 	.use((req, res, next) =>{
			const {role} = req.user;
			const access = req.method.toLowerCase();
			if (!role) {
				return res.status(401).json({ message: 'Unauthorized' });
			} else if (roles.length && (!roles.includes(role.name) || !role.permissions.includes(access))) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }
            next();
		})
	}

}

export default new AuthService();