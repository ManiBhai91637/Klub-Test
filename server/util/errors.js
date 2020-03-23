
 const errors = {
	
	missing: {
		firstName: { code: 'FIRST_NAME_MISSING', msg: 'First name missing'},
		lastName: { code: 'LAST_NAME_MISSING', msg: 'Last name missing'},
		roleName: { code: 'ROLE_NAME_MISSING', msg: 'Role name missing'},
		role: { code: 'ROLE_DOES_NOT_EXIST', msg: 'Role does not exist'},
		user: { code: 'USER_DOES_NOT_EXIT', msg: 'User does not exist'},
		userId: { code: 'USER_ID_MISSING', msg: 'User id is missing'},
		roleId: { code: 'ROLE_MISSING', msg: 'Role is missing'},
		permissions: { code: 'PERMISSIONS_MISSING', msg: 'Role does not exist'},
		email: { code: 'EMAIL_MISSING', msg: 'Email is missing' },
		password: { code: 'PASSWORD_MISSING', msg: 'Password is missing.' }
	},
	invalid: {
		email: { code: 'INVALID_EMAIL', msg: 'Invalid email'},
		permissions: { code: 'INVALID_PERMISSIONS', msg: 'Invalid message'},

	},
	duplicate: {
		user: { code: 'USER_ALREADY_EXIST', msg: 'User already exist'},
		role: { code: 'ROLE_ALREADY_EXIST', msg: 'Role already exist'},
		users: { code: 'USERS_WITH_ROLE_EXIST', msg: 'Some Users with the given role exist.'},
		approve: { code: 'USER_ALREADy_APPROVED', msg: 'User already approved'}
	}
}

export default errors