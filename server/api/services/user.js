

import UserModel from '../../model/user'
import RoleModel from '../../model/role'
import authService from '../../auth/auth.service'
import sequelize from 'sequelize'
const Op = sequelize.Op
import * as _ from 'lodash'

class UserService {
	atrributes = 'first_name last_name'
	constructor() {

	}

	getUserByEmail (email) {
		return UserModel.findOne({
			where: { email }
		})
	}

	getUserById (id, role) {
		let attributes = ['id', 'first_name', 'last_name'], where = {is_active: true, id};
		if (role === 'admin' || role === 'superadmin') {
			attributes.push('email');
			attributes.push('role_id');
			attributes.push('is_active');
			attributes.push('created_at');
			if (role === 'superadmin') {
				attributes.push('updated_at')
			}
			delete where.is_active;
		}

		return UserModel.findOne({
			attributes: attributes,
			where
		})
	}

	getUsersByRole (roleId) {
		let attributes = ['id', 'first_name', 'last_name', 'email', 'is_active', 'created_at'], where = {role_id: roleId};
		if (role === 'superadmin') {
			attributes.push('updated_at');
			delete where.is_active;
		}

		return UserModel.findAll({
			attributes: attributes,
			where
		})
	}

	createUser (body) {

		return new UserService().getUserByEmail(body.email.toLowerCase().trim())
		.then( user => {
			if(user) {
				return Promise.reject({userAlreadyExist: true})
			}
			body.email = body.email.toLowerCase().trim();
			return UserModel.create(body)
		})
	}

	getAllUsers (query, currentUser) {
		let where = {}
		if(currentUser.role == 'user') {
			where.is_active = true
		}
		const limit = query.limit || 10 // default limit is 10
		const offset = query.page ? parseInt(query.page)*limit : 0 // page starts from 0
		
		return UserModel.findAndCountAll({
			attributes: ['id', 'first_name', 'last_name', 'is_active'],
			where: where,
			include: {
				attributes: ["name"],
				model: RoleModel
			},
			limit,
			offset
		})
		
	}

	updateUser (userId, body) {

		return UserModel.update(body, {
			where: {
				id: userId
			},
			individualHooks: true,
			returning: true
		})
	}

	changePassword (userId, body) {
		console.log('userId')
		console.log(body.userId)
		return UserModel.findOne({
			where: {
				id: userId
			}
		})
		.then(user =>{
			if (!body.isByAdmin) {
				return new Promise((resolve, reject) =>{
					user.authenticate(body.oldPassword, (err, matched) => {
						if (err)
							return reject(err);
						else if (!matched)
							return reject({isOldPasswordNotMatched: true});
						else
							return resolve(true);
					})
				})
			} else if (body.isByAdmin) {
				userId = body.userId || userId;
				return user;
			}
			
		})
		.then( isMatched =>{
			return this.updateUser(userId, {password: body.newPassword, last_login: new Date()})
		})
	}

	deleteUser (userId, body) {
		return UserModel.update({is_active: false}, {
			where: {
				id: userId
			}
		})
	}

	approveUser (body) {
		
	}

	bulkCreateUser (users = [], res, cb) {
		
	}

	
}


export default new UserService();





































