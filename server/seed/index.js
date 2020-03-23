import UserModel from '../model/user'
import RoleModel from '../model/role'

import UserData from './user'
import RoleData from './role'

module.exports.seed = ()=>{
	return RoleModel.create(RoleData)
	.then(()=>{
		return UserModel.create(UserData)
	})
}
