
import RoleModel from '../../model/role'
import sequelize from 'sequelize'
const Op = sequelize.Op

class RoleService {
	atrributes = 'first_name last_name'
	constructor() {

	}

	createRole(body) {
		return RoleModel.create(body)
    }

    getRoles() {
    	return RoleModel.findAll({
    		atrributes: ['id', 'name', 'permissions']
    	})
    }

    getRoleByName(roleName) {
    	return RoleModel.findOne({
    		atrributes: ['id', 'name', 'permissions'],
    		where: {
    			name: roleName
    		}
    	})
    }

    getRoleById(id) {
    	return RoleModel.findOne({
    		atrributes: ['id', 'name', 'permissions'],
    		where: {
    			id
    		}
    	})
    }

    updateRole(roleId, body) {
        return RoleModel.update(body, {
        	where: {
        		id: roleId
        	}
        })
    }

    deleteRole(roleId) {
    	return RoleModel.destroy({
        	where: {
        		id: roleId
        	}
        })
    }

	
}


export default new RoleService();





































