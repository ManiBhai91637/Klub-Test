
import userService from '../services/user'
import roleService from '../services/role'
import authService from '../../auth/auth.service'
import Common from '../../util/common'

class UserController {
    controller

    constructor() {

    }

    getUserByEmail(req, res) {
        let params = req.query;
        let msg = '';

        return new Promise((resolve, reject) => {
            if (!params) { msg = 'Body Missing'; reject(msg) }
            if (!params.email) { msg = 'Email Missing'; reject(msg) }
            return resolve(true)

        })
            .then(resolved => {
                return userService.getUserByEmail(params)
            })
            .then(user => {
                res.status(200).json({ data: user })
            })
            .catch(err => {
                console.log(err)
                if (err.userAlreadyExist)
                    res.status(422).json({ success: false, msg: 'User Already Exist' })
                else
                    res.status(422).json({ Error: err })
            })
    }

    createUser(req, res) {
        let errors = [], isError = false;
        let { body, user } = req;
        const isAdmin = user ? true : false
        return new Promise((resolve, reject) =>{
            if (!body.first_name) {
                isError = true;
                Common.handleError('missing', 'firstName', errors)
            }
            if (!body.email) {
                isError = true;
                Common.handleError('missing', 'email', errors)
            }
            if (!body.password) {
                isError = true;
                Common.handleError('missing', 'password', errors)
            }
            if (isAdmin && !body.role_id) {
                isError = true;
                Common.handleError('missing', 'roleId', errors)
            }

            if (isError) {
                reject({validationError: true})
            }
            resolve(true)
        })
        .then(resolved => {
            return userService.getUserByEmail(body.email)
        })
        .then( user =>{
            if (user) {
                return Promise.reject({userAlreadyExist: true})
            } else {
                body = isAdmin ? body : {...body, is_active: false, role_id: null} 
                return userService.createUser(body)
            }
        })
        .then(user => {
            res.status(200).json({ success: true })
        })
        .catch(err => {
            if (err.validationError) {
                res.status(422).json({ errors })
            } else if (err.userAlreadyExist) {
                Common.handleError('duplicate', 'user', errors)
                res.status(409).json({ errors })
            } else {
                console.log(err)
                res.status(500).json({ msg: 'Something went wrong' })
            }
        })
    }

    getUserById(req, res) {
        let userDetails = {}
        const { params, user } = req;
        return userService.getUserById(params.id, user.role.name)
        .then ((user)=>{
            res.status(200).json({ data: user })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ Error: err })
        })
    }

    getAllUsers(req, res) {
        const { query } = req;
        return userService.getAllUsers(query, req.user)
            .then(users => {
                res.status(200).json({ data: users })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ Error: err })
            })
    }

    updateUser(req, res) {
        let errors = [], isError = false;
        let { body, user, params } = req;
        const role = user.role && user.role.name || null
        const isAdmin = role && (role === 'superadmin' || role === 'admin') ? true : false
        const userId = (isAdmin && body.user_id) ? body.user_id : user.id;

        return userService.getUserById(userId, role)
        .then( user =>{
            if (!user) {
                return Promise.reject({userDoesNotExist: true})
            } else {
                // Not allowing to change sensetive information if mistakenly taken through this API
                delete body.id;
                delete body.user_id;
                delete body.password;
                delete body.is_active;
                delete body.role_id;
                
                return userService.updateUser(userId, body)
            }
        })
        .then( updated => {
            res.status(200).json({ success: true })
        })
        .catch(err => {
            if (err.validationError) {
                res.status(422).json({ errors })
            } else if (err.userDoesNotExist) {
                Common.handleError('missing', 'user', errors)
                res.status(400).json({ errors })
            } else {
                console.log(err)
                res.status(500).json({ msg: 'Something went wrong' })
            }
        })
    }

    deleteUser(req, res) {
        const { params } = req;
        return userService.deleteUser(params.id)
        .then(user => {
            res.status(200).json({ success: true })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ Error: err })
        })
    }

    approveUser(req, res) {
        let errors = [], isError = false
        const { params, user, body } = req;
        const userId = body.id;
        return new Promise((resolve, reject) => {
            if (!body.id) {
                isError = true;
                Common.handleError('missing', 'userId', errors)
            }
            if (!body.role_id) {
                isError = true;
                Common.handleError('missing', 'roleId', errors)
            }

            if (isError) {
                reject({validationError: true})
            }
            resolve(true)

        })
        .then(resolved => {
            return Promise.all([
                userService.getUserById(body.id, user.role.name),
                roleService.getRoleById(body.role_id)
            ])
            
        })
        .then( promises =>{
            const [user, role] = promises;

            if (!user) {
                return Promise.reject({userDoesNotExist: true})
            } else if (user.is_active && user.role_id) {
                return Promise.reject({userAlreadyApproved: true})
            } else if (!role) {
                return Promise.reject({roleDoesNotExist: true})
            } else {
                const approvalBody = {
                    is_active: true,
                    role_id: body.role_id
                }
                return userService.updateUser(userId, approvalBody)
            }
            
        })
        .then(user => {
            res.status(200).json({ success: true })
        })
        .catch(err => {
            if(err.validationError) {
                res.status(422).json({errors})
            } else if (err.userDoesNotExist){
                Common.handleError('missing', 'user', errors)
                res.status(500).json({ errors })
            } else if (err.userAlreadyApproved) {
                Common.handleError('duplicate', 'approve', errors)
                res.status(409).json({ errors })
            } else if (err.roleDoesNotExist) {
                Common.handleError('missing', 'role', errors)
                res.status(400).json({ errors })
            } else {
                console.log(err)
                res.status(500).json({ msg: 'Something went wrong' })
            }
        })
    }

}
export default new UserController();





