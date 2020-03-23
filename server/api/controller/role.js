
import roleService from '../services/role'
import userService from '../services/user'
import Common from '../../util/common'

class RoleController {
    controller

    constructor() {

    }

    createRole(req, res) {

        let errors = [], isError = false;
        const { body } = req;
        return new Promise((resolve, reject) =>{
            if (!body.name) {
                isError = true;
                Common.handleError('missing', 'roleName', errors)
            }
            if (!body.permissions) {
                isError = true;
                Common.handleError('missing', 'permissions', errors)
            }
            if (!((body.permissions instanceof Array) && body.permissions.length)) {
                isError = true;
                Common.handleError('invalid', 'permissions', errors)
            }

            if (isError) {
                reject({validationError: true})
            }
            resolve(true)
        })
        .then( resolved => {
            return roleService.getRoleByName(body.name)
        })
        .then( role =>{
            if (role) {
                return Promise.reject({alreadyExist: true})
            }
            return roleService.createRole(body)
        })
        .then( created => {
            res.status(200).json({success: true})
        })
        .catch( err => {
            console.log(err)
            if(err.validationError) {
                res.status(422).json({errors})
            } else if(err.alreadyExist) {
                Common.handleError('duplicate', 'role', errors)
                res.status(409).json({errors})
            } else {
                console.log(err)
                res.status(500).json({msg: 'Something went wrong.'})
            }
        })
    }

    getRoles(req, res) {
        return roleService.getRoles()
        .then( roles =>{
            res.status(200).json({data: roles})
        })
        .catch( err =>{
            console.log(err)
            res.status(200).json({msg: 'Something went wrong.'})
        })
    }

    updateRole(req, res) {
        let errors = [], isError = false;
        const { body, params } = req;
        return new Promise((resolve, reject) =>{
            if (!body.name) {
                isError = true;
                Common.handleError('missing', 'roleName', errors)
            }
            if (!body.permissions) {
                isError = true;
                Common.handleError('missing', 'permissions', errors)
            }
            if (!((body.permissions instanceof Array) && body.permissions.length)) {
                isError = true;
                Common.handleError('invalid', 'permissions', errors)
            }

            if (isError) {
                reject({validationError: true})
            }
            resolve(true)
        })
        .then( resolved => {
            return roleService.getRoleById(params.id)
        })
        .then( role =>{
            if (!role) {
                return Promise.reject({roleNotExist: true})
            }
            return roleService.updateRole(params.id, body)
        })
        .then( updated => {
            res.status(200).json({success: true})
        })
        .catch( err => {
            console.log(err)
            if(err.validationError) {
                res.status(422).json({errors})
            } else if(err.roleNotExist) {
                Common.handleError('missing', 'role', errors)
                res.status(400).json({errors})
            } else {
                console.log(err)
                res.status(500).json({msg: 'Something went wrong.'})
            }
        })
    }

    // Delete a role by id. If any active user exist with the same role then throws an error
    deleteRole(req, res) {
        let errors = [], isError = false;
        const { params } = req;
        
        return roleService.getRoleById(params.id)
        .then( role =>{
            if (!role) {
                return Promise.reject({roleNotExist: true})
            }
            return userService.getUsersByRole(params.id)
        })
        .then( users => {
            if (users && users.length) {
                return Promise.reject({usersWithRoleExist: true})
            }
            return roleService.deleteRole(params.id)
        })
        .catch( err => {
            if (err.roleNotExist) {
                Common.handleError('missing', 'role', errors)
                res.status(400).json({errors})
            } else if (err.usersWithRoleExist) {
                Common.handleError('duplicate', 'users', errors)
                res.status(400).json({errors})
            } else {
                console.log(err)
                res.status(500).json({msg: 'Something went wrong.'})
            }
        })
    }


}
export default new RoleController();





